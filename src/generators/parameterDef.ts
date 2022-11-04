import { GenWriterBase } from './genWriterBase.ts'
import { ParamWriteOptions } from './options.ts'

export class ParameterDef {
    name: string
    type: string
    default_: string | null

    constructor(name: string, type: string, default_: string | null = null) {
        this.name = name
        this.type = type
        this.default_ = default_
    }

    write(writer: GenWriterBase, options: ParamWriteOptions): GenWriterBase {
        writer.write(`${this.name}`)
        if (options.withType) writer.write(`: ${this.type}`)
        if (options.withDefault && this.default_ !== null) {
            writer.write(` = ${this.default_}`)
        }
        return writer
    }
}
