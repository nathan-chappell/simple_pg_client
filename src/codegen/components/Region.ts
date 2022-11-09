import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { WithBody } from './WithBody.ts'

export class Region extends WithBody {
    constructor(public name: string) {
        super({
            body: null,
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        this._checkBody()
        return compiler
            .newLine()
            .writeLine('//#region ', this.name)
            .newLine()
            .embed(this.options.body!)
            .newLine()
            .writeLine('//#endregion')
    }
}
