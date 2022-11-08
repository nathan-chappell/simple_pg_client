import { Comment } from '../../components/Comment.ts'
import { Function_ } from '../../components/Function_.ts'
import { Interface, InterfacePropertyOptions } from '../../components/Interface.ts'
import { ParameterList } from '../../components/ParameterList.ts'
import { Parameter } from '../../components/Parameter.ts'
import { Variable } from '../../components/Variable.ts'
import { Block } from '../../structures/Block.ts'
import { MessageInfo } from './MessageInfo.ts'
import { ParseResult } from './ParseResult.ts'
import { adapterParameter, baseMessageParameter, parserName } from './common.ts'
import { If_ } from '../../structures/If_.ts'
import { TypeInfo } from './TypeInfo.ts'
import { IComponent } from '../../components/IComponent.ts'

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
                new ParameterList([baseMessageParameter]),
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
            // } else if (this.info.isAuthentication) {
            //     return `no parser for ${this.info.name} - authentication is handled separately`
        } else if (
            !this.info.isAuthentication &&
            this.info.properties.some(property => property.typeInfo.options.optional)
        ) {
            throw new Error('Optional type parsing is not implemented except for the Authentication Message')
        } else {
            const parameterList = new ParameterList([adapterParameter])
            let properties = this.info.properties.filter(property => !property.typeInfo.options.optional)

            if (this.info.extendsIBackendMessage) {
                console.log(` * ${this.info.name} extendsIBackendMessage`)
                parameterList.parameters.push(baseMessageParameter)
                properties = properties.slice(2)
            }

            const noAdditionalFields = properties.length === 0
            if (noAdditionalFields)
                parameterList.parameters[0] = parameterList.parameters[0].with({ hyphenPrefix: true })

            return new Function_(parserName(this.info), parameterList, `Promise<${this.info.name}>`).with({
                async_: true,
                arrow_: true,
                const_: true,
                export_: true,
                expressionBody_: noAdditionalFields,
                body: compiler => {
                    if (noAdditionalFields) {
                        compiler.write('baseMessage')
                    } else {
                        for (const property of properties) {
                            // prettier-ignore
                            const variable = new Variable(property.name, property.typeInfo.tsType).with({ decl: 'const' })
                            compiler.embed(new ParseResult(variable, property.typeInfo))
                        }

                        if (this.info.isAuthentication)
                            compiler.embed(...this.authenticationParserContinuation)

                        return compiler
                            .write('return ')
                            .build(new Block(), () => {
                                if (this.info.extendsIBackendMessage) compiler.writeLine('...baseMessage,')
                                for (const property of properties) compiler.writeLine(property.name, ',')
                                if (this.info.isAuthentication) compiler.writeLine('salt', ',')
                            })
                            .newLine()
                    }
                },
            })
        }
    }

    get authenticationParserContinuation(): IComponent[] {
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
            new If_(shouldParseSaltVariable).with({
                body: _compiler =>
                    _compiler.embed(
                        new ParseResult(saltVariable.with({ decl: null }), TypeInfo.fromRawType('Byte4'))
                    ),
            }),
        ]
    }
}
