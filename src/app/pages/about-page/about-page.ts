import {Component} from '@angular/core';
import {MnBadge, MnTranslatePipe} from 'mn-angular-lib';
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
 * A prose block in the "how we work" run below the founders band.
 */
interface AboutBlock {
  /** i18n key for the short keyword eyebrow naming the commitment. */
  eyebrowKey: string;
  /** i18n key for the block heading. */
  titleKey: string;
  /** i18n key for the block body. */
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
  imports: [MnBadge, MnTranslatePipe, PageHeroComponent, PageCtaComponent, RevealDirective, EyebrowComponent],
  templateUrl: './about-page.html',
})
export class AboutPage {
  /** The two founders. */
  protected readonly founders: Founder[] = [
    {nameKey: 'about.bas.name', roleKey: 'about.bas.role'},
    {nameKey: 'about.carmen.name', roleKey: 'about.carmen.role'},
  ];

  /** The prose blocks describing how SlopeWorks works. */
  protected readonly blocks: AboutBlock[] = [
    {eyebrowKey: 'about.b1.eyebrow', titleKey: 'about.b1.title', bodyKey: 'about.b1.body'},
    {eyebrowKey: 'about.b2.eyebrow', titleKey: 'about.b2.title', bodyKey: 'about.b2.body'},
    {eyebrowKey: 'about.b3.eyebrow', titleKey: 'about.b3.title', bodyKey: 'about.b3.body'},
  ];
}
