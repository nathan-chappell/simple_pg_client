import { IComponent } from '../../components/IComponent.ts'
import { ForRange } from '../../components/ForRange.ts'
import { ITextCompiler } from '../../compilers/ITextCompiler.ts'
import { TypeInfo } from './TypeInfo.ts'
import { varName } from '../../components/utils.ts'
import { Variable } from '../../components/Variable.ts'

export class ParseResult implements IComponent {
    constructor(public result: Variable, public typeInfo: TypeInfo) { }

    with(_options: Partial<Record<never, never>>): this {
        throw new Error('Method not implemented.')
    }

    write(compiler: ITextCompiler): ITextCompiler {
        const { itemType, sizeTypes } = this.typeInfo.options
        if (!this.typeInfo.isArray) {
            return compiler.embed(this.result.with({ value: `await parse${itemType}(adapter)` }))
        } else {
            const sizeTypeInfo = TypeInfo.fromRawType(sizeTypes[sizeTypes.length - 1])
            const sizeVar = new Variable(varName('size'), sizeTypeInfo.tsType).with({ decl: 'const' })
            // prettier-ignore
            const innerItemArrayPart = sizeTypes.slice(0,-1).map(t => `[${t}]`).join('')
            const innerItemTypeInfo = TypeInfo.fromRawType(`${itemType}${innerItemArrayPart}`);
            const innerItemVar = new Variable(varName('size'), innerItemTypeInfo.tsType).with({ decl: 'const' })
            compiler
                .embed(new ParseResult(sizeVar, sizeTypeInfo))
                .newLine()
                .embed(this.result.with({ value: '[]' }))
                .build(new ForRange(sizeVar.name), () => {
                    compiler
                        .embed(new ParseResult(innerItemVar, innerItemTypeInfo))
                        .newLine()
                        .writeLine(`${this.result.name}.push(${innerItemVar.name})`)
                })
        }
    }
}