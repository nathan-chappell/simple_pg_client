import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Block } from './Block.ts'
import { varName } from '../utils.ts'
import { Variable } from './Variable.ts'
import { WithBody } from './WithBody.ts'

export class ForRange extends WithBody {
    constructor(public max: string | number) {
        super({
            body: null,
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        // this._checkBody()
        const loopVar = new Variable(varName(), 'number').with({ value: '0' })
        return compiler
            .write('for (', loopVar, '; ', loopVar.name, ' < ', `${this.max}; `, '++', loopVar.name, ') ')
            .writeIf(this.options.body !== null, new Block().with({ body: this.options.body! }))
    }
}
