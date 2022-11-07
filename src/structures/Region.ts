import { CompilerCallback, ITextCompiler } from '../compilers/ITextCompiler.ts'
import { IStructure } from './IStructure.ts'

export class Region implements IStructure {
    constructor(public name: string) {}

    build(compiler: ITextCompiler, ...callbacks: CompilerCallback[]): ITextCompiler {
        return compiler
            .newLine()
            .writeLine('//#region ', this.name)
            .newLine()
            .withIndent(0, ...callbacks)
            .writeLine('//#endregion')
    }
}
