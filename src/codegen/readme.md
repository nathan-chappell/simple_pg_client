# Overview:

There are essentially two approaches to code-generation considered in this project:
* Ad-hoc scripting: these scripts are "one-off" scripts that are not expected to be used for other purposes
* Structured: these scripts are composed of semantic fragments of code consisting of *Components* or *Structures*

The *ad-hoc scripting* approach is straightforward but not necessarily encouraged.  The *structured* approach is the main interest of this project.  The *structured* approach here concerns two entities, **components** and **structures**:

* *Components are embedded by a compiler with options*
* *Structures are built by a compiler with instructions*

## Configurable components

All components currently extend `Configurable<TOptions>`.  `Configurable<TOptions>` offers a `.with(overrides: Partial<TOptions>)` method which returns a proxy to the original object, directing accesses to `options` to the provided argument.  This allows temporary-overriding behavior for the component's options.  The implication is that the values provided to a component are "immutable" or intrinsicly related to the component, while the `options` specify compilation behavior that may change between emissions.  For example, consider the `Variable` component.  Its options include a `decl: null | 'let' | 'const'` property.  Then we can do:

```
const xVariable = new Variable('x', 'number').with({ decl: 'const' })
compiler.embed(xVariable.with({ value: 1 }))
// const x: number = 1
```

```
const xVariable = new Variable('x', 'number').with({ decl: 'let', value: 0 })
compiler.embed(xVariable).writeLine(';').embed(xVariable.with(decl: null, value: 1))
// let x: number = 0;
// x = 1
```

## Nature of Components and Structures

While components and structures tend to be directly related to a syntactic fragment of the javascript language, it would be a mistake to consider them as such.  These entities arise in a bottom-up fashion from the requirements of the generators we are using.  We aren't trying to build a complete or conforming javascript AST - we want the "minimal" functionality required to generate our code in a comfortable manner.  Reusability, generality, and convenience are often in competition with one another - when in doubt about an implementation or abstraction you'd like to create, ask yourself the following two questions:

* which way is the easiest for me to implement?
* can I explain this to my rubber ducky?

The first question ranks your options, the second one filters them.

## Main takeaways:

**Components** represent complete semantic fragments of a program, and are embedded by a compiler by doing `compiler.embed(component)`.

**Structures** represent incomplete semantic fragments of a program, and are built by a compiler by doing `compiler.build(structure, ...callbacks)`.

