import { ITextCompiler } from '../compilers/ITextCompiler.ts'

export interface IComponent<TOptions = {}> {
    write(compiler: ITextCompiler): ITextCompiler
    with(options: Partial<TOptions>): this
}
