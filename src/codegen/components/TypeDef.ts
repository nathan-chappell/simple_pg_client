import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Configurable } from '../Configurable.ts'
import { IComponent } from './IComponent.ts'

export interface TypeDefOptions {
    export_: boolean
}

export class TypeDef extends Configurable<TypeDefOptions> implements IComponent {
    constructor(public name: string, public def: string) {
        super({
            export_: true,
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        return compiler.writeIf(this.options.export_, 'export ').write('type ', this.name, ' = ', this.def)
    }
}
