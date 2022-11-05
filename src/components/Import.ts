import { IComponent } from './IComponent.ts'
import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Block } from '../structures/Block.ts'
import { Configurable } from '../Configurable.ts'

export class Import extends Configurable<Record<never, never>> implements IComponent {
    constructor(public names: string[], public from: string) {
        super({})
    }

    write(compiler: ITextCompiler): ITextCompiler {
        compiler.write('import ')
        if (this.names.length == 1) {
            compiler.write('{ ', this.names[0], ' }')
        } else {
            compiler.build(new Block(), () => {
                for (const name of this.names) compiler.writeLine(name, ',')
            })
        }
        return compiler.writeLine(" from '", this.from, "'")
    }
}
