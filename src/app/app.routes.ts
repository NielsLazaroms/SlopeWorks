import { Routes } from '@angular/router';
import {HomePage} from './pages/home-page/home-page';

/**
 * Application routes. The home page stays eager (it is the landing view); the
 * interior editorial pages are lazily loaded so they don't weigh down the
 * initial bundle.
 */
export const routes: Routes = [
  {path: '', component: HomePage},
  {
    path: 'bestemmingen',
    loadComponent: () => import('./pages/destinations-page/destinations-page').then((m) => m.DestinationsPage),
  },
  {
    // One data-driven detail page serves every scouted area (Sölden, Mayrhofen,
    // St. Anton, Kitzbühel, Zell am See, Gstaad).
    path: 'bestemmingen/:slug',
    loadComponent: () => import('./pages/destination-detail/destination-detail').then((m) => m.DestinationDetailPage),
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq-page/faq-page').then((m) => m.FaqPage),
  },
  {
    path: 'vergelijken',
    loadComponent: () => import('./pages/comparison-page/comparison-page').then((m) => m.ComparisonPage),
  },
  // Old slug kept as a redirect so existing links and bookmarks still resolve.
  {path: 'vs-reisbureaus', redirectTo: 'vergelijken', pathMatch: 'full'},
  {
    path: 'over-ons',
    loadComponent: () => import('./pages/about-page/about-page').then((m) => m.AboutPage),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact-page/contact-page').then((m) => m.ContactPage),
  },
  {path: '**', redirectTo: ''},
];
