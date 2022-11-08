import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { StructureWithBody } from './StructureWithBody.ts'

export class Region extends StructureWithBody {
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
