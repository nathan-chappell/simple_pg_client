import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Configurable } from '../Configurable.ts'
import { IWriter } from './IWriter.ts'

export interface FragmentOptions {
    newLine: boolean
}

export class Fragment extends Configurable<FragmentOptions> implements IWriter {
    constructor(public text: string) {
        super({
            newLine: false,
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        return this.options.newLine ? compiler.writeLine(this.text) : compiler.write(this.text)
    }
}
