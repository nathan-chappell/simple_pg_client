import { IComponent } from './IComponent.ts'
import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { DeclOptions } from './options.ts'

export class TypeDef implements IComponent {
    constructor(public name: string, public def: string, public options: DeclOptions = {}) {}

    write(compiler: ITextCompiler): ITextCompiler {
        return compiler
            .writeIf(this.options.export_, 'export ')
            .writeLine('type ', this.name, ' = ', this.def)
    }
}
