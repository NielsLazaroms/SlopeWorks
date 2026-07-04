import {Component} from '@angular/core';
import {NgClass} from '@angular/common';
import {MnTranslatePipe} from 'mn-angular-lib';
import {PageHeroComponent} from '../../components/page-hero/page-hero';
import {PageCtaComponent} from '../../components/page-cta/page-cta';
import {RevealDirective} from '../../components/reveal/reveal';

/**
 * One of the three provider profiles in the honest positioning triptych.
 *
 * Each profile names what that kind of provider is genuinely best at — including
 * the generalist and the specialist — rather than framing SlopeWorks as winning
 * every attribute. The honesty is the point.
 */
interface ProviderProfile {
  /** i18n key for the provider's name (e.g. "The generalist"). */
  nameKey: string;
  /** i18n key for the one-line description of what kind of provider this is. */
  typeKey: string;
  /** i18n key for the provider's genuine strongest point. */
  bestAtKey: string;
  /** i18n key for the "Choose … if" heading. */
  chooseTitleKey: string;
  /** i18n key for the "Choose … if" body. */
  chooseBodyKey: string;
  /** Whether this is the accented SlopeWorks profile. */
  highlight: boolean;
}

/**
 * One provider's answer to a decisive question.
 */
interface ProviderAnswer {
  /** i18n key for the provider's name (the row label). */
  labelKey: string;
  /** i18n key for this provider's answer. */
  answerKey: string;
  /** Whether this is the accented SlopeWorks row. */
  highlight: boolean;
}

/**
 * One decisive question, tagged with the decision axis it probes and answered by
 * each provider in turn.
 */
interface DecisionQuestion {
  /** i18n key for the one-word decision axis (e.g. "Speed"). */
  axisKey: string;
  /** i18n key for the question itself. */
  labelKey: string;
  /** The three provider answers, in reading order (SlopeWorks last). */
  answers: ProviderAnswer[];
}

/**
 * The comparison page (`/vergelijken`).
 *
 * An honest three-way positioning of SlopeWorks against the two kinds of provider
 * a buyer meets — a generalist and a specialist. Rather than a matrix where our
 * column wins every row, the page leans into candour: a triptych where each
 * provider owns its real strength, and three concrete questions that decide the
 * choice. Kept deliberately lean — no repeated prose restating the same points.
 */
@Component({
  selector: 'app-comparison-page',
  standalone: true,
  imports: [NgClass, MnTranslatePipe, PageHeroComponent, PageCtaComponent, RevealDirective],
  templateUrl: './comparison-page.html',
})
export class ComparisonPage {
  /** The three provider profiles, in reading order (SlopeWorks last, accented). */
  protected readonly providers: ProviderProfile[] = [
    {
      nameKey: 'comparison.col.generalist',
      typeKey: 'comparison.glance.type.g',
      bestAtKey: 'comparison.glance.strength.g',
      chooseTitleKey: 'comparison.who.g.title',
      chooseBodyKey: 'comparison.who.g.body',
      highlight: false,
    },
    {
      nameKey: 'comparison.col.specialist',
      typeKey: 'comparison.glance.type.s',
      bestAtKey: 'comparison.glance.strength.s',
      chooseTitleKey: 'comparison.who.s.title',
      chooseBodyKey: 'comparison.who.s.body',
      highlight: false,
    },
    {
      nameKey: 'comparison.col.us',
      typeKey: 'comparison.glance.type.u',
      bestAtKey: 'comparison.glance.strength.u',
      chooseTitleKey: 'comparison.who.u.title',
      chooseBodyKey: 'comparison.who.u.body',
      highlight: true,
    },
  ];

  /** The three decisive questions, each tagged with its axis and answered per provider. */
  protected readonly questions: DecisionQuestion[] = [
    {
      axisKey: 'comparison.three.q1.axis',
      labelKey: 'comparison.three.q1.k',
      answers: [
        {labelKey: 'comparison.col.generalist', answerKey: 'comparison.three.q1.g', highlight: false},
        {labelKey: 'comparison.col.specialist', answerKey: 'comparison.three.q1.s', highlight: false},
        {labelKey: 'comparison.col.us', answerKey: 'comparison.three.q1.u', highlight: true},
      ],
    },
    {
      axisKey: 'comparison.three.q2.axis',
      labelKey: 'comparison.three.q2.k',
      answers: [
        {labelKey: 'comparison.col.generalist', answerKey: 'comparison.three.q2.g', highlight: false},
        {labelKey: 'comparison.col.specialist', answerKey: 'comparison.three.q2.s', highlight: false},
        {labelKey: 'comparison.col.us', answerKey: 'comparison.three.q2.u', highlight: true},
      ],
    },
    {
      axisKey: 'comparison.three.q3.axis',
      labelKey: 'comparison.three.q3.k',
      answers: [
        {labelKey: 'comparison.col.generalist', answerKey: 'comparison.three.q3.g', highlight: false},
        {labelKey: 'comparison.col.specialist', answerKey: 'comparison.three.q3.s', highlight: false},
        {labelKey: 'comparison.col.us', answerKey: 'comparison.three.q3.u', highlight: true},
      ],
    },
  ];
}
