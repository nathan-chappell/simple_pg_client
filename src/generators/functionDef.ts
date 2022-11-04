import { GenWriterBase } from './genWriterBase.ts'
import { ParameterDef } from './ParameterDef.ts'
import { DeclOptions, ParamWriteOptions } from './options.ts'

// NOTE: intentionally not IComponentWriter...
//  it's not clear what its write() method would do yet
export class FunctionDef {
    constructor(
        public name: string,
        public parameterList: ParameterDef[],
        public returnType: string | null = null,
        public options: DeclOptions = {}
    ) {}

    writeParams(writer: GenWriterBase, options: ParamWriteOptions): GenWriterBase {
        const isMultiLine = this.parameterList.length > 2
        if (isMultiLine) {
            writer.newLine().withIndent(1, () => {
                for (const parameter of this.parameterList) parameter.write(writer, options).writeLine(',')
            })
        } else {
            for (let i = 0; i < this.parameterList.length; ++i) {
                this.parameterList[i].writeWithOptions(writer, options).writeIf(i < this.parameterList.length - 1, ', ')
            }
        }
        return writer
    }

    writeDeclaration(writer: GenWriterBase): GenWriterBase {
        if (this.options.export_) writer.write('export ')
        if (this.options.arrow_) {
            writer.writeIf(this.options.const_, 'const ').write(this.name)
            if (this.returnType !== null) {
                writer.write(': (')
                this.writeParams(writer, { withType: true, withDefault: false })
                    .write(') => ', this.returnType, ' = ')
                    .writeIf(!!this.options.async_, 'async ')
                    .write('(')
                this.writeParams(writer, { withType: false, withDefault: true })
            } else {
                writer.write(' = ').writeIf(this.options.async_, 'async ').write('(')
                this.writeParams(writer, { withType: true, withDefault: true })
            }
            writer.write(') =>')
        } else {
            writer.writeIf(!!this.options.async_, 'async ').write('function ', this.name, '(')
            this.writeParams(writer, { withType: true, withDefault: true }).write(')')
            if (this.returnType !== null) {
                writer.write(': ', this.returnType)
            }
        }
        return writer.write(' ')
    }
}
