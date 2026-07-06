import {Component} from '@angular/core';
import {MnTranslatePipe} from 'mn-angular-lib';
import {PageHeroComponent} from '../../components/page-hero/page-hero';
import {PageCtaComponent} from '../../components/page-cta/page-cta';
import {RevealDirective} from '../../components/reveal/reveal';
import {EyebrowComponent} from '../../components/eyebrow/eyebrow';

/**
 * A founder shown in the "the people" section.
 */
interface Founder {
  /** i18n key for the founder's name. */
  nameKey: string;
  /** i18n key for the founder's role line. */
  roleKey: string;
}

/**
 * A "what stays true" value card.
 */
interface Value {
  /** i18n key for the value title. */
  titleKey: string;
  /** i18n key for the value body. */
  bodyKey: string;
}

/**
 * The about page (`/over-ons`).
 *
 * The story behind SlopeWorks — the founders, why the company exists, and the
 * three things that don't change — in the shared page shell.
 */
@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [MnTranslatePipe, PageHeroComponent, PageCtaComponent, RevealDirective, EyebrowComponent],
  templateUrl: './about-page.html',
})
export class AboutPage {
  /** The two founders. */
  protected readonly founders: Founder[] = [
    {nameKey: 'about.bas.name', roleKey: 'about.bas.role'},
    {nameKey: 'about.carmen.name', roleKey: 'about.carmen.role'},
  ];

  /** The three constants of how SlopeWorks works. */
  protected readonly values: Value[] = [
    {titleKey: 'about.value1.title', bodyKey: 'about.value1.body'},
    {titleKey: 'about.value2.title', bodyKey: 'about.value2.body'},
    {titleKey: 'about.value3.title', bodyKey: 'about.value3.body'},
  ];
}
