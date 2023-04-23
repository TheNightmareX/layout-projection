# Layout Projection

**_Beautify the Web with awesome layout animations_**

Framework-agnostic **Layout Projection** and **Layout-Projection-powered** layout animation implementations with exquisite adapters for various frameworks.

# Getting Started

- [Getting started](https://thenightmarex.github.io/layout-projection/)
- [Getting started with Angular](./packages/angular/README.md)

# What is it?

Layout animations have always been a challenge for web developers, especially when it comes to implementing advanced layout animations like shared-element transitions.

To address this issue, [Matt Perry](https://github.com/mattgperry) invented Layout Projection, which is a Web animation technique making it possible to implement GPU-accelerated layout animations in the Web platform by calculating and applying appropriate CSS `transform` styles on elements in each animation frame.

> Checkout [Inside Framer Motion's Layout Animations - Matt Perry](https://www.youtube.com/watch?v=5-JIu0u42Jc) for more details.

Matt Perry heavily applied the Layout Projection technique in [Framer Motion](https://www.framer.com/motion/), a well-known React animation library. Unfortunately, this left out web developers who don't use React.

Therefore, here we offer a **framework-agnostic** implementation of Layout Projection with a variety of framework adapters to enable all web developers to enhance their applications with layout animations!

# Special Thanks

Big thank to [@taowen](https://github.com/taowen) for providing [the GitHub Gist copy](https://gist.github.com/taowen/e102cf5731e527cb9ac02574783c4119) of the missing original blog by Matt Perry about the tech details of Layout Projection.
