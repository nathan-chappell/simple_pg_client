import { Comment } from '../../components/Comment.ts'
import { Function_ } from '../../components/Function_.ts'
import { Interface, InterfacePropertyOptions } from '../../components/Interface.ts'
import { ParameterList } from '../../components/ParameterList.ts'
import { Parameter } from '../../components/Parameter.ts'
import { Variable } from '../../components/Variable.ts'
import { Block } from '../../structures/Block.ts'
import { IMessageFormat } from '../import/formats.ts'
import { ParseResult } from './ParseResult.ts'
import { TypeInfo } from './TypeInfo.ts'

export class Message {
    constructor(public format: IMessageFormat) {}

    get isAuthentication() {
        return this.format.title.match(/Authentication\w+/) !== null
    }

    get extendsIBackendMessage() {
        return !this.format.internal
    }

    get interface(): Interface {
        return new Interface(
            this.format.title,
            this.format.definition.map(p => {
                const typeInfo = TypeInfo.fromRawType(p.type)
                return {
                    name: p.name,
                    type: typeInfo.tsType,
                    lineComment: typeInfo.rawType,
                } as InterfacePropertyOptions
            })
        ).with({
            comment: new Comment(this.format.definition.map(p => `* @${p.name}: ${p.definition}`)),
            extends: this.extendsIBackendMessage ? ['IBackendMessage'] : [],
        })
    }

    get guard(): Function_ | string {
        const name0 = this.format.definition[0].name
        const typeInfo0 = TypeInfo.fromRawType(this.format.definition[0].type)
        if (name0 !== 'messageType') {
            return `No type guard: messageType[0] === '${name0}'`
        } else if (typeInfo0.options.expected === null) {
            return `No type guard: no expected messageType`
        } else if (typeInfo0.options.itemType !== 'Byte1') {
            return `No type guard: itemType: ${typeInfo0.options.itemType}`
        } else {
            return new Function_(
                `is${this.format.title}`,
                new ParameterList([new Parameter('baseMessage', 'IBackendMessage')]),
                `baseMessage is ${this.format.title}`
            ).with({
                arrow_: false,
                export_: true,
                body: _compiler =>
                    _compiler.writeLine(`return baseMessage.messageType === ${typeInfo0.options.expected}`),
            })
        }
    }

    get parser(): Function_ | string {
        if (!this.format.backend) {
            return `no parser for ${this.format.title} - currently only creating parsers for backend messages`
        } else if (this.isAuthentication) {
            return `no parser for ${this.format.title} - authentication is handled separately`
        } else {
            const parameterList = new ParameterList([new Parameter('adapter', 'DataTypeAdapter')])
            let fields = this.format.definition
            if (this.extendsIBackendMessage) {
                parameterList.parameters.push(new Parameter('baseMessage', 'IBackendMessage'))
                fields = fields.slice(2)
            }
            const noAdditionalFields = fields.length === 0
            if (noAdditionalFields) parameterList.parameters[0].name = `_${parameterList.parameters[0].name}`
            return new Function_(
                `parse${this.format.title}`,
                parameterList,
                `Promise<${this.format.title}>`
            ).with({
                async_: true,
                arrow_: true,
                const_: true,
                export_: true,
                expressionBody_: noAdditionalFields,
                body: compiler => {
                    if (noAdditionalFields) {
                        compiler.write('baseMessage')
                    } else {
                        for (const field of fields) {
                            const typeInfo = TypeInfo.fromRawType(field.type)
                            // prettier-ignore
                            const variable = new Variable(field.name, typeInfo.tsType).with({ decl: 'const' })
                            compiler.embed(new ParseResult(variable, typeInfo))
                        }
                        return compiler
                            .write('return ')
                            .build(new Block(), () => {
                                if (this.extendsIBackendMessage) {
                                    compiler.writeLine('...baseMessage,')
                                }
                                for (const field of fields) {
                                    compiler.writeLine(field.name, ',')
                                }
                            })
                            .newLine()
                    }
                },
            })
        }
    }
}
