import {Component, computed, inject, InjectionToken, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {
  MnButton,
  MnButtonTypes,
  MnInputField,
  MnInputProps,
  MnLanguageService,
  MnSectionDirective,
  MnTextarea,
  MnTextareaProps,
  MnTranslatePipe,
  provideMnComponentConfig
} from 'mn-angular-lib';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {EyebrowComponent} from '../../../../components/eyebrow/eyebrow';
import {notBlank, SUBMISSION_EMAIL_PATTERN, SubmissionService} from '../../../../services/submission.service';

/**
 * Injected configuration for the contact section.
 *
 * The channel copy (email, phone, location) is read straight from i18n in the
 * template; this config only carries the section's prose and the note's printed
 * salutation/closing.
 */
export interface ContactSectionConfig {
  /** Lead paragraph shown beside the contact channels. */
  informationDescription?: string;
  /** Supporting line describing what to put in the message. */
  formDescription?: string;
  /** Label for the send button. */
  formButtonText?: string;
  /** Opening line printed atop the note card. */
  emailSalutation?: string;
  /** Closing line printed above the note's signature. */
  emailClosing?: string;
  /** Direct address shown as a fallback when sending fails. */
  contactEmail?: string;
}

/** DI token exposing the resolved {@link ContactSectionConfig}. */
export const APP_CONTACT_SECTION_COMPONENT_CONFIG = new InjectionToken<ContactSectionConfig>('APP_CONTACT_SECTION_CONFIG');

/** A single direct contact channel rendered in the left-hand list. */
interface ContactChannel {
  /** i18n key for the channel label (e.g. "Email"). */
  labelKey: string;
  /** i18n key for the channel value (address, number or region). */
  valueKey: string;
  /** `mailto:`/`tel:` target, or `null` for non-actionable rows (location). */
  href: string | null;
}

/** Lifecycle of a contact-form submission. */
type SendState = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Contact section for the `/contact` page.
 *
 * Presents the send-a-message form as an honest note to the two founders: the
 * card is framed by a printed salutation and closing, and the closing signs
 * itself with the visitor's name as they type. Submitting stores the message in
 * Firestore via {@link SubmissionService}; the visitor stays on the page.
 */
@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [
    MnInputField,
    ReactiveFormsModule,
    MnButton,
    MnSectionDirective,
    MnTextarea,
    MnTranslatePipe,
    EyebrowComponent,
    RouterLink,
  ],
  providers: [
    provideMnComponentConfig<ContactSectionConfig>(APP_CONTACT_SECTION_COMPONENT_CONFIG, 'app-contact-section'),
  ],
  templateUrl: './contact-section.html',
})
export class ContactSectionComponent {

  /** Section copy and note framing resolved from `mn-config.json5`. */
  protected readonly componentConfig = inject(APP_CONTACT_SECTION_COMPONENT_CONFIG);

  /** Stores the message in Firestore. */
  private readonly submissions = inject(SubmissionService);

  /** Current state of the submission, driving the button and result messages. */
  protected readonly sendState = signal<SendState>('idle');

  /** Translation service, used to build the reactive input placeholders. */
  private readonly language = inject(MnLanguageService);

  /**
   * Current locale as a signal so the placeholder props below recompute when the
   * visitor switches language.
   */
  private readonly locale = toSignal(this.language.locale$, {initialValue: this.language.locale});

  /**
   * The active locale wrapped in a single-element array, used as an `@for` key
   * around the text inputs so they are re-created on language switch.
   *
   * `mn-input-field` resolves its `props` only on init and on its own locale
   * subscription (which fires before Angular pushes the recomputed `props`),
   * so a plain binding leaves the translated placeholder one switch behind.
   * Re-creating the input makes it read the fresh `props` on init instead; the
   * reactive `FormControl` restores the typed value into the new instance.
   */
  protected readonly localeGroup = computed(() => [this.locale()]);

  /**
   * Message form: name, email, subject and message are required before sending
   * is enabled. `website` is a honeypot hidden from people; bots that fill it in
   * get a fake success and nothing is stored.
   */
  form = new FormGroup({
    name: new FormControl('', { validators: [notBlank, Validators.maxLength(200)] }),
    email: new FormControl('', { validators: [notBlank, Validators.pattern(SUBMISSION_EMAIL_PATTERN), Validators.maxLength(254)] }),
    subject: new FormControl('', { validators: [notBlank, Validators.maxLength(200)] }),
    description: new FormControl('', { validators: [notBlank, Validators.maxLength(5000)] }),
    website: new FormControl(''),
  });

  /**
   * Live value of the name field, used to sign the note's closing as the
   * visitor types. Falls back to an empty string before any input.
   */
  protected readonly nameValue = toSignal(this.form.controls.name.valueChanges, { initialValue: '' });

  /**
   * The direct-contact channels shown beside the form. Email and phone carry
   * stable `mailto:`/`tel:` targets; the location row is informational only.
   */
  protected readonly channels: ContactChannel[] = [
    { labelKey: 'home.contact.email.title', valueKey: 'home.contact.email.description', href: 'mailto:info@slopeworks.nl' },
    { labelKey: 'home.contact.call.title', valueKey: 'home.contact.call.description', href: 'tel:+32468411287' },
    { labelKey: 'home.contact.location.title', valueKey: 'home.contact.location.description', href: null },
  ];

  /**
   * Props for the name input, including a translated placeholder.
   *
   * `mn-input-field` overwrites its config-resolved placeholder with `props`, so
   * (unlike the textarea) the placeholder must be supplied here rather than in
   * `mn-config.json5`. Kept as a `computed` so it re-resolves on language switch.
   */
  protected readonly nameProps = computed<MnInputProps>(() => {
    this.locale();
    return {id: 'name', type: 'text', placeholder: this.language.translate('home.contact.form.name.placeholder')};
  });

  /** Props for the email input, including a translated placeholder. See {@link nameProps}. */
  protected readonly emailProps = computed<MnInputProps>(() => {
    this.locale();
    return {id: 'email', type: 'email', placeholder: this.language.translate('home.contact.form.email.placeholder')};
  });

  /** Props for the subject input, including a translated placeholder. See {@link nameProps}. */
  protected readonly subjectProps = computed<MnInputProps>(() => {
    this.locale();
    return {id: 'subject', type: 'text', placeholder: this.language.translate('home.contact.form.subject.placeholder')};
  });

  /** Props for the message textarea. */
  descriptionProps = {
    id: 'description',
    resize: 'none',
    rows: 5
  } satisfies MnTextareaProps;

  /** Base styling for the send button; disabled/loading state is applied per render. */
  formButton: MnButtonTypes = {
    color: 'primary',
    size: 'md',
    variant: 'fill',
    borderRadius: 'xl',
    hover: true,
  };

  /** Send-button config with its disabled/loading state bound to form validity and sending. */
  get formButtonData(): MnButtonTypes {
    const sending = this.sendState() === 'sending';
    return {
      ...this.formButton,
      disabled: this.form.invalid || sending,
      loading: sending,
    };
  }

  /**
   * Stores the message in Firestore and shows the result in place of the form.
   *
   * Does nothing while the form is invalid or already sending. A filled-in
   * honeypot is treated as sent without storing anything.
   */
  async submit(): Promise<void> {
    if (this.form.invalid || this.sendState() === 'sending') {
      return;
    }
    if (this.form.controls.website.value) {
      this.sendState.set('sent');
      return;
    }

    const {name, email, subject, description} = this.form.getRawValue();
    this.sendState.set('sending');
    try {
      await this.submissions.submitContact({
        name: (name ?? '').trim(),
        email: (email ?? '').trim(),
        subject: (subject ?? '').trim(),
        message: (description ?? '').trim(),
      });
      this.sendState.set('sent');
      this.form.reset();
    } catch {
      this.sendState.set('error');
    }
  }

  /** Returns from the thank-you message to an empty form. */
  writeAnother(): void {
    this.sendState.set('idle');
  }

}
