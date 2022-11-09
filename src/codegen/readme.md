# Code Generation:

## Overview

There are essentially two approaches to code-generation considered in this project:
* Ad-hoc scripting: these scripts are "one-off" scripts that are not expected to be used for other purposes
* Structured: these scripts are composed of fragments of code consisting of *Components*

The *ad-hoc scripting* approach is straightforward but not necessarily encouraged.  The *structured* approach is the main interest of this project.  The *structured* approach here makes use of the following abstractions:

```typescript
export interface ICompiler {
    compile(): string
}

export interface IWriter {
    write(compiler: ITextCompiler): ITextCompiler
}

export type CompilerCallback = (compiler: ITextCompiler) => ITextCompiler

export type TComponent = string | CompilerCallback | IWriter | ICompiler
```

## Fluent interface

It has been found convenient to design the code-generation interface as a [fluent interface](https://en.wikipedia.org/wiki/Fluent_interface).

This is why the return type of many methods return the `ITextCompiler` passed to them, to enable method chaining.  Using the *fluent interface* pattern has also led to a major simplification of the `ITextCompiler` interface, culminating in the type `TComponent`, a dijoint-union which can be freely passed to the `write*` methods of `ITextCompiler`.

## TComponent

The `IWriters` tend to correspond to parts of the *javascript syntax*, such as `ParameterList` or `Function_`.

Generating a file therefore consists of determining what combination of `Writers` (chunks of language), `strings` (for emitting raw-javascript), and `CompilerCallbacks` are required to write the file.

`ICompiler` is more of an *internal* interface - here is the list of entities currently implementing `ICompiler`:

* `TextCompiler` - this is the main *engine* of compilation
* `Line` - this is used for alignment / indentation
* `FileTemplate` - used for generating code from a template
* `FileGenerator` - compile is used to get the text content of a file before `emit`-ing it

## Configurable components

Almost all components currently extend `Configurable<TOptions>`.  `Configurable<TOptions>` offers a `.with(overrides: Partial<TOptions>)` method which returns a proxy to the original object, directing accesses to `options` to the provided argument.  This allows temporary-overriding behavior for the component's options.  The implication is that the values provided to a component are "immutable" or intrinsicly related to the component, while the `options` specify compilation behavior that may change between writes.  For example, consider the `Variable` component.  Its options include a `decl: null | 'let' | 'const'` property.  Then we can do:

```typescript
const xVariable = new Variable('x', 'number').with({ decl: 'const' })
compiler.write(xVariable.with({ value: 1 }))
// expected output:
/// const x: number = 1
```

```typescript
const xVariable = new Variable('x', 'number').with({ decl: 'let', value: 0 })
compiler.writeLine(xVariable).write(xVariable.with(decl: null, value: 1))
// expected output:
/// let x: number = 0
/// x = 1
```

**NOTE** The one oddity of this "pattern" is that often you will call `.with` immediately after constructing a *Component.*  Let's just call it *idiomatic* for the configurable components.

## Nature of Components

While components tend to be directly related to a syntactic fragment of the javascript language, it would be a mistake to consider them as such.  These entities arise in a bottom-up fashion from the requirements of the generators we are using.  We aren't trying to build a complete or conforming javascript AST - we want the "minimal" functionality required to generate our code in a comfortable manner.  Reusability, generality, and convenience are often in competition with one another - when in doubt about an implementation or abstraction you'd like to create, ask yourself the following two questions:

* which way is the easiest for me to implement?
* can I explain this to my rubber ducky?

The first question ranks your options, the second one filters them.