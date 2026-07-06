import {Component} from '@angular/core';
import {NgClass} from '@angular/common';
import {MnTranslatePipe} from 'mn-angular-lib';
import {PageHeroComponent} from '../../components/page-hero/page-hero';
import {PageCtaComponent} from '../../components/page-cta/page-cta';
import {RevealDirective} from '../../components/reveal/reveal';

/**
 * A provider's piste-map accent. Each of the two archetype providers gets a muted
 * run colour; SlopeWorks is marked in the brand yellow. The value keys into
 * {@link ComparisonPage.accent} for the concrete Tailwind classes.
 */
type Accent = 'green' | 'red' | 'brand';

/**
 * The marker shape borrowed from the alpine piste legend: a circle, a square or a
 * diamond. The shapes tell the three routes apart — deliberately NOT a difficulty
 * ranking (the page's map key says so out loud).
 */
type Marker = 'circle' | 'square' | 'diamond';

/**
 * The Tailwind class fragments that colour one accent. Kept as whole literal
 * strings (not built by interpolation) so Tailwind's scanner can see them.
 */
interface AccentClasses {
  /** Solid fill for the route marker. */
  marker: string;
  /** Text colour for the run-type label. */
  label: string;
  /** Left rule colour for the "Choose … if" callout. */
  rule: string;
}

/**
 * One of the three routes in the trail-map legend.
 *
 * Every provider is framed as a different line down the same mountain: the
 * generalist's broad "motorway piste", the specialist's engineered run, and
 * SlopeWorks' guided line. Each owns its genuine strength rather than SlopeWorks
 * winning every attribute — the honesty is the point.
 */
interface RouteRun {
  /** i18n key for the provider's name (e.g. "The generalist"). */
  nameKey: string;
  /** i18n key for the piste-style run-type label (e.g. "Motorway piste"). */
  runTypeKey: string;
  /** i18n key for the one-line description of what kind of provider this is. */
  typeKey: string;
  /** i18n key for the provider's genuine strongest point. */
  bestAtKey: string;
  /** The piste marker shape for this route. */
  marker: Marker;
  /** The piste colour accent for this route. */
  accent: Accent;
  /** Whether this is the raised, brand-accented SlopeWorks route. */
  highlight: boolean;
}

/**
 * One provider's long-read in the deep-dive section.
 *
 * The intro block carries no marker (it frames why buyers look around at all);
 * the three provider blocks each carry their route marker and close on the
 * concrete "Choose … if" takeaway.
 */
interface DeepDive {
  /** i18n key for the block heading. */
  titleKey: string;
  /** i18n keys for the body paragraphs, in reading order. */
  paraKeys: string[];
  /** i18n key for the piste run-type eyebrow; omitted on the intro block. */
  runTypeKey?: string;
  /** The route marker shape; omitted on the intro block. */
  marker?: Marker;
  /** The piste accent; omitted on the intro block. */
  accent?: Accent;
  /** i18n key for the "Choose … if" callout title; omitted on the intro block. */
  chooseTitleKey?: string;
  /** i18n key for the "Choose … if" callout body; omitted on the intro block. */
  chooseBodyKey?: string;
  /** Whether this is the brand-accented SlopeWorks block. */
  highlight?: boolean;
}

/**
 * One provider's answer to a decisive question, tagged with its route marker.
 */
interface ProviderAnswer {
  /** i18n key for the provider's name (the row label). */
  labelKey: string;
  /** i18n key for this provider's answer. */
  answerKey: string;
  /** The route marker shape, echoing the legend. */
  marker: Marker;
  /** The piste accent, echoing the legend. */
  accent: Accent;
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
 * a buyer meets — a generalist and a specialist — dressed in the vernacular of an
 * alpine trail map. Rather than a matrix where our column wins every row, the
 * three providers are three routes down one mountain: each owns a real strength,
 * the marker legend explicitly names run *type* not difficulty, and three
 * concrete questions decide the choice.
 */
@Component({
  selector: 'app-comparison-page',
  standalone: true,
  imports: [NgClass, MnTranslatePipe, PageHeroComponent, PageCtaComponent, RevealDirective],
  templateUrl: './comparison-page.html',
})
export class ComparisonPage {
  /**
   * Whole-literal Tailwind class fragments per accent. Storing the full strings
   * here (rather than interpolating `bg-piste-${accent}`) keeps them visible to
   * Tailwind's content scanner while staying DRY across the template.
   */
  protected readonly accent: Record<Accent, AccentClasses> = {
    green: {marker: 'bg-piste-green', label: 'text-piste-green', rule: 'border-piste-green'},
    red: {marker: 'bg-piste-red', label: 'text-piste-red', rule: 'border-piste-red'},
    brand: {marker: 'bg-brand-500', label: 'text-dark-yellow', rule: 'border-brand-500'},
  };

  /** Tailwind shape fragment per marker; the diamond is a rotated square. */
  protected readonly shape: Record<Marker, string> = {
    circle: 'rounded-full',
    square: 'rounded-[2px]',
    diamond: 'rounded-[2px] rotate-45',
  };

  /** The three routes, in reading order (SlopeWorks last, accented). */
  protected readonly runs: RouteRun[] = [
    {
      nameKey: 'comparison.col.generalist',
      runTypeKey: 'comparison.run.g.type',
      typeKey: 'comparison.glance.type.g',
      bestAtKey: 'comparison.glance.strength.g',
      marker: 'circle',
      accent: 'green',
      highlight: false,
    },
    {
      nameKey: 'comparison.col.specialist',
      runTypeKey: 'comparison.run.s.type',
      typeKey: 'comparison.glance.type.s',
      bestAtKey: 'comparison.glance.strength.s',
      marker: 'square',
      accent: 'red',
      highlight: false,
    },
    {
      nameKey: 'comparison.col.us',
      runTypeKey: 'comparison.run.u.type',
      typeKey: 'comparison.glance.type.u',
      bestAtKey: 'comparison.glance.strength.u',
      marker: 'diamond',
      accent: 'brand',
      highlight: true,
    },
  ];

  /** The long-read: why buyers look around, then one honest block per route. */
  protected readonly deepDive: DeepDive[] = [
    {
      titleKey: 'comparison.dd1.title',
      paraKeys: ['comparison.dd1.p1', 'comparison.dd1.p2'],
    },
    {
      titleKey: 'comparison.dd2.title',
      paraKeys: ['comparison.dd2.p1', 'comparison.dd2.p2'],
      runTypeKey: 'comparison.run.g.type',
      marker: 'circle',
      accent: 'green',
      chooseTitleKey: 'comparison.who.g.title',
      chooseBodyKey: 'comparison.who.g.body',
    },
    {
      titleKey: 'comparison.dd3.title',
      paraKeys: ['comparison.dd3.p1', 'comparison.dd3.p2'],
      runTypeKey: 'comparison.run.s.type',
      marker: 'square',
      accent: 'red',
      chooseTitleKey: 'comparison.who.s.title',
      chooseBodyKey: 'comparison.who.s.body',
    },
    {
      titleKey: 'comparison.dd4.title',
      paraKeys: ['comparison.dd4.p1', 'comparison.dd4.p2'],
      runTypeKey: 'comparison.run.u.type',
      marker: 'diamond',
      accent: 'brand',
      chooseTitleKey: 'comparison.who.u.title',
      chooseBodyKey: 'comparison.who.u.body',
      highlight: true,
    },
  ];

  /** The three decisive questions, each tagged with its axis and answered per route. */
  protected readonly questions: DecisionQuestion[] = [
    {
      axisKey: 'comparison.three.q1.axis',
      labelKey: 'comparison.three.q1.k',
      answers: [
        {labelKey: 'comparison.col.generalist', answerKey: 'comparison.three.q1.g', marker: 'circle', accent: 'green', highlight: false},
        {labelKey: 'comparison.col.specialist', answerKey: 'comparison.three.q1.s', marker: 'square', accent: 'red', highlight: false},
        {labelKey: 'comparison.col.us', answerKey: 'comparison.three.q1.u', marker: 'diamond', accent: 'brand', highlight: true},
      ],
    },
    {
      axisKey: 'comparison.three.q2.axis',
      labelKey: 'comparison.three.q2.k',
      answers: [
        {labelKey: 'comparison.col.generalist', answerKey: 'comparison.three.q2.g', marker: 'circle', accent: 'green', highlight: false},
        {labelKey: 'comparison.col.specialist', answerKey: 'comparison.three.q2.s', marker: 'square', accent: 'red', highlight: false},
        {labelKey: 'comparison.col.us', answerKey: 'comparison.three.q2.u', marker: 'diamond', accent: 'brand', highlight: true},
      ],
    },
    {
      axisKey: 'comparison.three.q3.axis',
      labelKey: 'comparison.three.q3.k',
      answers: [
        {labelKey: 'comparison.col.generalist', answerKey: 'comparison.three.q3.g', marker: 'circle', accent: 'green', highlight: false},
        {labelKey: 'comparison.col.specialist', answerKey: 'comparison.three.q3.s', marker: 'square', accent: 'red', highlight: false},
        {labelKey: 'comparison.col.us', answerKey: 'comparison.three.q3.u', marker: 'diamond', accent: 'brand', highlight: true},
      ],
    },
  ];
}
