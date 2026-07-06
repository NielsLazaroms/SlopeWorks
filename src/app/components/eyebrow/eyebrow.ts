import {Component, Input} from '@angular/core';

/**
 * The small uppercase "eyebrow" label that sits above section headings across the
 * site. Centralises the one shared treatment (Montserrat, bold, tracked,
 * uppercase) and the two tones — a deep yellow on light surfaces and brand yellow
 * on dark ones — plus the optional leading brand dot used in the page heroes.
 *
 * Callers own the surrounding spacing (`<app-eyebrow class="mb-4">…`) and project
 * the label text, e.g. `<app-eyebrow>{{ 'x' | mnTranslate }}</app-eyebrow>`.
 */
@Component({
  selector: 'app-eyebrow',
  standalone: true,
  templateUrl: './eyebrow.html',
  host: {class: 'block'},
})
export class EyebrowComponent {
  /** `light` = deep yellow on light surfaces; `dark` = brand yellow on dark heroes. */
  @Input() tone: 'light' | 'dark' = 'light';
  /** Show the small leading brand dot (used in the page heroes). */
  @Input() dot = false;
}
