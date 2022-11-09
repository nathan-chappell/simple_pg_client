import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { WithBody } from './WithBody.ts'

export class Block extends WithBody {
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
