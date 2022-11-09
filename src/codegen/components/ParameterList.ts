import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Configurable } from '../Configurable.ts'
import { IWriter } from './IWriter.ts'
import { Parameter, ParameterOptions } from './Parameter.ts'

export interface ParameterListOptions {
    multiline: boolean
    parameterOptions: Partial<ParameterOptions>
}

export class ParameterList extends Configurable<ParameterListOptions> implements IWriter {
    constructor(public parameters: Parameter[]) {
        super({
            multiline: false,
            parameterOptions: {},
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        compiler.write('(')
        const body = () => {
            for (let i = 0; i < this.parameters.length; ++i) {
                compiler.write(this.parameters[i].with(this.options.parameterOptions))
                if (this.options.multiline) {
                    compiler.writeLine(',')
                } else if (i < this.parameters.length - 1) {
                    compiler.write(', ')
                }
            }
            return compiler.write(')')
        }
        return this.options.multiline ? compiler.newLine().withIndent(1, body) : body()
    }
}
