import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { IComponent } from './IComponent.ts'
import { VariableOptions } from './options.ts'

export class Variable implements IComponent {
    constructor(public name: string, public type: string, public options: VariableOptions = {}) {}

    write(compiler: ITextCompiler): ITextCompiler {
        return compiler
            .write(this.options.const_ ? 'const ' : 'let ', this.name, ': ')
            .alignIf(this.options.typeAlignment)
            .write(this.type)
            .alignIf(this.options.initAlignment && !!this.options.initializer_)
            .writeIf(!!this.options.initializer_, ' = ', this.options.initializer_!)
    }

    writeAssignment(compiler: ITextCompiler, other: string) {
        if (this.options.const_)
            throw new Error(`Can't assign to const variable: ${this.name}: ${this.type}`)
        return compiler.write(this.name, ' = ', other)
    }
}
