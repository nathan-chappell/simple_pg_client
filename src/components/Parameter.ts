import { IComponent } from './IComponent.ts'
import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Configurable } from '../Configurable.ts'

export interface ParameterOptions {
    withType?: boolean
    withDefault?: boolean
}

export class Parameter extends Configurable<ParameterOptions> implements IComponent {
    constructor(public name: string, public type: string, public default_: string | null = null) {
        super({
            withDefault: false,
            withType: false,
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        return compiler
            .write(`${this.name}`)
            .writeIf(this.options.withType, `: ${this.type}`)
            .writeIf(this.options.withDefault && this.default_ !== null, ` = ${this.default_}`)
    }
}
