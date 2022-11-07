import { CompilerCallback, ITextCompiler } from '../compilers/ITextCompiler.ts'
import { IStructure } from './IStructure.ts'

export class Block implements IStructure {
    constructor() {}

    build(compiler: ITextCompiler, ...callbacks: CompilerCallback[]): ITextCompiler {
        return compiler
            .writeLine('{')
            .withIndent(1, ...callbacks)
            .write('}')
    }
}
