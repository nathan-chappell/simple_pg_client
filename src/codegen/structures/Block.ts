import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { StructureWithBody } from './StructureWithBody.ts'

export class Block extends StructureWithBody {
    constructor() {
        super({
            body: null,
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        this._checkBody()
        return compiler.writeLine('{').withIndent(1, this.options.body!).write('}')
    }
}
