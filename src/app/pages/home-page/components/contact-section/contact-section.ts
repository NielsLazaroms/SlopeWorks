import {Component} from '@angular/core';
import {MnInputField, MnInputProps} from 'mn-angular-lib';
import {SectionTitle} from '../../../../components/section-title/section-title';
import {ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [
    SectionTitle,
    MnInputField,
    ReactiveFormsModule,
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
}
