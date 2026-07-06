import { Routes } from '@angular/router';
import {HomePage} from './pages/home-page/home-page';

/**
 * Application routes. The home page stays eager (it is the landing view); the
 * interior editorial pages are lazily loaded so they don't weigh down the
 * initial bundle.
 *
 * Each page carries a `data.seo` key (see `SeoService`); the title and meta
 * description are resolved from the matching `seo.<key>.*` i18n entries so they
 * follow the active language.
 */
export const routes: Routes = [
  {path: '', component: HomePage, data: {seo: 'home'}},
  {
    path: 'bestemmingen',
    loadComponent: () => import('./pages/destinations-page/destinations-page').then((m) => m.DestinationsPage),
    data: {seo: 'destinations'},
  },
  {
    // One data-driven detail page serves every scouted area (Sölden, Mayrhofen,
    // St. Anton, Kitzbühel, Zell am See, Gstaad).
    path: 'bestemmingen/:slug',
    loadComponent: () => import('./pages/destination-detail/destination-detail').then((m) => m.DestinationDetailPage),
    data: {seo: 'destination'},
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq-page/faq-page').then((m) => m.FaqPage),
    data: {seo: 'faq'},
  },
  {
    path: 'vergelijken',
    loadComponent: () => import('./pages/comparison-page/comparison-page').then((m) => m.ComparisonPage),
    data: {seo: 'comparison'},
  },
  // Old slug kept as a redirect so existing links and bookmarks still resolve.
  {path: 'vs-reisbureaus', redirectTo: 'vergelijken', pathMatch: 'full'},
  {
    path: 'over-ons',
    loadComponent: () => import('./pages/about-page/about-page').then((m) => m.AboutPage),
    data: {seo: 'about'},
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact-page/contact-page').then((m) => m.ContactPage),
    data: {seo: 'contact'},
  },
  {path: '**', redirectTo: ''},
];
