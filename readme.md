# pg-client-js
A minimal client for postgres completely written in typescript

### Usage

* To generate the message formats:
    * `deno.exe run --allow-read --allow-write .\src\codegen\messages\generate.ts`

## Project Goals
* no dependencies

## Design Goals
* maximal use of code-generation (look [here](./src/codegen/readme.md) for an overview)
* tests!

## Remarks
* currently using [deno](https://deno.land/) - installation script can be found in `_deno/` (or go find it yourself at deno land)
* all code-generators should function by running:
    * `deno run --allow-read --allow-write ./src/path/to/generator.ts`
    * i.e., they should be run from project root

## Todo
* implement some principled logging/errors
* tests
* protocol (state-machine)

### Tasks

1. Write some tests
    * Generalize and implement generation (if feasible)
2. Protocol
    * declarative
    * generation...