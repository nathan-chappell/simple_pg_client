import { ITextCompiler } from '../compilers/ITextCompiler.ts'

export interface IComponent<TOptions = Record<never, never>> {
    write(compiler: ITextCompiler): ITextCompiler
    with(options: Partial<TOptions>): this
}
