import { ITextCompiler } from '../compilers/ITextCompiler.ts'

import { adapterParameter } from './components/common.ts'
import { BackendParser } from './components/BackendParser.ts'
import { Comment } from '../components/Comment.ts'
import { Function_ } from '../components/Function_.ts'
import { Import } from '../components/Import.ts'
import { Message } from './components/Message.ts'
import { MessageInfo } from './components/MessageInfo.ts'
import { ParameterList } from '../components/ParameterList.ts'
import { TypeDef } from '../components/TypeDef.ts'

import { Region } from '../structures/Region.ts'

import { Dependencies } from '../Dependencies.ts'
import { FileGenerator } from '../FileGenerator.ts'
import { formats } from './import/formats.ts'
import { FileTemplate } from '../components/FileTemplate.ts'

//#region Deno API thunks

//#endregion

const validateStartup = () => {
    const cwd = Dependencies.cwd()
    if (!cwd.endsWith('simple_pg_client')) {
        throw new Error(`Generation script should be run from project root.\n  cwd: ${cwd}`)
    } else {
        console.log(`[validateStartup] cwd: ${cwd}`)
    }
}

validateStartup()

//#region globals

const outputDirectory = './src/messages'
const builtinsFileName = 'builtinTypes'

export type TBuiltinTypeInfo = { jsType: string; adapterType: string }

//prettier-ignore
export const builtinTypes: { [type: string]: TBuiltinTypeInfo } = {
    Int32:  { jsType: 'number',     adapterType: 'Int32' },
    Int16:  { jsType: 'number',     adapterType: 'Int16' },
    Int8:   { jsType: 'number',     adapterType: 'Int8' },
    Byte:   { jsType: 'number',     adapterType: 'Int8' },
    Byte1:  { jsType: 'string',     adapterType: 'Char' },
    Byte4:  { jsType: 'number[]',   adapterType: 'Byte4' },
    String: { jsType: 'string',     adapterType: 'String' },
    // Char:   { jsType: 'string',   adapterType: 'Char'   }, // no longer used...
}

const messageInfos = formats.map(format => new MessageInfo(format))
const messages = messageInfos.map(info => new Message(info))

//#endregion

//#region imports

const imports_ = {
    DataTypeAdapter: new Import(['DataTypeAdapter'], '../streams/dataTypeAdapter.ts'),
    // MessageWriterAdapter: new Import(['DataTypeAdapter'], '../streams/dataTypeAdapter.ts'),
    builtins: new Import(
        [...Object.keys(builtinTypes), ...Object.keys(builtinTypes).map(t => `parse${t}`)],
        `./${builtinsFileName}.generated.ts`,
    ),
}

//#endregion

//#region builtins

const builtinsFileGenerator = new FileGenerator(builtinsFileName, outputDirectory).with({
    imports: [imports_.DataTypeAdapter],
    body: [
        ...Object.entries(builtinTypes).map(([name, { jsType }]) => new TypeDef(name, jsType)),
        ...Object.entries(builtinTypes).map(([name, { adapterType }]) =>
            new Function_(`parse${name}`, new ParameterList([adapterParameter]), `Promise<${name}>`).with({
                arrow_: true,
                export_: true,
                const_: true,
                expressionBody_: true,
                body: _compiler => {
                    _compiler.write(`adapter.read${adapterType}()`)
                },
            }),
        ),
    ],
})

//#endregion

//#region messages

const messageFormatFileGenerator = new FileGenerator('messageFormats', outputDirectory).with({
    lintIgnores: ['no-inferrable-types', 'require-await'],
    imports: Object.values(imports_),
    body: messages.filter(message => !message.info.extendsAuthentication).map(message => new Region(message.info.name))
})


const genMessages = (compiler: ITextCompiler) => {
    compiler
        .embed(new Comment([`deno-lint-ignore-file ${ignoreLintRules.join(' ')}`]))
        .newLine()
        .embed(...Object.values(imports_))
        .newLine()
    for (const message of messages.filter(message => !message.info.extendsAuthentication)) {
        compiler.build(new Region(message.info.name), _compiler => {
            const components = [message.interface, message.parser, message.guard]
            for (const component of components) {
                if (typeof component === 'string') {
                    _compiler.embed(new Comment([component]).with({ lineTargetLength: 120 }))
                } else {
                    _compiler.embed(component).newLine()
                }
                _compiler.newLine()
            }
        })
    }
    compiler.build(new Region('BackendParser'), new BackendParser(messageInfos).compilerCallback)
}

//#endregion

//#region write/read tests

const writeReadTestTemplate = new FileTemplate('messageFormat.test', './src/codegen/messages/templates') // getTemplate('messageFormat.test')

const makeWriteReadTestFileGenerator: (message: Message) => FileGenerator = message =>
    new FileGenerator(`writeReadTest.${message.info.name}.test`, `${outputDirectory}/tests`).with({
        body: [
            writeReadTestTemplate.with({
                replacements: { __MESSAGE_TYPE__: message.info.name },
            }),
        ],
    })

const writeReadTestFileGenerators = messages
    .filter(message => message.shouldCreateGuard)
    .map(makeWriteReadTestFileGenerator)

//#endregion

// const genFile2 = (fileName: string, writeFile: (compiler: ITextCompiler) => void) => {
// const genFile2 = (fileName: string, writeFile: (compiler: ITextCompiler) => void) => {
//     const outputPath = `${outputDirectory}/${fileName}.generated.ts`
//     const compiler = new TextCompiler()
//     writeFile(compiler)
//     /// FILE
//     const file = `${warning}\n${compiler.compile()}\n${warning}`
//     Deno.writeTextFileSync(outputPath, file)
//     console.log(`[genFile2] Generating file ${fileName} complete`)
// }

genFile2(builtinsFileName, genBuiltins2)
genFile2('messageFormats', genMessages)
// for (const fileGenerator of genWriteReadTestFileGenerators()) {
//     genFile2(`writeReadTests/${}`)
// }
