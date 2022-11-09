import { ITextCompiler } from '../../compilers/ITextCompiler.ts'
import { IWriter } from '../../components/IWriter.ts'
import { ForRange } from '../../components/ForRange.ts'
import { Variable } from '../../components/Variable.ts'
import { varName } from '../../utils.ts'
import { TypeInfo } from './TypeInfo.ts'
import { EmptyLine } from '../../components/EmptyLine.ts'

export class ParseResult implements IWriter {
    constructor(public result: Variable, public typeInfo: TypeInfo) {}

    with(_options: Partial<Record<never, never>>): this {
        throw new Error('Method not implemented.')
    }

    write(compiler: ITextCompiler): ITextCompiler {
        const { itemType, sizeTypes } = this.typeInfo.options
        if (!this.typeInfo.isArray) {
            return compiler.write(this.result.with({ value: `await parse${itemType}(adapter)` }))
        } else {
            const sizeTypeInfo = this.typeInfo.sizeTypeInfo
            const sizeVar = new Variable(varName('size'), sizeTypeInfo.tsType).with({ decl: 'const' })
            // prettier-ignore
            const innerItemTypeInfo = this.typeInfo.innerArrayTypeInfo
            const innerItemVar = new Variable(varName('result'), innerItemTypeInfo.tsType).with({
                decl: 'const',
            })
            return compiler.writeLines(
                new EmptyLine(0),
                new ParseResult(sizeVar, sizeTypeInfo),
                this.result.with({ value: '[]' }),
                new ForRange(sizeVar.name, _compiler =>
                    _compiler.writeLines(
                        new ParseResult(innerItemVar, innerItemTypeInfo),
                        `${this.result.name}.push(${innerItemVar.name})`,
                    ),
                ),
            )
        }
    }
}
