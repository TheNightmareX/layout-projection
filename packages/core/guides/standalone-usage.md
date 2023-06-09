# Standalone Usage

`@layout-projection/core` usually serves as the core of framework adapter, but can also be used separately if there is not a suitable framework adapter yet available for you.

This guide offers you some inspirations of some potential standalone usages of the `@layout-projection/core` package.

## Projection Tree

The Projection Tree can be hard to maintain without a framework adapter.

A `WeakMap` can be used to record the corresponding `ProjectionNode` instances for each element you create without worrying about memory leaks:

```ts
const nodes = new WeakMap<Element, ProjectionNode>();
```

Whenever you instantiate a `ProjectionNode`, be sure to record it in the `WeakMap` and attach to a correct parent:

```ts
const list = document.createElement('list');
const listNode = new ProjectionNode(list, ...deps);
node.set(list, listNode);

const item = document.createElement('li');
list.append(item);
const itemNode = new ProjectionNode(child, ...deps);
itemNode.attach(listNode);
nodes.set(item, itemNode);
```

After the element is removed, remember to clean up its corresponding `ProjectionNode` instance:

```ts
const items = [...list.children];
for (const item of items) {
  item.remove();
  nodes.get(item)?.detach();
}
```

## Class Dependencies

`@layout-projection/core` APIs are highly composable and extensible, as the responsibility of each service class is clearly separated and the dependencies of a service are explicitly passed into the service as constructor parameters.

Framework adapters usually provide you a beautiful API and hide the dependency details from you, but when used separately, you will have to manage the dependencies yourself.

### The Primitive Way

You might come to instantiate the dependencies every time you instantiate a class:

```ts
new ProjectionNode(element, new ElementMeasurer(new CssBorderRadiusParser()));
```

It is quite straightforward, but also quite rough:

- There are multiple instances created for a single service, which is completely unnecessary.
- The dependencies are fixed to specific classes, which works for simple cases but could severely damage the flexibility of a well-designed architecture.

### The Service Map

It's much more recommended to use a Service Map instead, which is simply a map of instances of services but works well:

```ts
const services = new Map<Function, any>();
```

During the initialization phrase of you application, you should provide an instance of all services to the Service Map:

```ts
services.set(CssBorderRadiusParser, new CssBorderRadiusParser());
services.set(
  ElementMeasurer,
  new ElementMeasurer(services.get(CssBorderRadiusParser)),
);
```

When a service is required as a dependency, simply retrieve the instance from the Service Map:

```ts
const node = new ProjectionNode(element, services.get(ElementMeasurer));
```

The greatest advantage brought from a Service Map is that the implementation details of a service is abstracted, and you are only using a token to retrieve the service, which is the `ElementMeasurer` class constructor in the example above.

You can replace certain the implementation of a certain service with your own one to customize the behavior of the package:

```ts
class BetterElementMeasurer implements ElementMeasurer { ... }
services.set(ElementMeasurer, new BetterElementMeasurer());
```

As you are still using the `ElementMeasurer` class constructor as the token, there is no change required for any other parts of your application:

```ts
const measurer = services.get(ElementMeasurer); // BetterElementMeasurer
const node = new ProjectionNode(element, measurer);
```

### Dependency Injection

TODO

## Creating Your Wrappers

The `@layout-projection/core` APIs are highly extensible, but can also be cumbersome to work with directly. Feel free to wrap them up in a way that suits your needs best to ensure they are the fit for your application.
