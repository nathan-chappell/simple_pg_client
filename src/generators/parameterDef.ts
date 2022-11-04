import { GenWriterBase } from './genWriterBase.ts'
import { ParamWriteOptions } from './options.ts'

export class ParameterDef {
    constructor(
        public name: string,
        public type: string,
        public default_: string | null = null
    ) {}

    write(writer: GenWriterBase, options: ParamWriteOptions): GenWriterBase {
        writer.write(`${this.name}`)
        if (options.withType) writer.write(`: ${this.type}`)
        if (options.withDefault && this.default_ !== null) {
            writer.write(` = ${this.default_}`)
        }
        return writer
    }
}
