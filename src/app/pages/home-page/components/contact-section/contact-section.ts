import {Component, computed, inject, InjectionToken} from '@angular/core';
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

/**
 * Injected configuration for the contact section.
 *
 * The channel copy (email, phone, location) is read straight from i18n in the
 * template; this config only carries the section's prose and the framing used
 * both to build the `mailto:` body and to print the note's salutation/closing.
 */
export interface ContactSectionConfig {
  /** Lead paragraph shown beside the contact channels. */
  informationDescription?: string;
  /** Supporting line describing what to put in the message. */
  formDescription?: string;
  /** Label for the send button. */
  formButtonText?: string;
  /** Opening line of the sent email, also printed atop the note card. */
  emailSalutation?: string;
  /** Closing line of the sent email, also printed above the note's signature. */
  emailClosing?: string;
  /** Address the message is delivered to. */
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

/**
 * Contact section for the `/contact` page.
 *
 * Presents the send-a-message form as an honest note to the two founders: the
 * card is framed by the same salutation and closing that the `mailto:` body
 * uses, and the closing signs itself with the visitor's name as they type. The
 * validated form and `sendEmail` mailto behaviour are unchanged.
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
  ],
  providers: [
    provideMnComponentConfig<ContactSectionConfig>(APP_CONTACT_SECTION_COMPONENT_CONFIG, 'app-contact-section'),
  ],
  templateUrl: './contact-section.html',
})
export class ContactSectionComponent {

  /** Section copy and email framing resolved from `mn-config.json5`. */
  protected readonly componentConfig = inject(APP_CONTACT_SECTION_COMPONENT_CONFIG);

  /** Translation service, used to build the reactive input placeholders. */
  private readonly language = inject(MnLanguageService);

  /**
   * Current locale as a signal so the placeholder props below recompute when the
   * visitor switches language.
   */
  private readonly locale = toSignal(this.language.locale$, {initialValue: this.language.locale});

  /**
   * The active locale wrapped in a single-element array, used as an `@for` key
   * around the name/subject inputs so they are re-created on language switch.
   *
   * `mn-input-field` resolves its `props` only on init and on its own locale
   * subscription (which fires before Angular pushes the recomputed `props`),
   * so a plain binding leaves the translated placeholder one switch behind.
   * Re-creating the input makes it read the fresh `props` on init instead; the
   * reactive `FormControl` restores the typed value into the new instance.
   */
  protected readonly localeGroup = computed(() => [this.locale()]);

  /** Message form: all three fields are required before sending is enabled. */
  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    subject: new FormControl('', { validators: [Validators.required] }),
    description: new FormControl('', { validators: [Validators.required] }),
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
    { labelKey: 'home.contact.call.title', valueKey: 'home.contact.call.description', href: 'tel:+31630941253' },
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

  /** Base styling for the send button; disabled state is applied per render. */
  formButton: MnButtonTypes = {
    color: 'primary',
    size: 'md',
    variant: 'fill',
    borderRadius: 'xl',
    hover: true,
  };

  /** Send-button config with its disabled state bound to form validity. */
  get formButtonData(): MnButtonTypes {
    return {
      ...this.formButton,
      disabled: this.form.invalid
    };
  }

  /**
   * Opens the visitor's mail client with a pre-composed message to SlopeWorks.
   *
   * The body is wrapped in the configured salutation and closing so the sent
   * email matches the note the visitor sees on screen. Does nothing while the
   * form is invalid.
   */
  sendEmail() {
    if (this.form.invalid) {
      return;
    }

    const name = this.form.get('name')?.value ?? '';
    const subject = this.form.get('subject')?.value ?? '';
    const description = this.form.get('description')?.value ?? '';

    const salutation = this.componentConfig?.emailSalutation ?? 'Beste Meneer';
    const closing = this.componentConfig?.emailClosing ?? 'Met vriendelijke groet';
    const contactEmail = this.componentConfig?.contactEmail ?? 'info@Slopeworks.nl';

    const body =
      `${salutation}

${description}

${closing}
${name}`;

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

}
