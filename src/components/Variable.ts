import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Configurable } from '../Configurable.ts'
import { IComponent } from './IComponent.ts'

export interface VariableOptions {
    const_: boolean
    initializer_: string | null
    // TODO: check if alignment still needed
    initAlignment: number | null
    typeAlignment: number | null
}

export class Variable extends Configurable<VariableOptions> implements IComponent {
    constructor(public name: string, public type: string) {
        super({
            const_: false,
            initializer_: null,
            initAlignment: null,
            typeAlignment: null,
        })
    }

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
