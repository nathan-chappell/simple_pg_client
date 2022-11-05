import { CompilerCallback, ITextCompiler } from '../compilers/ITextCompiler.ts'
import { IComponent } from './IComponent.ts'
import { IStructure } from '../structures/IStructure.ts'
import { Block } from '../structures/Block.ts'
import { Configurable } from '../Configurable.ts'
import { ParameterList } from './ParameterList.ts'
import { ParameterOptions } from './Parameter.ts'

export interface FunctionOptions {
    arrow_?: boolean
    async_?: boolean
    const_?: boolean
    export_?: boolean
    expressionBody_?: boolean
}

export class Function_
    extends Configurable<FunctionOptions>
    implements IComponent<FunctionOptions>, IStructure
{
    constructor(
        public name: string,
        public parameterList: ParameterList,
        public returnType: string | null = null
    ) {
        super({
            arrow_: false,
            async_: false,
            const_: false,
            export_: false,
            expressionBody_: false,
        })
    }

    _params(parameterOptions: ParameterOptions) {
        return this.parameterList.with({ parameterOptions })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        if (this.options.export_) compiler.write('export ')
        if (this.options.arrow_) {
            compiler.writeIf(this.options.const_, 'const ').write(this.name)
            if (this.returnType !== null) {
                compiler
                    .write(': ')
                    .embed(this._params({ withType: true, withDefault: false }))
                    .write(' => ', this.returnType)
            }
        } else {
            compiler
                .writeIf(!!this.options.async_, 'async ')
                .write('function ', this.name)
                .embed(this._params({ withType: true, withDefault: true }))
                .writeIf(this.returnType !== null, ': ', this.returnType!)
        }
        return compiler
    }

    build(compiler: ITextCompiler, ...callbacks: CompilerCallback[]): ITextCompiler {
        this.write(compiler)
        compiler.embed(this).write(' ')
        if (this.options.arrow_) {
            compiler
                .write('= ')
                .writeIf(!!this.options.async_, 'async ')
                .write('(')
                .embed(this._params({ withType: false, withDefault: true }))
                .write(') => ')
        }
        return compiler.build(new Block(), ...callbacks)
    }
}
