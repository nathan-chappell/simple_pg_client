import { IComponent } from './IComponent.ts'
import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { ParamWriteOptions } from './options.ts'

export class Parameter implements IComponent {
    constructor(
        public name: string,
        public type: string,
        public default_: string | null = null,
        public options: ParamWriteOptions = {}
    ) {}

    write(compiler: ITextCompiler): ITextCompiler {
        return this.writeWithOptions(compiler, this.options)
    }

    writeWithOptions(compiler: ITextCompiler, options: ParamWriteOptions): ITextCompiler {
        compiler.write(`${this.name}`)
        if (options.withType) compiler.write(`: ${this.type}`)
        if (options.withDefault && this.default_ !== null) {
            compiler.write(` = ${this.default_}`)
        }
        return compiler
    }
}
