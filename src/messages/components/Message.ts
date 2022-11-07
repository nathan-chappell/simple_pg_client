import { Interface } from '../../components/Interface.ts'
import { Variable } from '../../components/Variable.ts'
import { Function_ } from '../../components/Function_.ts'
import { IMessageField, IMessageFormat } from '../extraction/formats.ts'
import { ParameterList } from '../../components/ParameterList.ts'
import { Parameter } from '../../components/Parameter.ts'
import { TypeInfo } from './TypeInfo.ts'
import { ParseResult } from './ParseResult.ts'
import { Block } from '../../structures/Block.ts'

export class Message {
    constructor(public format: IMessageFormat) {}

    get interface(): Interface {
        throw new Error('not implemented')
    }

    get guard(): Function_ {
        throw new Error('not implemented')
    }

    get parser(): Function_ {
        return new Function_(
            `parse${this.format.title}`,
            new ParameterList([new Parameter('adapter', 'DataTypeAdapter')]),
            this.format.title
        ).with({
            async_: true,
            arrow_: true,
            const_: true,
            export_: true,
            body: compiler => {
                for (const field of this.format.definition) {
                    const typeInfo = TypeInfo.fromRawType(field.type)
                    // prettier-ignore
                    const variable = new Variable(field.name, typeInfo.tsType).with({ decl: 'const' })
                    compiler.embed(new ParseResult(variable, typeInfo))
                }
                return compiler.write('return ').build(new Block(), () => {
                    for (const field of this.format.definition) {
                        compiler.writeLine(field.name, ',')
                    }
                }).writeLine(' // ', this.format.title)
            },
        })
    }
}
