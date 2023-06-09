import { mix } from 'popmotion';
import * as styleUnits from 'style-value-types';

import { AnimationPlanner, AnimationPlanningContext } from '../animation.js';
import {
  AnimationHandler,
  AnimationPlan,
  AnimationRoute,
} from '../animation-engines.js';
import {
  ProjectionComponent,
  ProjectionDistortion,
  ProjectionNode,
} from '../projection.js';
import { BoundingBox } from '../projection-core.js';

const PROP_NAME = 'borderRadiuses';
export interface BorderRadiusProperties {
  [PROP_NAME]: BorderRadiusConfig;
}

export class BorderRadiusProjectionComponent
  implements ProjectionComponent<BorderRadiusProperties>
{
  constructor(protected measurer: BorderRadiusMeasurer) {}

  measureProperties(
    element: HTMLElement,
    boundingBox: BoundingBox,
  ): BorderRadiusProperties {
    return {
      borderRadiuses: this.measurer.measure(element, boundingBox),
    };
  }

  cancelDistortion(
    element: HTMLElement,
    { borderRadiuses: radiuses }: BorderRadiusProperties,
    { scaleX, scaleY }: ProjectionDistortion,
  ): void {
    const radiusStyle = (radius: BorderRadiusCornerConfig) =>
      `${radius.x / scaleX}px ${radius.y / scaleY}px`;
    element.style.borderTopLeftRadius = radiusStyle(radiuses.topLeft);
    element.style.borderTopRightRadius = radiusStyle(radiuses.topRight);
    element.style.borderBottomLeftRadius = radiusStyle(radiuses.bottomLeft);
    element.style.borderBottomRightRadius = radiusStyle(radiuses.bottomRight);
  }
}

export class BorderRadiusAnimationComponent
  implements AnimationPlanner, AnimationHandler
{
  buildPlan(
    context: AnimationPlanningContext<BorderRadiusProperties>,
  ): Partial<AnimationPlan> {
    const { node, snapshot } = context;
    const route: AnimationRoute<BorderRadiusConfig> = {
      from: snapshot?.[PROP_NAME] ?? node[PROP_NAME],
      to: node[PROP_NAME],
    };
    return { [PROP_NAME]: route };
  }

  handleFrame(
    node: ProjectionNode,
    progress: number,
    plan: AnimationPlan,
  ): void {
    const route = plan[PROP_NAME] as AnimationRoute<BorderRadiusConfig>;
    const { from, to } = route;

    const mixRadius = (
      from: BorderRadiusCornerConfig,
      to: BorderRadiusCornerConfig,
      progress: number,
    ): BorderRadiusCornerConfig => ({
      x: mix(from.x, to.x, progress),
      y: mix(from.y, to.y, progress),
    });

    const radiuses = {
      topLeft: mixRadius(from.topLeft, to.topLeft, progress),
      topRight: mixRadius(from.topRight, to.topRight, progress),
      bottomLeft: mixRadius(from.bottomLeft, to.bottomLeft, progress),
      bottomRight: mixRadius(from.bottomRight, to.bottomRight, progress),
    };

    node[PROP_NAME] = radiuses;
  }
}

export class BorderRadiusMeasurer {
  constructor(protected parser: CssBorderRadiusParser) {}

  measure(
    element: HTMLElement,
    boundingBox = BoundingBox.from(element),
  ): BorderRadiusConfig {
    const style = getComputedStyle(element);

    const parse = (style: string) =>
      this.parser.parse(style, boundingBox.width(), boundingBox.height());

    return {
      topLeft: parse(style.borderTopLeftRadius),
      topRight: parse(style.borderTopRightRadius),
      bottomLeft: parse(style.borderBottomLeftRadius),
      bottomRight: parse(style.borderBottomRightRadius),
    };
  }
}

export class CssBorderRadiusParser {
  parse(
    style: string,
    width: number,
    height: number,
  ): BorderRadiusCornerConfig {
    if (style.match(/\d.*?px \d.*?px/u)) {
      const [x, y] = style.split(' ').map((value) => parseFloat(value));
      return { x, y };
    }
    if (styleUnits.percent.test(style)) {
      const value = parseFloat(style) / 100;
      return { x: value * width, y: value * height };
    }
    if (styleUnits.px.test(style)) {
      const value = parseFloat(style);
      return { x: value, y: value };
    }
    throw new Error(`Unsupported radius: ${style}`);
  }
}

export interface BorderRadiusConfig {
  topLeft: BorderRadiusCornerConfig;
  topRight: BorderRadiusCornerConfig;
  bottomLeft: BorderRadiusCornerConfig;
  bottomRight: BorderRadiusCornerConfig;
}
export interface BorderRadiusCornerConfig {
  x: number;
  y: number;
}
