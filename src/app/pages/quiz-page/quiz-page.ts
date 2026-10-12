import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injector,
  signal,
} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {LucideArrowRight} from '@lucide/angular';
import {RevealDirective} from '../../components/reveal/reveal';
import {MnLanguageService, MnTranslatePipe} from 'mn-angular-lib/core';
import {MnButton, MnButtonTypes} from 'mn-angular-lib/button';
import {MnCheckbox, MnCheckboxProps, MnInputField, MnInputProps} from 'mn-angular-lib/forms';
import {FORM_FIELD_CLASS, formFieldText} from '../../components/form-fields';
import {notBlank, SUBMISSION_EMAIL_PATTERN, SubmissionService} from '../../services/submission.service';
import {
  Destination,
  DESTINATIONS,
  DESTINATION_NAME,
  DESTINATION_SLUG,
  evaluateQuiz,
  Option,
  PRICE_LEVEL,
  QuizAnswers,
  QuizResult,
  QuizVersion,
  TripStyle,
} from './quiz-engine';

/** One screen of the scan: which answer it fills and how many options it has. */
interface QuizStep {
  /** Answer field this step fills (also its i18n segment). */
  key: keyof QuizAnswers;
  /** Number of answer options (Q6 has three). */
  optionCount: number;
}

/** The eight screens in order: Q1–Q7, then the practical group-size question. */
const STEPS: QuizStep[] = [
  {key: 'q1', optionCount: 4},
  {key: 'q2', optionCount: 4},
  {key: 'q3', optionCount: 4},
  {key: 'q4', optionCount: 4},
  {key: 'q5', optionCount: 4},
  {key: 'q6', optionCount: 3},
  {key: 'q7', optionCount: 4},
  {key: 'group', optionCount: 4},
];

/**
 * Photo shown beside each question, from the site's own scouting library, so
 * every screen has a picture of what the question is about.
 */
const STEP_PHOTO: Record<keyof QuizAnswers, string> = {
  q1: '/images/carousel_1.webp',
  q2: '/images/gallery/solden-gaislachkogl.webp',
  q3: '/images/proof/raclettewandeling.webp',
  q4: '/images/gallery/gstaad-golfhotel.webp',
  q5: '/images/gallery/solden-schirmbar.webp',
  q6: '/images/about_us_1.webp',
  q7: '/images/gallery/mayrhofen-zillertalerhof.webp',
  group: '/images/destinations/mayrhofen.webp',
};

/** Number of numbered questions ("Vraag n van 7"); the group question comes after. */
const QUESTION_COUNT = 7;

/** i18n segment of each destination's result and alternative texts. */
const RESULT_KEY: Record<Destination, string> = {MAY: 'may', ZELL: 'zell', SOLD: 'sold', KITZ: 'kitz', STAN: 'stan', GST: 'gst'};

/** i18n key of each destination's country and region line, shared with the destinations overview. */
const COUNTRY_KEY: Record<Destination, string> = {
  MAY: 'destinations.mayrhofen.country',
  ZELL: 'destinations.zellamsee.country',
  SOLD: 'destinations.solden.country',
  KITZ: 'destinations.kitzbuhel.country',
  STAN: 'destinations.stanton.country',
  GST: 'destinations.gstaad.country',
};

/** How many body paragraphs and "keep in mind" paragraphs each result has. */
const RESULT_SHAPE: Record<Destination, {paragraphs: number; cautions: number}> = {
  MAY: {paragraphs: 2, cautions: 2},
  ZELL: {paragraphs: 1, cautions: 1},
  SOLD: {paragraphs: 1, cautions: 2},
  KITZ: {paragraphs: 1, cautions: 2},
  STAN: {paragraphs: 1, cautions: 2},
  GST: {paragraphs: 2, cautions: 3},
};

/** i18n segment and paragraph count of each trip style. */
const STYLE_SHAPE: Record<TripStyle, {key: string; paragraphs: number}> = {
  REWARD: {key: 'reward', paragraphs: 4},
  BETTER_TOGETHER: {key: 'together', paragraphs: 3},
  RESET: {key: 'reset', paragraphs: 5},
};

/** Builds `count` i18n keys `<prefix>1` … `<prefix>count`. */
const numberedKeys = (prefix: string, count: number) => Array.from({length: count}, (_, i) => `${prefix}${i + 1}`);

/** Answer letters in order. */
const LETTERS: Option[] = ['A', 'B', 'C', 'D'];

/** Where the visitor is in the scan. */
type Phase = 'intro' | 'questions' | 'result';

/** Lifecycle of the "email me my result" form. */
type MailState = 'closed' | 'open' | 'sending' | 'sent';

/**
 * The Ski Trip Scan (`/welk-skigebied-past-bij-jullie-team`).
 *
 * Intro and version choice, then one question per screen (auto-advancing, with
 * a back button that keeps earlier answers), then a result built from
 * {@link evaluateQuiz}. The visitor can book an intake (contact page with the
 * subject pre-filled) or leave their details to get the result by email, which
 * stores the full scan in Firestore. Everything runs client-side without page
 * reloads; the intro is prerendered for SEO.
 */
@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [
    MnTranslatePipe,
    MnButton,
    MnInputField,
    MnCheckbox,
    ReactiveFormsModule,
    RouterLink,
    LucideArrowRight,
    RevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './quiz-page.html',
  styleUrl: './quiz-page.css',
})
export class QuizPage {

  /** Translation service, for texts built in code (form props, intake subject). */
  private readonly language = inject(MnLanguageService);

  /** Stores the scan when the visitor asks for the result by email. */
  private readonly submissions = inject(SubmissionService);

  /** Used to scroll after the next render. */
  private readonly injector = inject(Injector);


  /** Current locale, so form props re-translate on language switch. */
  private readonly locale = toSignal(this.language.locale$, {initialValue: this.language.locale});

  /** Current phase of the scan. */
  protected readonly phase = signal<Phase>('intro');

  /** Chosen copy version; `null` until the visitor picks one. */
  protected readonly version = signal<QuizVersion | null>(null);

  /** Index of the current screen in {@link STEPS}. */
  protected readonly stepIndex = signal(0);

  /** Answers given so far, kept when going back. */
  protected readonly answers = signal<Partial<QuizAnswers>>({});

  /** Number of numbered questions, for the progress label. */
  protected readonly questionCount = QUESTION_COUNT;

  /** The current screen. */
  protected readonly step = computed(() => STEPS[this.stepIndex()]);

  /** Whether the current screen is the unnumbered group-size question. */
  protected readonly isGroupStep = computed(() => this.step().key === 'group');

  /** Progress bar fill in percent; the group question counts as the last step. */
  protected readonly progress = computed(() => Math.round(((this.stepIndex() + 1) / STEPS.length) * 100));

  /** The six destinations the scan chooses between, shown on the intro. */
  protected readonly destinations = DESTINATIONS.map(d => ({
    name: DESTINATION_NAME[d],
    image: `/images/destinations/${DESTINATION_SLUG[d]}.webp`,
    countryKey: COUNTRY_KEY[d],
  }));

  /**
   * The three usual reasons a destination gets picked, shown in the intro as
   * holiday snaps: a gallery photo of the place, its name and the reasoning.
   */
  protected readonly reasons = [
    {name: 'Sölden', photo: '/images/gallery/solden-schirmbar.webp', key: 'quiz.intro.example1'},
    {name: 'Mayrhofen', photo: '/images/gallery/mayrhofen-kaiserschmarrn.webp', key: 'quiz.intro.example2'},
    {name: 'Gstaad', photo: '/images/gallery/gstaad-saanenmoser.webp', key: 'quiz.intro.example3'},
  ];

  /** Photo and "why we ask this" text for the current question. */
  /**
   * Whether the screen is wide enough (Tailwind `lg`) for the photo column.
   * The column is only rendered there, so phones don't download its photos.
   * Always false while prerendering.
   */
  protected readonly isWide = signal(false);

  /** Tracks the `lg` breakpoint in the browser to show or hide the photo column. */
  private readonly trackWidth = afterNextRender(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    this.isWide.set(query.matches);
    query.addEventListener('change', e => this.isWide.set(e.matches));
  });

  /** Every question photo, rendered stacked so they load up front and crossfade. */
  protected readonly photos = [...new Set(Object.values(STEP_PHOTO))];

  protected readonly aside = computed(() => ({
    photo: STEP_PHOTO[this.step().key],
    whyKey: `quiz.why.${this.step().key}`,
  }));

  /** i18n key of the current question. */
  protected readonly questionKey = computed(() =>
    this.isGroupStep() ? 'quiz.group.question' : `quiz.${this.step().key}.${this.version()}.question`);

  /** Letter and i18n key of each option on the current screen. */
  protected readonly options = computed(() => LETTERS.slice(0, this.step().optionCount).map(letter => ({
    letter,
    key: this.optionKey(this.step(), letter),
  })));

  /** The answer already given on the current screen, if any. */
  protected readonly currentAnswer = computed(() => this.answers()[this.step().key]);

  /** The evaluated scan, once every question is answered. */
  protected readonly result = computed(() =>
    this.phase() === 'result' ? evaluateQuiz(this.answers() as QuizAnswers) : null);

  /** Everything the result screen shows, resolved to names, links and i18n keys. */
  protected readonly view = computed(() => {
    const r = this.result();
    if (!r) return null;
    const key = RESULT_KEY[r.winner];
    return {
      name: DESTINATION_NAME[r.winner],
      groupKey: `quiz.group.${(this.answers().group ?? 'A').toLowerCase()}`,
      route: `/bestemmingen/${DESTINATION_SLUG[r.winner]}`,
      priceKey: `quiz.price.${PRICE_LEVEL[r.winner]}`,
      leadKey: `quiz.result.${key}.lead`,
      paragraphKeys: numberedKeys(`quiz.result.${key}.p`, RESULT_SHAPE[r.winner].paragraphs),
      reasonKeys: numberedKeys(`quiz.result.${key}.r`, 5),
      cautionKeys: numberedKeys(`quiz.result.${key}.c`, RESULT_SHAPE[r.winner].cautions),
      ctaKey: `quiz.result.${key}.cta`,
      alternative: {
        name: DESTINATION_NAME[r.alternative],
        image: `/images/destinations/${DESTINATION_SLUG[r.alternative]}.webp`,
        countryKey: COUNTRY_KEY[r.alternative],
        route: `/bestemmingen/${DESTINATION_SLUG[r.alternative]}`,
        bodyKey: `quiz.alt.${RESULT_KEY[r.alternative]}`,
      },
      budgetKey: r.budgetNote ? `quiz.budget.${key}` : null,
    };
  });

  /** Query params for the intake button: the contact form's subject, pre-filled with the match. */
  protected readonly intakeQuery = computed(() => {
    this.locale();
    const view = this.view();
    return view ? {subject: this.language.translate('quiz.intakeSubject') + view.name} : {};
  });

  /** Keys of the "next step" paragraphs under every result. */
  protected readonly nextKeys = numberedKeys('quiz.next.p', 2);

  /** The three steps after the scan (call → research → proposal), shown as a numbered row. */
  protected readonly nextStepKeys = numberedKeys('quiz.next.step', 3);

  /** Yellow button with dark text (destination link, intake, form submit). */
  protected readonly primaryButton: MnButtonTypes = {color: 'primary', size: 'md', variant: 'fill', borderRadius: 'xl', hover: true};

  /** State of the "email me my result" form. */
  protected readonly mailState = signal<MailState>('closed');

  /** i18n key of the message above the form's submit button, if any. */
  protected readonly mailMessageKey = signal<string | null>(null);

  /**
   * Details for emailing the result. `website` is a honeypot hidden from people;
   * bots that fill it in get a fake success and nothing is stored.
   */
  protected readonly mailForm = new FormGroup({
    firstName: new FormControl('', {nonNullable: true, validators: [Validators.required, notBlank, Validators.maxLength(100)]}),
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, notBlank, Validators.pattern(SUBMISSION_EMAIL_PATTERN), Validators.maxLength(254)]}),
    company: new FormControl('', {nonNullable: true, validators: [Validators.maxLength(200)]}),
    newsletter: new FormControl(false, {nonNullable: true}),
    website: new FormControl('', {nonNullable: true}),
  });

  /** Host classes shared by every form field. */
  protected readonly fieldClass = FORM_FIELD_CLASS;

  /**
   * The locale wrapped in an array, used as an `@for` key so the inputs are
   * re-created (and re-read their translated props) on language switch.
   */
  protected readonly localeGroup = computed(() => [this.locale()]);

  /** Props for the first-name input. */
  protected readonly firstNameProps = computed<MnInputProps>(() => {
    this.locale();
    return {...formFieldText(this.language, 'quiz.mail', 'firstName'), id: 'quiz-first-name', type: 'text', autocomplete: 'given-name'};
  });

  /** Props for the email input. */
  protected readonly emailProps = computed<MnInputProps>(() => {
    this.locale();
    return {...formFieldText(this.language, 'quiz.mail', 'email'), id: 'quiz-email', type: 'email', autocomplete: 'email'};
  });

  /** Props for the optional company input. */
  protected readonly companyProps = computed<MnInputProps>(() => {
    this.locale();
    return {...formFieldText(this.language, 'quiz.mail', 'company'), id: 'quiz-company', type: 'text', autocomplete: 'organization'};
  });

  /** Props for the newsletter opt-in checkbox (unticked, never required). */
  protected readonly newsletterProps = computed<MnCheckboxProps>(() => {
    this.locale();
    return {id: 'quiz-newsletter', label: this.language.translate('quiz.mail.newsletter')};
  });

  /** Submit button with its sending state. */
  protected get submitButton(): MnButtonTypes {
    const sending = this.mailState() === 'sending';
    return {...this.primaryButton, disabled: sending, loading: sending};
  }

  /** The message above the submit button; the "incomplete" notice hides once the form is valid. */
  protected get visibleMailMessageKey(): string | null {
    const key = this.mailMessageKey();
    return key === 'quiz.mail.incomplete' && this.mailForm.valid ? null : key;
  }

  /**
   * Starts the scan in the chosen copy version.
   *
   * @param version Fun or serious copy; the scoring is identical.
   */
  start(version: QuizVersion): void {
    this.version.set(version);
    this.answers.set({});
    this.stepIndex.set(0);
    this.phase.set('questions');
    this.scrollToPanel();
  }

  /**
   * Records the answer for the current screen and moves on: to the next screen,
   * or to the result after the last one.
   *
   * @param letter The chosen option.
   */
  choose(letter: Option): void {
    this.answers.update(a => ({...a, [this.step().key]: letter}));
    if (this.stepIndex() < STEPS.length - 1) {
      this.stepIndex.update(i => i + 1);
    } else {
      this.phase.set('result');
    }
    this.scrollToPanel();
  }

  /** Goes back one screen, keeping the answer given there; from the first question, back to the intro. */
  back(): void {
    if (this.stepIndex() > 0) {
      this.stepIndex.update(i => i - 1);
    } else {
      this.phase.set('intro');
    }
    this.scrollToPanel();
  }

  /** Clears everything and returns to the version choice. */
  restart(): void {
    this.answers.set({});
    this.stepIndex.set(0);
    this.version.set(null);
    this.mailState.set('closed');
    this.mailMessageKey.set(null);
    this.mailForm.reset();
    this.phase.set('intro');
    this.scrollToPanel();
  }

  /** Shows the "email me my result" form. */
  openMailForm(): void {
    this.mailState.set('open');
  }

  /**
   * Stores the scan with the visitor's details. An incomplete form shows every
   * field's error instead; a filled-in honeypot fakes success without storing.
   */
  async submitMail(): Promise<void> {
    const result = this.result();
    if (!result || this.mailState() === 'sending') {
      return;
    }
    if (this.mailForm.invalid) {
      this.mailForm.markAllAsTouched();
      this.mailMessageKey.set('quiz.mail.incomplete');
      return;
    }
    const {firstName, email, company, newsletter, website} = this.mailForm.getRawValue();
    if (website) {
      this.mailState.set('sent');
      return;
    }

    this.mailMessageKey.set(null);
    this.mailState.set('sending');
    try {
      await this.submissions.subscribeQuiz({
        firstName: firstName.trim(),
        email: email.trim(),
        company: company.trim() || undefined,
        newsletter,
        ...this.readableScan(result),
      });
      this.mailState.set('sent');
    } catch (error) {
      const offline = !navigator.onLine || (error as {code?: string})?.code === 'unavailable';
      this.mailMessageKey.set(offline ? 'quiz.mail.error.offline' : 'quiz.mail.error.failed');
      this.mailState.set('open');
    }
  }

  /**
   * The scan in readable form for storage: destination names instead of codes,
   * and every answer as the text the visitor saw, under a numbered short
   * question label so the console lists them in order.
   *
   * @param result The evaluated scan.
   */
  private readableScan(result: QuizResult) {
    const t = (key: string) => this.language.translate(key);
    const answers = this.answers() as QuizAnswers;
    const answerText = (step: QuizStep) => t(this.optionKey(step, answers[step.key]));
    const scores: Record<string, number> = {};
    for (const [code, score] of Object.entries(result.scores)) {
      scores[DESTINATION_NAME[code as Destination]] = score;
    }
    return {
      match: DESTINATION_NAME[result.winner],
      alternative: DESTINATION_NAME[result.alternative],
      tripStyle: t(`quiz.style.${STYLE_SHAPE[result.tripStyle].key}.name`),
      budget: answerText(STEPS[6]),
      groupSize: `${answerText(STEPS[7])} ${t('quiz.pass.people')}`,
      budgetNote: result.budgetNote,
      answers: Object.fromEntries(STEPS.map(step => [t(`quiz.data.${step.key}`), answerText(step)])),
      scores,
    };
  }

  /**
   * i18n key of one answer option.
   *
   * @param step The screen the option belongs to.
   * @param letter The option letter.
   */
  private optionKey(step: QuizStep, letter: Option): string {
    return step.key === 'group'
      ? `quiz.group.${letter.toLowerCase()}`
      : `quiz.${step.key}.${this.version()}.${letter.toLowerCase()}`;
  }

  /**
   * Jumps to the top of the page once the new screen has rendered. The hero is
   * only shown on the intro, so every quiz screen starts at the top. Instant
   * rather than smooth, so the swap and the scroll happen together.
   */
  private scrollToPanel(): void {
    afterNextRender(() => window.scrollTo({top: 0, behavior: 'instant'}), {injector: this.injector});
  }
}
