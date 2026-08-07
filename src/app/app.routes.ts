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
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy-page/privacy-page').then((m) => m.PrivacyPage),
    data: {seo: 'privacy'},
  },
  // Explicit `/404` so the static build prerenders a `404/index.html`; the deploy
  // step copies it to `404.html` and points the host's `ErrorDocument` at it, so a
  // mistyped URL that finds no file still gets the branded page (see localize-static).
  {
    path: '404',
    loadComponent: () => import('./pages/not-found-page/not-found-page').then((m) => m.NotFoundPage),
    data: {seo: 'notfound'},
  },
  // Any unknown in-app route renders the 404 page in place (keeping the bad URL in
  // the address bar) instead of silently bouncing to the home page.
  {
    path: '**',
    loadComponent: () => import('./pages/not-found-page/not-found-page').then((m) => m.NotFoundPage),
    data: {seo: 'notfound'},
  },
];
