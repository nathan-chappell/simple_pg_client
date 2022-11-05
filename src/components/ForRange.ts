import { CompilerCallback, ITextCompiler } from '../compilers/ITextCompiler.ts'
import { varName } from './utils.ts'
import { Variable } from './Variable.ts'
import { Block } from '../structures/Block.ts'
import { IComponent } from './IComponent.ts'
import { IStructure } from '../structures/IStructure.ts'
import { Configurable } from '../Configurable.ts'

export class ForRange extends Configurable implements IComponent, IStructure {
    constructor(public max: string | number) {
        super({})
    }

    build(compiler: ITextCompiler, ...callbacks: CompilerCallback[]): ITextCompiler {
        return compiler.embed(this).build(new Block(), ...callbacks)
    }

    write(compiler: ITextCompiler): ITextCompiler {
        const loopVar = new Variable(varName(), 'number').with({ initializer_: '0' })
        return compiler
            .write('for (')
            .embed(loopVar)
            .write('; ')
            .write(loopVar.name, ' < ', `${this.max}; `)
            .write('++', loopVar.name, ') ')
    }
}
