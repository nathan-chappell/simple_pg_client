import { Comment } from '../../components/Comment.ts'
import { Function_ } from '../../components/Function_.ts'
import { Interface, InterfacePropertyOptions } from '../../components/Interface.ts'
import { ParameterList } from '../../components/ParameterList.ts'
import { Parameter } from '../../components/Parameter.ts'
import { Variable } from '../../components/Variable.ts'
import { Block } from '../../structures/Block.ts'
import { MessageInfo } from './MessageInfo.ts'
import { ParseResult } from './ParseResult.ts'

export class Message {
    constructor(public info: MessageInfo) {}

    get interface(): Interface {
        return new Interface(
            this.info.name,
            this.info.properties.map(p => {
                return {
                    name: p.name,
                    type: p.typeInfo.tsType,
                    lineComment: p.typeInfo.rawType,
                } as InterfacePropertyOptions
            })
        ).with({
            comment: new Comment(this.info.properties.map(p => `* @${p.name}: ${p.definition}`)),
            extends: this.info.extendsIBackendMessage ? ['IBackendMessage'] : [],
        })
    }

    get guard(): Function_ | string {
        const name0 = this.info.properties[0].name
        const typeInfo0 = this.info.properties[0].typeInfo
        // prettier-ignore
        const typeInfo2 = this.info.extendsAuthentication ? this.info.properties[2].typeInfo : null
        if (name0 !== 'messageType') {
            return `No type guard: messageType[0] === '${name0}'`
        } else if (typeInfo0.options.expected === null) {
            return `No type guard: no expected messageType`
        } else if (typeInfo0.options.itemType !== 'Byte1') {
            return `No type guard: itemType: ${typeInfo0.options.itemType}`
        } else {
            // prettier-ignore
            return new Function_(
                `is${this.info.name}`,
                new ParameterList([new Parameter('baseMessage', 'IBackendMessage')]),
                `baseMessage is ${this.info.name}`
            ).with({
                arrow_: false,
                export_: true,
                body: _compiler => this.info.extendsAuthentication
                ? _compiler.writeLine(`return isIAuthenticationMessage(baseMessage) && baseMessage.code === ${typeInfo2!.options.expected}`)
                : _compiler.writeLine(`return baseMessage.messageType === ${typeInfo0.options.expected}`)
            })
        }
    }

    get parser(): Function_ | string {
        if (!this.info.isBackend) {
            return `no parser for ${this.info.name} - currently only creating parsers for backend messages`
        } else if (this.info.isAuthentication) {
            return `no parser for ${this.info.name} - authentication is handled separately`
        } else {
            const parameterList = new ParameterList([new Parameter('adapter', 'DataTypeAdapter')])
            let fields = this.info.properties
            if (this.info.extendsIBackendMessage) {
                parameterList.parameters.push(new Parameter('baseMessage', 'IBackendMessage'))
                fields = fields.slice(2)
            }
            const noAdditionalFields = fields.length === 0
            if (noAdditionalFields) parameterList.parameters[0].name = `_${parameterList.parameters[0].name}`
            return new Function_(`parse${this.info.name}`, parameterList, `Promise<${this.info.name}>`).with({
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
                            // prettier-ignore
                            const variable = new Variable(field.name, field.typeInfo.tsType).with({ decl: 'const' })
                            compiler.embed(new ParseResult(variable, field.typeInfo))
                        }
                        return compiler
                            .write('return ')
                            .build(new Block(), () => {
                                if (this.info.extendsIBackendMessage) compiler.writeLine('...baseMessage,')
                                for (const field of fields) compiler.writeLine(field.name, ',')
                            })
                            .newLine()
                    }
                },
            })
        }
    }
}
