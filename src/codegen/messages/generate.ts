import { adapterParameter } from './components/common.ts'
import { BackendParser } from './components/BackendParser.ts'
import { EmptyLine } from '../components/EmptyLine.ts'
import { FileTemplate } from '../components/FileTemplate.ts'
import { Function_ } from '../components/Function_.ts'
import { Import } from '../components/Import.ts'
import { Message } from './components/Message.ts'
import { MessageInfo } from './components/MessageInfo.ts'
import { ParameterList } from '../components/ParameterList.ts'
import { Region } from '../components/Region.ts'
import { TypeDef } from '../components/TypeDef.ts'

import { Dependencies } from '../Dependencies.ts'
import { FileGenerator } from '../FileGenerator.ts'

import { formats } from './import/formats.ts'
import { TypedValueGenerator } from './components/TypedValueGenerator.ts'
import { TypeInfo } from './components/TypeInfo.ts'
import { ITextCompiler } from '../compilers/ITextCompiler.ts'

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
const builtinsFileName = 'builtinTypes.generated'

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
    KVPairs: { jsType: '[string, string][]', adapterType: 'KVPairs' },
    // Char:   { jsType: 'string',   adapterType: 'Char'   }, // no longer used...
}

const messageInfos = formats.map(format => new MessageInfo(format))
const messages = messageInfos.map(info => new Message(info))

//#endregion

//#region imports

const imports_ = {
    DataTypeAdapter: new Import(['DataTypeAdapter'], '../streams/dataTypeAdapter.ts'),
    // MessageWriterAdapter: new Import(['DataTypeAdapter'], '../streams/dataTypeAdapter.ts'),
    ITypedValue: new Import(['NamedTypedValue'], './ITypedValue.ts'),
    builtins: new Import(
        [
            ...Object.keys(builtinTypes),
            ...Object.keys(builtinTypes)
                .filter(k => k !== 'KVPairs')
                .map(t => `parse${t}`),
        ],
        `./${builtinsFileName}.ts`,
    ),
}

//#endregion

//#region builtins

const builtinsFileGenerator = new FileGenerator(builtinsFileName, outputDirectory).with({
    imports: [imports_.DataTypeAdapter],
    components: [
        ...Object.entries(builtinTypes).map(([name, { jsType }]) => new TypeDef(name, jsType)),
        new EmptyLine(0),
        ...Object.entries(builtinTypes).map(([name, { adapterType }]) =>
            new Function_(
                `parse${name}`,
                new ParameterList([adapterParameter]),
                _compiler => _compiler.write(`adapter.read${adapterType}()`),
                `Promise<${name}>`,
            ).with({
                arrow_: true,
                export_: true,
                const_: true,
                bodyType: 'expression',
            }),
        ),
    ],
})

//#endregion

//#region messages

const messageFormatRegions = messages
    .filter(message => !message.info.extendsAuthentication)
    .map(message => new Region(message.info.name, message.subComponentWriter))

const backendParserRegion = new Region('BackendParser', new BackendParser(messageInfos))
const frontendMessageMakerRegion = new Region('Frontend Message Makers', (compiler: ITextCompiler) =>
    compiler.writeLines(
        ...messages
            .filter(m => m.info.isFrontend)
            .map(m => m.messageMaker.with({ bodyType: 'expression', export_: true })),
    ),
)

const messageFormatFileGenerator = new FileGenerator('messageFormats.generated', outputDirectory).with({
    lintIgnores: ['no-inferrable-types', 'require-await'],
    imports: Object.values(imports_),
    components: [...messageFormatRegions, backendParserRegion, frontendMessageMakerRegion],
})

//#endregion

//#region write/read tests

const writeReadTestTemplate = new FileTemplate('messageFormat.test', './src/codegen/messages/templates')

const typedValueGenerator = new TypedValueGenerator()

const makeWriteReadTestFileGenerator: (message: Message) => FileGenerator = message =>
    new FileGenerator(`writeReadTest.${message.info.name}.generated.test`, `${outputDirectory}/tests`).with({
        components: [
            writeReadTestTemplate.with({
                replacements: {
                    __MESSAGE_TYPE__: message.info.name,
                    __EXPECTED_TYPED_VALUES__: JSON.stringify(typedValueGenerator.nextMessage(message)),
                },
            }),
        ],
    })

const writeReadTestFileGenerators = messages
    .filter(
        message =>
            !message.info.extendsAuthentication &&
            !message.info.isSSL &&
            !message.info.isInternal &&
            !message.info.isStartup &&
            message.info.extendsIBackendMessage &&
            message.info.name !== 'CancelRequest' &&
            message.info.name !== 'RowDescription',
    )
    .map(makeWriteReadTestFileGenerator)

//#endregion

builtinsFileGenerator.emit()
messageFormatFileGenerator.emit()
for (const fileGenerator of writeReadTestFileGenerators) {
    fileGenerator.emit()
    // console.warn(`NOT EMITTING: ${fileGenerator.name}`)
}

// const generator = new TypedValueGenerator()
// for (const message of messages) {
//     console.log(JSON.stringify(generator.nextMessage(message), null, 2))
// }
