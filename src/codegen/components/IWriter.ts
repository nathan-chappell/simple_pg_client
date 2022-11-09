import { ITextCompiler } from '../compilers/ITextCompiler.ts'

export interface IWriter {
    write(compiler: ITextCompiler): ITextCompiler
}
