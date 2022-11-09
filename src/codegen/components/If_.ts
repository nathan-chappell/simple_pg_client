import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { TComponent } from '../compilers/TComponent.ts'
import { IWriter } from '../components/IWriter.ts'
import { Variable } from '../components/Variable.ts'
import { Configurable } from '../Configurable.ts'
import { Block } from './Block.ts'

export interface ConditionalClause<TCondition extends TComponent = TComponent> {
    condition: TCondition
    body: TComponent
}

export interface IfOptions {
    elseIf_: ConditionalClause[] | null
    else_: TComponent | null
}

export class If_ extends Configurable<IfOptions> implements IWriter {
    constructor(public condition: TComponent, public body: TComponent) {
        super({
            elseIf_: null,
            else_: null,
        })
    }

    static fromClause(clause: ConditionalClause): If_ {
        return new If_(clause.condition, clause.body)
    }

    write(compiler: ITextCompiler): ITextCompiler {
        compiler.write('if (', this.condition, ') ', new Block(this.body))
        for (const clause of this.options.elseIf_ ?? []) {
            compiler.writeLine(' else if (', clause.condition, ') ', new Block(clause.body))
        }
        if (this.options.else_ !== null) {
            compiler.writeLine(' else ', new Block(this.options.else_))
        }
        return compiler
    }
}
