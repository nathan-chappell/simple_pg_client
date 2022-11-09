import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { TComponent } from '../compilers/TComponent.ts'
import { EmptyLine } from './EmptyLine.ts'
import { IWriter } from './IWriter.ts'

export class Region implements IWriter {
    constructor(public name: string, public body: TComponent) {}

    write(compiler: ITextCompiler): ITextCompiler {
        return compiler.writeLines(
            new EmptyLine(0),
            `//#region ${this.name}`,
            new EmptyLine(0),
            this.body,
            new EmptyLine(0),
            '//#endregion',
        )
    }
}
