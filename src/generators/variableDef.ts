import { GenWriterBase } from './genWriterBase.ts'
import { IComponentWriter } from './IComponentWriter.ts'
import { VariableOptions } from './options.ts'

export class VariableDef implements IComponentWriter {
    constructor(public name: string, public type: string, public options: VariableOptions = {}) {}

    write(writer: GenWriterBase): GenWriterBase {
        return writer
            .write(this.options.const_ ? 'const ' : 'let ', this.name, ': ')
            .alignIf(this.options.typeAlignment)
            .write(this.type)
            .alignIf(this.options.initAlignment && !!this.options.initializer_)
            .writeIf(!!this.options.initializer_, ' = ', this.options.initializer_!)
    }

    writeAssignment(writer: GenWriterBase, other: string) {
        if (this.options.const_) throw new Error(`Can't assign to const variable: ${this.name}: ${this.type}`)
        return writer.write(this.name, ' = ', other)
    }
}
