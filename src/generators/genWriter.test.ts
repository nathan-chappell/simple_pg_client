import { FunctionDef, ParameterDef, GenWriter } from "./genWriter.ts";

Deno.test('GenWriter.writeFunction should look good', () => {
    const writer = new GenWriter();
    const functionDef = new FunctionDef(
        'testFn',
        [
            new ParameterDef('numberParam1', 'number', '9'),
            new ParameterDef('stringParam2', 'string', "'default'"),
            new ParameterDef('stringParam3', 'string', "'default'"),
            new ParameterDef('stringParam4', 'string', "'default'"),
            new ParameterDef('stringParam5', 'string', "'default'"),
        ],
        'Promise<string>',
        {
            arrow_: false,
            async_: true,
            const_: true,
            export_: true,
        }
    )
    writer.writeFunction(functionDef, (w) => w.writeLine('return Promise.resolve("foobar")'));
    console.log(writer.compile())
})

Deno.test('GenWriter.writeFunction should look good', () => {
    const writer = new GenWriter();
    const functionDef = new FunctionDef(
        'testFn',
        [
            new ParameterDef('numberParam1', 'number', '9'),
            new ParameterDef('stringParam2', 'string', "'default'"),
        ],
        null,
        {
            arrow_: true,
            async_: true,
            const_: true,
            export_: false,
        }
    )
    writer.writeFunction(functionDef, (w) => w.writeLine('return Promise.resolve("foobar")'));
    console.log(writer.compile())
})

Deno.test('GenWriter.writeFunction should look good', () => {
    const writer = new GenWriter();
    const functionDef = new FunctionDef(
        'testFn',
        [
            new ParameterDef('numberParam1', 'number', '9'),
            new ParameterDef('stringParam2', 'string', "'default'"),
        ],
        'Promise<string>',
        {
            arrow_: true,
            async_: true,
            const_: true,
            export_: false,
        }
    )
    writer.writeFunction(functionDef, (w) => w.writeLine('return Promise.resolve("foobar")'));
    console.log(writer.compile())
})