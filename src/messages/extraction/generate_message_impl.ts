import { writeFileSync } from 'https://deno.land/std@0.161.0/node/fs.ts'
import { formats, IProperty, IMessageDef } from './formats.ts'

const validateStartup = () => {
    const cwd = Deno.cwd()
    if (!cwd.endsWith('simple_pg_client')) {
        throw new Error(`Generation script should be run from project root.\n  cwd: ${cwd}`)
    } else {
        console.log(`[validateStartup] cwd: ${cwd}`)
    }
}

//#region globals
const builtinsFileName = 'builtinTypes'
const messageDefsFileName = 'messageDefinitions'

const indent = (n: number) => (s: string) => ' '.repeat(n) + s

const alignOnColumn = (pre: string, alignment: number, post: string) =>
    `${pre}${indent(alignment - pre.length)(post)}`

const warning = `/* DO NOT EDIT THIS FILE!!!  It has been generated for your pleasure. */`

// Authentication messages are trickier and will be handled separately
const backendNonAuthenticationFormats = formats.filter(f => f.backend && !f.title.match(/Authentication/))

const nonInternalMessageDefs = new Set(formats.filter(f => !f.internal).map(f => f.title))
const internalMessageDefs = new Set(formats.filter(f => f.internal).map(f => f.title))

// const builtinTypes: { [type: string]: { [attr: string]: string } } = {
const builtinTypes: { [type: string]: { jsType: string; adapterType: string } } = {
    Int32: { jsType: 'number', adapterType: 'Int32' },
    Int16: { jsType: 'number', adapterType: 'Int16' },
    Int8: { jsType: 'number', adapterType: 'Int8' },
    Byte: { jsType: 'number', adapterType: 'Int8' },
    Byte1: { jsType: 'string', adapterType: 'Char' },
    String: { jsType: 'string', adapterType: 'String' },
}

const dataAdapterImport = "import { DataTypeAdapter } from '../streams/dataTypeAdapter.ts'"
// prettier-ignore
const imports = `
${dataAdapterImport}
import {
${[...Object.keys(builtinTypes)].map(t => `${t},`).map(indent(4)).join('\n')}
${[...Object.keys(builtinTypes)].map(t => `parse${t},`).map(indent(4)).join('\n')}
} from './${builtinsFileName}.generated.ts'
`

//#endregion

//#region builtins

const getBuiltinTypeAttr = (type: string, attr: 'jsType' | 'adapterType') => {
    const attrValue = (builtinTypes[type] || {})[attr]
    if (attrValue === undefined) throw new Error(`[getBuiltinTypeAttr] couldn't find ${type}.${attr}`)
    return attrValue
}

const genBuiltins = () => {
    const genTypeExport = (name: string) => `export type ${name} = ${getBuiltinTypeAttr(name, 'jsType')};`
    const genParserDefinition = (name: string) =>
        `export const parse${name} = (adapter: DataTypeAdapter) => adapter.read${getBuiltinTypeAttr(
            name,
            'adapterType'
        )}();`

    /// FILE
    return `
${dataAdapterImport}

${Object.keys(builtinTypes).map(genTypeExport).join('\n')}

${Object.keys(builtinTypes).map(genParserDefinition).join('\n')}
`
}

//#endregion

//#region ITypeInfo

type TArraySizeInfo = ('Int16' | 'Int32')[]

interface ITypeInfo {
    arraySizeInfo: TArraySizeInfo
    baseType: string
    expected: string | null
    rawName: string
    typeNoArray: string
    typeScriptName: string
}

const getArraySizeInfo: (rawName: string) => TArraySizeInfo = (rawName: string) =>
    [...rawName.matchAll(/\[Int16|Int32\]/g)].map(m => m[1]).reverse() as TArraySizeInfo

const substrTo = (s: string, c: string) => (s.includes(c) ? s.substring(0, s.indexOf(c)) : s)
const getTypeNoArray = (rawName: string) => substrTo(rawName, '[')
const getTypeNoExpected = (rawName: string) => substrTo(rawName, '(')
const getExpected = (rawName: string) =>
    (rawName.match(/[^(]*\((?<expected>[^)]*)\)/)?.groups ?? {}).expected ?? null

const getTypeScriptName = (rawName: string) => {
    const typeNoExpected = getTypeNoExpected(rawName)
    if (typeNoExpected in builtinTypes) {
        return typeNoExpected
    } else if (typeNoExpected.includes('|')) {
        return typeNoExpected
    } else if (nonInternalMessageDefs.has(typeNoExpected)) {
        return `I${typeNoExpected}`
    } else if (internalMessageDefs.has(typeNoExpected)) {
        return typeNoExpected
    } else if (typeNoExpected.match(/\[\w+\]/)) {
        const typeNoArray = getTypeNoArray(typeNoExpected)
        const baseTypeNoArray: string = getTypeScriptName(typeNoArray)
        const rank = Array.from(typeNoExpected.matchAll(/\[\w+\]/g)).length
        return `${baseTypeNoArray}${'[]'.repeat(rank)}`
    } else {
        throw new Error(`[getTypeScriptTypeName]: Can't convert type: ${typeNoExpected}`)
    }
}

const getTypeInfo: (rawName: string) => ITypeInfo = rawName => {
    const typeScriptName = getTypeScriptName(rawName)
    const typeNoArray = getTypeNoArray(rawName)
    const baseType = getTypeNoExpected(getTypeNoArray(rawName))
    const arraySizeInfo = getArraySizeInfo(rawName)
    const expected = getExpected(rawName)

    return {
        arraySizeInfo,
        baseType,
        expected,
        rawName,
        typeNoArray,
        typeScriptName,
    }
}

//#endregion

//#region interfaces

const getBaseInterface = (name: string) => {
    if (name.match(/Authentication/)) return 'IAuthenticationMessage'
    switch (name) {
        case 'IBackendMessage':
            return ''
        default:
            return 'IBackendMessage'
    }
}

const getInterfaceProperty = (defItem: IProperty, i: number) => {
    if (!defItem.name) throw new Error(`name missing from definition[${i || 0}]: ${defItem.definition}`)
    const typeInfo = getTypeInfo(defItem.type)
    const decl = `${defItem.name}: ${typeInfo.typeScriptName}`
    return alignOnColumn(decl, 35, `// ${defItem.type}`)
}

const genInterface = (format: IMessageDef) => {
    const interfaceName = getTypeScriptName(format.title)
    try {
        const properties = format.definition.map(getInterfaceProperty)
        const baseInterface = getBaseInterface(interfaceName)
        const extendsClause = baseInterface === '' ? '' : `extends ${baseInterface} `

        return [
            `export interface ${interfaceName} ${extendsClause}{`,
            ...properties.map(indent(4)),
            `}`,
        ].join('\n')
    } catch (e) {
        throw new Error(`Error creating type ${format.title}: ${e}`)
    }
}

//#endregion

//#region parsers

const getPropertyParser = (property: IProperty) => {
    if (property.type in builtinTypes) {
        const adapterType = getBuiltinTypeAttr(property.type, 'adapterType')
        return `export const ${property.name} = await parse${typeInfo.baseType}(adapter)`
    }
    const typeInfo = getTypeInfo(property.type)
}

const genParser = (messageDef: IMessageDef) => {
    const messageTypeInfo = getTypeInfo(messageDef.title)
    const parserType = `(adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<${messageTypeInfo.typeScriptName}>`
    const propertyParsers = messageDef.definition.map(getPropertyParser)
    const resultBody = messageDef.definition.map(p => `${p.name},`)
    return [
        `const parse${messageDef.title}: ${parserType}`,
        indent(2)(`= async (adapter, baseMessage) => {`),
        ...propertyParsers.map(indent(4)),
        indent(4)('return {'),
        indent(8)('...baseMessage,'),
        ...resultBody.map(indent(8)),
        indent(4)('}'),
        `}`,
    ].join('\n')
}

//#endregion

//#region main generators

// function genParser(format: IMessageDef) {
//     const typeName = format.title.match(/^\w+/)![0]
//     const _typeName = typeName.startsWith('I') ? typeName : `I${typeName}`
//     needTypes.add(_typeName)
//     const props = format.definition.slice(2).map(prop => [prop.name, getParser(getTypeInfo(prop.type))])
//     return genMessageParsingFunction(typeName, props)
// }

// function genBackendParsers(name: string, formatList: IMessageDef[]) {
//     const parserDefs = formatList.map(genParser)
//     const typeImports = `import {
// ${[...needTypes].map(t => `    ${t},`).join('\n')}
// } from './backendFormats.generated.ts'`

//     const fileData = `
// ${imports}
// ${typeImports}
// ${parserDefs.join('\n\n')}`
//     writeFileSync(`./src/messages/${name}.generated.ts`, fileData)
// }

//#endregion

//#region main()

const genFile = (fileName: string, genFile: () => string) => {
    const path = `./src/messages/${fileName}.generated.ts`
    console.log(`[genFile] Generating file ${fileName} ...`)
    /// FILE
    const file = `${warning}\n${genFile()}\n${warning}`
    writeFileSync(path, file)
    console.log(`[genFile] Generating file ${fileName} complete`)
}

// genBackendParsers('backendMessageParsers', backendNonAuthenticationFormats)

const genMessageDefs = () => `${imports}

${backendNonAuthenticationFormats.map(genInterface).join('\n\n')}

${backendNonAuthenticationFormats.map(genParser).join('\n\n')}
`

genFile(builtinsFileName, genBuiltins)
genFile(messageDefsFileName, genMessageDefs)

//#endregion
