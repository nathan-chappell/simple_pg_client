import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Configurable } from '../Configurable.ts'
import { IWriter } from './IWriter.ts'

export interface ParameterOptions {
    withType: boolean
    withDefault: boolean
    hyphenPrefix: boolean
}

export class Parameter extends Configurable<ParameterOptions> implements IWriter {
    constructor(public name: string, public type: string, public default_: string | null = null) {
        super({
            withDefault: false,
            withType: false,
            hyphenPrefix: false,
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        return compiler
            .writeIf(this.options.hyphenPrefix, '_')
            .write(`${this.name}`)
            .writeIf(this.options.withType, `: ${this.type}`)
            .writeIf(this.options.withDefault && this.default_ !== null, ` = ${this.default_}`)
    }
}
