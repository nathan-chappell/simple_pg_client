import { CompilerCallback, ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Block } from './Block.ts'
import { ParameterList } from './ParameterList.ts'
import { ParameterOptions } from './Parameter.ts'
import { MultiCallback } from './MultiCallback.ts'
import { WithBodyOptions, WithBody } from './WithBody.ts'

export interface FunctionOptions extends WithBodyOptions {
    arrow_: boolean
    async_: boolean
    const_: boolean
    export_: boolean
    expressionBody_: boolean
}

export class Function_ extends WithBody<FunctionOptions>
{
    constructor(
        public name: string,
        public parameterList: ParameterList,
        public returnType: string | null = null,
    ) {
        super({
            arrow_: false,
            async_: false,
            const_: false,
            export_: false,
            expressionBody_: false,
            body: null,
        })
    }

    _params(parameterOptions: ParameterOptions) {
        return this.parameterList.with({ parameterOptions })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        if (this.options.body !== null)
            return this.with({ body: null }).build(compiler, () => this.options.body!(compiler))
        if (this.options.export_) compiler.write('export ')
        if (this.options.arrow_) {
            compiler.writeIf(this.options.const_, 'const ').write(this.name)
            if (this.returnType !== null) {
                compiler
                    .write(': ')
                    .embed(this._params({ withType: true, withDefault: false, hyphenPrefix: false }))
                    .write(' => ', this.returnType)
            }
        } else {
            compiler
                .writeIf(!!this.options.async_, 'async ')
                .write('function ', this.name)
                .embed(this._params({ withType: true, withDefault: true, hyphenPrefix: false }))
                .writeIf(this.returnType !== null, ': ', this.returnType!)
        }
        return compiler
    }

    build(compiler: ITextCompiler, ...callbacks: CompilerCallback[]): ITextCompiler {
        console.debug(`building ${this.name}`)
        const body = new MultiCallback(...callbacks)
        compiler.embed(this).write(' ')
        if (this.options.arrow_) {
            compiler
                .write('= ')
                .writeIf(!!this.options.async_, 'async ')
                .embed(this._params({ withType: false, withDefault: true, hyphenPrefix: false }))
                .write(' => ')
            if (this.options.expressionBody_) return compiler.embed(body)
        }
        return compiler.build(new Block().with({ body }))
    }
}
