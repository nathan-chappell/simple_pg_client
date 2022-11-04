import { GenWriterBase } from './genWriterBase.ts'
import { ParameterDef } from './ParameterDef.ts'
import { DeclOptions, ParamWriteOptions } from './options.ts'

export class FunctionDef {
    name: string
    parameterList: ParameterDef[] = []
    returnType: string | null = null
    options: DeclOptions = {}

    constructor(
        name: string,
        parameterList: ParameterDef[] | null = null,
        returnType: string | null = null,
        options: DeclOptions = {}
    ) {
        this.name = name
        this.parameterList = parameterList ?? []
        this.returnType = returnType
        this.options = options
    }

    writeParams(writer: GenWriterBase, options: ParamWriteOptions): GenWriterBase {
        const isMultiLine = this.parameterList.length > 2
        if (isMultiLine) {
            writer.newLine().withIndent(1, () => {
                for (const parameter of this.parameterList) parameter.write(writer, options).writeLine(',')
            })
        } else {
            for (let i = 0; i < this.parameterList.length; ++i) {
                this.parameterList[i].write(writer, options).writeIf(i < this.parameterList.length - 1, ', ')
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
