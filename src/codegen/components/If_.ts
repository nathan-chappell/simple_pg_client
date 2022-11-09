import { CompilerCallback, ITextCompiler, Writable } from '../compilers/ITextCompiler.ts'
import { IComponent } from '../components/IComponent.ts'
import { Variable } from '../components/Variable.ts'
import { Configurable } from '../Configurable.ts'
import { Block } from './Block.ts'

export interface ConditionalClause {
    condition: Variable
    body: Writable
}

export interface IfOptions {
    body: Writable | null
    elseIf_: ConditionalClause[] | null
    else_: Writable | null
}

export class If_ extends Configurable<IfOptions> implements IStructure, IComponent {
    constructor(public condition: Variable) {
        super({
            body: null,
            elseIf_: null,
            else_: null,
        })
    }

    static fromClause(clause: ConditionalClause): If_ {
        return new If_(clause.condition).with({ body: clause.body })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        if (this.options.body === null) throw new Error(`Can't write if statement without a body`)
        compiler.write('if (', this.condition.name, ') ').build(new Block(), this.options.body)
        for (const clause of this.options.elseIf_ ?? []) {
            compiler.writeLine(' else if (', clause.condition.name, ') ').build(new Block(), clause.body)
        }
        if (this.options.else_ !== null) {
            compiler.writeLine(' else ').build(new Block(), this.options.else_)
        }
        return compiler
    }

    build(compiler: ITextCompiler, ...callbacks: CompilerCallback[]): ITextCompiler {
        if (callbacks.length > 2)
            throw new Error(`At most 2 callbacks may be supplied to If_.build (if-body and else-if body)`)
        return compiler.embed(
            this.with({
                body: callbacks[0],
                else_: callbacks[1] ?? null,
            })
        )
    }
}
