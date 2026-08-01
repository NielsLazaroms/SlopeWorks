import {Component, Input, Output, EventEmitter} from '@angular/core';

/**
 * A single navigation entry rendered as a focusable button that emits on click
 * (the parent navbar owns the actual routing/scroll logic).
 *
 * The active entry is shown in brand yellow; inactive entries share the site's
 * growing-underline link motif (`.sw-underlink`). Two layouts are supported:
 * `bar` for the horizontal desktop navbar and `stacked` for the large mobile menu.
 */
@Component({
  selector: 'app-nav-list-item',
  standalone: true,
  templateUrl: './nav-list-item.component.html',
})
export class NavListItemComponent {
  /** Visible link label (already resolved to the active language). */
  @Input({required: true}) label!: string;
  /** Whether this entry points at the current route (shown in brand yellow). */
  @Input() active = false;
  /** `bar` = horizontal desktop item; `stacked` = large item in the mobile menu. */
  @Input() variant: 'bar' | 'stacked' = 'bar';
  /** Emitted when the entry is clicked. */
  @Output() itemClick = new EventEmitter<void>();
}
