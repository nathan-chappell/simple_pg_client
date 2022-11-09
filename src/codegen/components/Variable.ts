import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Configurable } from '../Configurable.ts'
import { IWriter } from './IWriter.ts'
import { Parameter } from './Parameter.ts'

export interface VariableOptions {
    decl: null | 'let' | 'const'
    value: string | null
    // TODO: check if alignment still needed
    assignmentAlignment: number | null
    typeAlignment: number | null
}

export class Variable extends Configurable<VariableOptions> implements IWriter {
    constructor(public name: string, public type: string) {
        super({
            decl: 'let',
            value: null,
            assignmentAlignment: null,
            typeAlignment: null,
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        if (this.options.decl === null) {
            return compiler
                .write(this.name)
                .alignIf(this.options.assignmentAlignment)
                .writeIf(!!this.options.value, ' = ', this.options.value!)
        } else {
            return compiler
                .write(this.options.decl, ' ', this.name, ': ')
                .alignIf(this.options.typeAlignment)
                .write(this.type)
                .alignIf(this.options.assignmentAlignment)
                .writeIf(this.options.value !== null, ' = ', this.options.value!)
        }
    }

    get asParameter(): Parameter {
        return new Parameter(this.name, this.type, this.options.value)
    }
}
