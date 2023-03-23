import {
  Directive,
  Host,
  Input,
  OnDestroy,
  Optional,
  Self,
} from '@angular/core';
import {
  LayoutAnimationConfig,
  LayoutAnimator,
  Node,
  NodeSnapper,
  NodeSnapshotMap,
} from '@layout-projection/core';

@Directive({
  selector: '[lpjNode][lpjAnimation]',
  exportAs: 'lpjAnimation',
})
export class LayoutAnimationDirective implements OnDestroy {
  @Input('lpjAnimation') config: Partial<
    Pick<LayoutAnimationConfig, 'duration' | 'easing'>
  > = {};

  constructor(
    @Self() public node: Node,
    private animator: LayoutAnimator,
    private snapper: NodeSnapper,
    @Host() private snapshots: NodeSnapshotMap,
    @Host() @Optional() private registry?: LayoutAnimationDirectiveRegistry,
  ) {
    this.registry?.add(this);
  }

  ngOnDestroy(): void {
    this.registry?.delete(this);
  }

  snapshot(): void {
    this.snapper.snapshotFrom(this.node, this.snapshots);
  }

  async animate(): Promise<void> {
    if (!this.snapshots) throw new Error('Missing snapshots');
    const { duration = 225, easing = 'ease-in-out' } = this.config;
    await this.animator.animate({
      root: this.node,
      from: this.snapshots,
      duration,
      easing,
    });
  }
}

export class LayoutAnimationDirectiveRegistry extends Set<LayoutAnimationDirective> {}
