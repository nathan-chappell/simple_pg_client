import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Block } from './Block.ts'
import { varName } from '../utils.ts'
import { Variable } from './Variable.ts'
import { TComponent } from '../compilers/TComponent.ts'
import { Configurable } from '../Configurable.ts'
import { IWriter } from './IWriter.ts'

export interface ForRangeOptions {
    inBlock: boolean
}

export class ForRange extends Configurable<ForRangeOptions> implements IWriter {
    constructor(public max: TComponent, public body: TComponent) {
        super({
            inBlock: true,
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        // this._checkBody()
        const loopVar = new Variable(varName(), 'number').with({ value: '0' })
        compiler
            .write('for (', loopVar, '; ')
            .write(loopVar.name, ' < ', `${this.max}; `)
            .write('++', loopVar.name, ') ')
        return this.options.inBlock ? compiler.write(new Block(this.body)) : compiler.withIndent(1, this.body)
    }
}
