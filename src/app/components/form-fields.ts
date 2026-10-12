import {MnLanguageService} from 'mn-angular-lib/core';
import {MnErrorMessagesData} from 'mn-angular-lib/forms';

/**
 * Host classes for MnLib form fields in the site's forms: full width, and the
 * library's label aligned with the input edge and set in semibold.
 */
export const FORM_FIELD_CLASS = 'block w-full [&_label]:pl-0 [&_label]:pb-2 [&_label]:font-semibold [&_label]:text-ink';

/** Translated texts for one MnLib form field. */
export interface FormFieldText {
  /** Visible label; the library adds a red `*` when the control is required. */
  label: string;
  /** Placeholder text. */
  placeholder: string;
  /** Message per validator error key. */
  errorMessages: MnErrorMessagesData;
}

/**
 * Builds a field's label, placeholder and error messages from i18n keys under
 * `<prefix>.<field>.*` (`label`, `placeholder`, `required`, `invalid`), with the
 * length message from `<prefix>.maxlength` (`{max}` is replaced).
 *
 * @param language Translation service.
 * @param prefix i18n key prefix of the form, e.g. `home.contact.form`.
 * @param field The field's key segment, e.g. `email`.
 */
export function formFieldText(language: MnLanguageService, prefix: string, field: string): FormFieldText {
  const t = (key: string) => language.translate(`${prefix}.${key}`);
  return {
    label: t(`${field}.label`),
    placeholder: t(`${field}.placeholder`),
    errorMessages: {
      required: t(`${field}.required`),
      pattern: t(`${field}.invalid`),
      maxlength: args => t('maxlength').replace('{max}', String(args.requiredLength)),
    },
  };
}
