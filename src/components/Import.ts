import { IComponent } from './IComponent.ts'
import { ITextCompiler } from '../compilers/ITextCompiler.ts'

export class Import_ implements IComponent {
    constructor(public names: string[], public from: string) {}

    write(compiler: ITextCompiler): ITextCompiler {
        compiler.write('import ')
        if (this.names.length == 1) {
            compiler.write('{ ', this.names[0], ' }')
        } else {
            compiler.withBlock(() => {
                for (const name of this.names) compiler.writeLine(name, ',')
            })
        }
        return compiler.writeLine(" from '", this.from, "'")
    }
}
