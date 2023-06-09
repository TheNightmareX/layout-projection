import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { NgElement } from '@angular/elements';

import { parseNumberStringInput } from '../shared/input';
import { NgElementComponent } from '../shared/ng-element';

@Component({
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingComponent extends NgElementComponent {
  static override readonly selector = 'md-heading';

  @HostBinding('class') get class(): string {
    const level = parseNumberStringInput(this.level);
    return `level-${level}`;
  }

  @Input() id = '';
  @Input() level = '1';
}

export interface HeadingNgElement extends NgElement, HeadingComponent {}
