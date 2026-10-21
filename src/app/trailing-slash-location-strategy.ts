import {Injectable} from '@angular/core';
import {PathLocationStrategy} from '@angular/common';

/**
 * Writes every outgoing URL (`routerLink` hrefs and the address bar after a
 * navigation) in the trailing-slash form, e.g. `/faq/` instead of `/faq`.
 *
 * The static host serves each prerendered page as a directory and 301-redirects
 * `/faq` to `/faq/`; the canonical, hreflang and sitemap URLs already use the
 * slash form. Emitting it here means internal links point straight at the
 * canonical URL instead of at a redirect. The router itself keeps working with
 * the slashless form, since `Location` strips the trailing slash when reading.
 */
@Injectable()
export class TrailingSlashLocationStrategy extends PathLocationStrategy {
  /**
   * Adds the trailing slash to the path part, leaving any query or fragment as is.
   *
   * @param internal Router URL such as `/faq`, `/contact?x=1` or `/#contact`.
   * @returns The external URL with a trailing slash on its path.
   */
  override prepareExternalUrl(internal: string): string {
    const match = /^([^?#]*)(.*)$/.exec(internal);
    const path = match?.[1] ?? '';
    const rest = match?.[2] ?? '';
    const slashed = path === '' || path.endsWith('/') ? path : `${path}/`;
    return super.prepareExternalUrl(slashed + rest);
  }
}
