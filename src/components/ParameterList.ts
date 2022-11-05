import { IComponent } from './IComponent.ts'
import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Configurable } from '../Configurable.ts'
import { Parameter, ParameterOptions } from './Parameter.ts'

export interface ParameterListOptions {
    multiline: boolean
    parameterOptions: ParameterOptions
}

export class ParameterList extends Configurable<ParameterListOptions> implements IComponent {
    constructor(public parameters: Parameter[]) {
        super({
            multiline: false,
            parameterOptions: {
                withDefault: false,
                withType: false,
            },
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        const body = () => {
            compiler.write('(')
            for (let i = 0; i < this.parameters.length; ++i) {
                compiler
                    .embed(this.parameters[i].with(this.options.parameterOptions))
                    .writeIf(!this.options.multiline && i < this.parameters.length - 1, ', ')
                    .writeLineIf(this.options.multiline, ',')
            }
            return compiler.write(')')
        }
        return this.options.multiline ? compiler.newLine().withIndent(1, body) : body()
    }
}
