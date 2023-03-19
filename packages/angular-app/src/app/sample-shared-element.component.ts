import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-sample-shared-element',
  template: `
    <div class="container" lpjNode [animateOn]="flag">
      <div class="content" *ngIf="!flag" lpjNode="content"></div>
      <div class="content flag" *ngIf="flag" lpjNode="content"></div>
    </div>
  `,
  styles: [
    `
      .container {
        position: relative;
        width: 500px;
        height: 500px;
        background-color: green;
      }

      .content {
        position: absolute;
        background-color: white;
      }
      .content:not(.flag) {
        top: 100px;
        left: 100px;
        width: 100px;
        height: 100px;
      }
      .content.flag {
        bottom: 100px;
        right: 100px;
        width: 200px;
        height: 150px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleSharedElementComponent implements OnInit, OnDestroy {
  flag = false;

  private destroy$ = new EventEmitter();

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    timer(0, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.flag = !this.flag;
        this.changeDetector.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.emit();
  }
}