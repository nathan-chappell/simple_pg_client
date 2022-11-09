import { Comment } from '../../components/Comment.ts'
import { Function_ } from '../../components/Function_.ts'
import { Interface, InterfacePropertyOptions } from '../../components/Interface.ts'
import { ParameterList } from '../../components/ParameterList.ts'
import { Variable } from '../../components/Variable.ts'
import { Block } from '../../components/Block.ts'
import { MessageInfo } from './MessageInfo.ts'
import { ParseResult } from './ParseResult.ts'
import { adapterParameter, baseMessageParameter, parserName } from './common.ts'
import { TypeInfo } from './TypeInfo.ts'
import { IWriter } from '../../components/IWriter.ts'
import { ITextCompiler } from '../../compilers/ITextCompiler.ts'
import { If_ } from '../../components/If_.ts'
import { TComponent } from '../../compilers/TComponent.ts'
import { EmptyLine } from '../../components/EmptyLine.ts'

export class Message {
    constructor(public info: MessageInfo) {}

    get subComponentWriter(): TComponent {
        return (_compiler: ITextCompiler) =>
            _compiler.writeLines(this.interface, new EmptyLine(0), this.parser, new EmptyLine(0), this.guard)
    }

    get interface(): Interface {
        return new Interface(
            this.info.name,
            this.info.properties.map(p => {
                return {
                    name: p.name,
                    type: p.typeInfo.tsType,
                    lineComment: p.typeInfo.rawType,
                } as InterfacePropertyOptions
            }),
        ).with({
            comment: new Comment(this.info.properties.map(p => `* @${p.name}: ${p.definition}`)),
            extends: this.info.extendsIBackendMessage ? ['IBackendMessage'] : [],
        })
    }

    // returns null if true, otherwise an explanatory message as to why not
    shouldCreateGuard(): string | null {
        const name0 = this.info.properties[0].name
        const typeInfo0 = this.info.properties[0].typeInfo
        // prettier-ignore
        if (name0 !== 'messageType') {
            return `No type guard: messageType[0] === '${name0}'`
        } else if (typeInfo0.options.expected === null) {
            return `No type guard: no expected messageType`
        } else if (typeInfo0.options.itemType !== 'Byte1') {
            return `No type guard: itemType: ${typeInfo0.options.itemType}`
        }
        return null
    }

    _guardBody(): string {
        const expectedMessageType = this.info.properties[0].typeInfo.options.expected
        const expectedCode = this.info.properties[2]?.typeInfo.options.expected
        return this.info.extendsAuthentication
            ? `return isIAuthenticationMessage(baseMessage) && baseMessage.code === ${expectedCode}`
            : `return baseMessage.messageType === ${expectedMessageType}`
    }

    _comment(text: string): Comment {
        return new Comment([text]).with({ lineTargetLength: 120 })
    }

    get guard(): Function_ | Comment {
        const shouldCreateGuardMessage = this.shouldCreateGuard()
        if (shouldCreateGuardMessage !== null) return this._comment(shouldCreateGuardMessage)
        // prettier-ignore
        return new Function_(
                `is${this.info.name}`,
                new ParameterList([baseMessageParameter]),
                _compiler => _compiler.writeLine(this._guardBody()),
                `baseMessage is ${this.info.name}`
            ).with({
                arrow_: false,
                export_: true,
                bodyType: 'block'
            })
    }

    get parser(): Function_ | Comment {
        if (!this.info.isBackend) {
            return this._comment(`no parser for ${this.info.name} (not backend)`)
        } else if (
            !this.info.isAuthentication &&
            this.info.properties.some(property => property.typeInfo.options.optional)
        ) {
            throw new Error('Optional type parsing is not implemented except for the Authentication Message')
        } else {
            // const parameterList = new ParameterList([adapterParameter])
            let parameterList: ParameterList
            let properties = this.info.properties.filter(property => !property.typeInfo.options.optional)
            const noAdditionalFields = this.info.extendsIBackendMessage && properties.length === 2

            if (this.info.extendsIBackendMessage) {
                console.log(
                    ` * ${this.info.name} extendsIBackendMessage, noAdditionalFields: ${noAdditionalFields}`,
                )
                parameterList = new ParameterList([
                    adapterParameter.with({ hyphenPrefix: noAdditionalFields }),
                    baseMessageParameter,
                ])
                properties = properties.slice(2)
            } else {
                parameterList = new ParameterList([adapterParameter])
            }

            const body = (compiler: ITextCompiler) => {
                if (noAdditionalFields) {
                    return compiler.write('baseMessage')
                } else {
                    for (const property of properties) {
                        // prettier-ignore
                        const variable = new Variable(property.name, property.typeInfo.tsType).with({ decl: 'const' })
                        compiler.writeLine(new ParseResult(variable, property.typeInfo))
                    }

                    if (this.info.isAuthentication)
                        compiler.writeLines(...this.authenticationParserContinuation)

                    return compiler.writeLine(
                        'return ',
                        new Block(_compiler => {
                            if (this.info.extendsIBackendMessage) _compiler.writeLine('...baseMessage,')
                            for (const property of properties) _compiler.writeLine(property.name, ',')
                            if (this.info.isAuthentication) _compiler.writeLine('salt', ',')
                            return _compiler
                        }),
                    )
                }
            }

            return new Function_(
                parserName(this.info),
                parameterList,
                body,
                `Promise<${this.info.name}>`,
            ).with({
                async_: true,
                arrow_: true,
                const_: true,
                export_: true,
                bodyType: noAdditionalFields ? 'expression' : 'block',
            })
        }
    }

    get authenticationParserContinuation(): IWriter[] {
        const saltVariable = new Variable('salt', 'Byte4 | null').with({
            decl: 'let',
            value: 'null',
        })
        const shouldParseSaltVariable = new Variable('shouldParseSalt', 'boolean').with({
            value: 'code === 5',
            decl: 'const',
        })
        return [
            saltVariable,
            shouldParseSaltVariable,
            new If_(
                shouldParseSaltVariable.with({ decl: null, value: null }),
                new ParseResult(saltVariable.with({ decl: null }), TypeInfo.fromRawType('Byte4')),
            ),
        ]
    }
}
