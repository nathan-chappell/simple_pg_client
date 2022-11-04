import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { varName } from './utils.ts'
import { Variable } from './Variable.ts'
import { Block } from '../structures/Block.ts'

export class ForRange {
    constructor(public max: string | number, public body: (loopVar: string) => void) {}

    write(compiler: ITextCompiler): ITextCompiler {
        const loopVar = new Variable(varName(), 'number', { initializer_: '0' })
        compiler.write('for (')
        return loopVar
            .write(compiler)
            .write('; ')
            .write(loopVar.name, ' < ', `${this.max}; `)
            .write('++', loopVar.name, ') ')
            .build(new Block(), () => this.body(loopVar.name))
    }
}
