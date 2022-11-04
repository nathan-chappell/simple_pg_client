import { IComponentWriter } from './IComponentWriter.ts'
import { IGenWriterBase } from './IGenWriterBase.ts'
import { ParamWriteOptions } from './options.ts'

export class ParameterDef implements IComponentWriter {
    constructor(
        public name: string,
        public type: string,
        public default_: string | null = null,
        public options: ParamWriteOptions = {}
    ) {}

    write(writer: IGenWriterBase): IGenWriterBase {
        return this.writeWithOptions(writer, this.options)
    }

    writeWithOptions(writer: IGenWriterBase, options: ParamWriteOptions): IGenWriterBase {
        writer.write(`${this.name}`)
        if (options.withType) writer.write(`: ${this.type}`)
        if (options.withDefault && this.default_ !== null) {
            writer.write(` = ${this.default_}`)
        }
        return writer
    }
}
