import {
  Directive,
  Injector,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ProjectionNodeSnapshotMap } from '@layout-projection/core';

import {
  LayoutAnimationScopeEntryRegistry,
  LayoutAnimationScopeNodeRegistry,
  LayoutAnimationScopeRef,
  ProjectionNodeSnapshotMapExpirer,
} from './layout-animation-scope.providers';

@Directive({
  selector: '[lpjAnimationScope]',
  standalone: true,
})
export class LayoutAnimationScopeDirective implements OnInit {
  @Input() set lpjAnimationScope(v: '' | this['source']) {
    if (v === '') return;
    this.source = v;
  }

  source?: LayoutAnimationScopeRef;
  current!: LayoutAnimationScopeRef;

  constructor(
    private templateRef: TemplateRef<LayoutAnimationScopeTemplateContext>,
    private viewContainer: ViewContainerRef,
  ) {}

  ngOnInit(): void {
    const injector = this.createInjector();
    this.current = injector.get(LayoutAnimationScopeRef);
    this.viewContainer.createEmbeddedView(
      this.templateRef,
      { $implicit: this.current },
      { injector },
    );
  }

  private createInjector(): Injector {
    const {
      nodeRegistry = new LayoutAnimationScopeNodeRegistry(),
      entryRegistry = new LayoutAnimationScopeEntryRegistry(),
      snapshots = new ProjectionNodeSnapshotMap(),
    } = this.source ?? {};
    return Injector.create({
      providers: [
        { provide: LayoutAnimationScopeRef },
        { provide: LayoutAnimationScopeNodeRegistry, useValue: nodeRegistry },
        { provide: LayoutAnimationScopeEntryRegistry, useValue: entryRegistry },
        { provide: ProjectionNodeSnapshotMap, useValue: snapshots },
        { provide: ProjectionNodeSnapshotMapExpirer },
      ],
    });
  }

  static ngTemplateContextGuard(
    instance: LayoutAnimationScopeDirective,
    context: unknown,
  ): context is LayoutAnimationScopeTemplateContext {
    return true;
  }
}

export interface LayoutAnimationScopeTemplateContext {
  $implicit: LayoutAnimationScopeRef;
}
