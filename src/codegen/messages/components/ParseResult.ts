import { ITextCompiler } from '../../compilers/ITextCompiler.ts'
import { IComponent } from '../../components/IComponent.ts'
import { ForRange } from '../../components/ForRange.ts'
import { Variable } from '../../components/Variable.ts'
import { varName } from '../../utils.ts'
import { TypeInfo } from './TypeInfo.ts'

export class ParseResult implements IComponent {
    constructor(public result: Variable, public typeInfo: TypeInfo) {}

    with(_options: Partial<Record<never, never>>): this {
        throw new Error('Method not implemented.')
    }

    write(compiler: ITextCompiler): ITextCompiler {
        const { itemType, sizeTypes } = this.typeInfo.options
        if (!this.typeInfo.isArray) {
            return compiler.embed(this.result.with({ value: `await parse${itemType}(adapter)` })).newLine()
        } else {
            const sizeTypeInfo = TypeInfo.fromRawType(sizeTypes[sizeTypes.length - 1])
            const sizeVar = new Variable(varName('size'), sizeTypeInfo.tsType).with({ decl: 'const' })
            // prettier-ignore
            const innerItemArrayPart = sizeTypes.slice(0,-1).map(t => `[${t}]`).join('')
            const innerItemTypeInfo = TypeInfo.fromRawType(`${itemType}${innerItemArrayPart}`)
            const innerItemVar = new Variable(varName('result'), innerItemTypeInfo.tsType).with({
                decl: 'const',
            })
            return compiler
                .embed(new ParseResult(sizeVar, sizeTypeInfo))
                .embed(this.result.with({ value: '[]' }))
                .newLine()
                .build(new ForRange(sizeVar.name), () => {
                    compiler
                        .embed(new ParseResult(innerItemVar, innerItemTypeInfo))
                        .writeLine(`${this.result.name}.push(${innerItemVar.name})`)
                })
                .newLine()
        }
    }
}
