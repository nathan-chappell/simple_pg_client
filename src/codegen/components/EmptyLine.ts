import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { IWriter } from './IWriter.ts'

export class EmptyLine implements IWriter {
    constructor(public count: number = 1) {}

    write(compiler: ITextCompiler): ITextCompiler {
        return compiler.newLine(this.count)
    }
}
