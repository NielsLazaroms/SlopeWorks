import {Component, input, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {LucidePlus} from '@lucide/angular';
import {MnTranslatePipe} from 'mn-angular-lib';

/**
 * A single question/answer entry in an FAQ accordion (both fields are i18n keys).
 */
export interface FaqEntry {
  /** i18n key for the question. */
  qKey: string;
  /** i18n key for the answer. */
  aKey: string;
}

/**
 * The shared FAQ accordion: a count eyebrow, an optional title and lead, and a
 * hairline-divided list of questions that expand independently.
 *
 * Used on the FAQ page (once per category) and on destination-detail pages
 * (scoped to that area), so the interaction and styling live in one place. Each
 * question toggles on its own, so open state is a set of question keys; the "+"
 * toggle is a Lucide icon that rotates into a cross when open.
 */
@Component({
  selector: 'app-faq-accordion',
  standalone: true,
  imports: [NgClass, LucidePlus, MnTranslatePipe],
  host: {class: 'block'},
  templateUrl: './faq-accordion.html',
})
export class FaqAccordionComponent {
  /** The questions to render, in display order. */
  readonly items = input.required<FaqEntry[]>();

  /** Optional i18n key for the group heading. */
  readonly titleKey = input<string>();

  /** Optional i18n key for a one-line lead beneath the heading. */
  readonly subKey = input<string>();

  /** Currently expanded questions, keyed by their question i18n key. */
  private readonly openKeys = signal<ReadonlySet<string>>(new Set());

  /**
   * Whether a question is currently expanded.
   *
   * @param qKey The question's i18n key.
   */
  protected isOpen(qKey: string): boolean {
    return this.openKeys().has(qKey);
  }

  /**
   * Expands or collapses a single question.
   *
   * @param qKey The question's i18n key.
   */
  protected toggle(qKey: string): void {
    const next = new Set(this.openKeys());
    if (next.has(qKey)) {
      next.delete(qKey);
    } else {
      next.add(qKey);
    }
    this.openKeys.set(next);
  }
}
