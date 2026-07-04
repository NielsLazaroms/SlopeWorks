import {Component} from '@angular/core';
import {MnSectionDirective, MnTranslatePipe} from 'mn-angular-lib';
import {PageHeroComponent} from '../../components/page-hero/page-hero';
import {ContactSectionComponent} from '../home-page/components/contact-section/contact-section';
import {RevealDirective} from '../../components/reveal/reveal';

/**
 * The contact page (`/contact`).
 *
 * Wraps the existing contact section (info items + validated message form with
 * mailto submit) in the shared page shell. The `mn-section` chain
 * (`contact` → `contact-section`) resolves the section's content from
 * `overrides.root.contact` in `mn-config.json5`.
 */
@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [MnSectionDirective, MnTranslatePipe, PageHeroComponent, ContactSectionComponent, RevealDirective],
  templateUrl: './contact-page.html',
})
export class ContactPage {}
