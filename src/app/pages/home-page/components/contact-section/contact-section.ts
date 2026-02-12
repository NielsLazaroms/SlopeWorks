import {Component, inject, InjectionToken} from '@angular/core';
import {
  MnButton,
  MnButtonTypes,
  MnInputField,
  MnInputProps,
  MnInstanceDirective,
  MnSectionDirective,
  MnTextarea,
  MnTextareaProps,
  provideMnComponentConfig
} from 'mn-angular-lib';
import {SectionTitle} from '../../../../components/section-title/section-title';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InfoItem} from '../../../../components/info-item/info-item';
import {SectionTitleTypes} from '../../../../components/section-title/section-titleTypes';

export interface ContactSectionConfig {
  informationDescription?: string;
  formDescription?: string;
  formButtonText?: string;
  emailSalutation?: string;
  emailClosing?: string;
  contactEmail?: string;
}

export const APP_CONTACT_SECTION_COMPONENT_CONFIG = new InjectionToken<ContactSectionConfig>('APP_CONTACT_SECTION_CONFIG');

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [
    SectionTitle,
    MnInputField,
    ReactiveFormsModule,
    InfoItem,
    MnButton,
    MnInstanceDirective,
    MnSectionDirective,
    MnTextarea,
  ],
  providers: [
    provideMnComponentConfig<ContactSectionConfig>(APP_CONTACT_SECTION_COMPONENT_CONFIG, 'app-contact-section'),
  ],
  templateUrl: './contact-section.html',
})
export class ContactSectionComponent {

  protected readonly componentConfig = inject(APP_CONTACT_SECTION_COMPONENT_CONFIG);
  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    subject: new FormControl('', { validators: [Validators.required] }),
    description: new FormControl('', { validators: [Validators.required] }),
  });

  nameProps = {
    id: 'name',
    type: 'text',
  } satisfies MnInputProps;

  subjectProps = {
    id: 'subject',
    type: 'text',
  } satisfies MnInputProps;

  descriptionProps = {
    id: 'description',
    resize: 'none',
    rows: 5
  } satisfies MnTextareaProps;

  getInTouchTitle = {
    text: 'Get in touch',
    size: 'md',
    shadow: false,
    showUnderLine: false,
    textPosition: 'left',
    textColor: 'dark',
    fontWeight: 'semibold',
    textStroke: 'sm',
  } as SectionTitleTypes;

  contactTitle = {
    text: 'Send a message',
    size: 'md',
    shadow: false,
    showUnderLine: false,
    textPosition: 'left',
    textColor: 'dark',
    fontWeight: 'semibold',
    textStroke: 'sm',
  } as SectionTitleTypes;

  formButton = {
    color: 'primary',
    size: 'md',
    variant: 'fill',
    borderRadius: 'xl',
    fullWidth: false,
  } as MnButtonTypes;

  get formButtonData(): MnButtonTypes {
    return {
      ...this.formButton,
      disabled: this.form.invalid
    };
  }

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
      `${salutation},

${description}

${closing},
${name}`;

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

}
