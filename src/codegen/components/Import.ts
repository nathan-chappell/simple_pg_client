import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Configurable } from '../Configurable.ts'
import { Block } from './Block.ts'
import { IWriter } from './IWriter.ts'

export interface ImportOptions {
    singleLine: boolean
}

export class Import extends Configurable<ImportOptions> implements IWriter {
    constructor(public names: string[], public from: string) {
        super({
            singleLine: false,
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        compiler.write('import ')
        const body = (_compiler: ITextCompiler) =>
            this.options.singleLine
                ? _compiler.write(...this.names.join(','))
                : _compiler.writeLines(...this.names.map(n => `${n},`))
        return compiler
            .write(new Block(body).with({ singleLine: this.options.singleLine }))
            .writeLine(" from '", this.from, "'")
    }
}
