import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  LayoutAnimationEntryDirective,
  ProjectionNodeDirective,
} from '@layout-projection/angular';
import { LayoutAnimationEntry } from '@layout-projection/core';

import { AnimationCurve } from '../../common/animation';

@Component({
  selector: 'lpj-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ProjectionNodeDirective, LayoutAnimationEntryDirective],
})
export class NavComponent {
  items = [
    'Overview',
    'Layout Projection',
    'Layout Animation',
    'Snapshot APIs',
    'Standalone Usage',
  ];
  itemActive?: string;
  entry = inject(LayoutAnimationEntry);

  trigger(): void {
    this.entry.snapshot();
    requestAnimationFrame(() => {
      this.entry.animate({
        duration: 125,
        easing: AnimationCurve.Emphasized,
      });
    });
  }
}
