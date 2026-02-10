import {Component} from '@angular/core';
import {MnButton, MnButtonTypes, MnInputField, MnInputProps} from 'mn-angular-lib';
import {SectionTitle} from '../../../../components/section-title/section-title';
import {ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import {InfoItem} from '../../../../components/info-item/info-item';
import {SectionTitleTypes} from '../../../../components/section-title/section-titleTypes';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [
    SectionTitle,
    MnInputField,
    ReactiveFormsModule,
    InfoItem,
    MnButton,
  ],
  templateUrl: './contact-section.html',
})
export class ContactSectionComponent {
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
    type: 'text',
  } satisfies MnInputProps;

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
}
