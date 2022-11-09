import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Block } from './Block.ts'
import { ParameterList } from './ParameterList.ts'
import { ParameterOptions } from './Parameter.ts'
import { TComponent } from '../compilers/TComponent.ts'
import { Configurable } from '../Configurable.ts'
import { IWriter } from './IWriter.ts'

export interface FunctionOptions {
    arrow_: boolean
    async_: boolean
    const_: boolean
    export_: boolean
    bodyType: null | 'expression' | 'block'
}

export class Function_ extends Configurable<FunctionOptions> implements IWriter {
    constructor(
        public name: string,
        public parameterList: ParameterList,
        public body: TComponent | null,
        public returnType: string | null = null,
    ) {
        super({
            arrow_: false,
            async_: false,
            const_: false,
            export_: false,
            bodyType: null,
        })
    }

    _params(parameterOptions: Partial<ParameterOptions>) {
        return this.parameterList.with({ parameterOptions })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        if (this.options.bodyType !== null && this.body === null)
            throw new Error(
                `No body provided to function.  Use .with({bodyType: null}) to write a declaration.`,
            )

        // declaration
        if (this.options.export_) compiler.write('export ')
        if (this.options.arrow_) {
            compiler.writeIf(this.options.const_, 'const ').write(this.name)
            if (this.returnType !== null) {
                compiler
                    .write(': ', this._params({ withType: true, withDefault: false }))
                    .write(' => ', this.returnType)
            }
        } else {
            compiler
                .writeIf(!!this.options.async_, 'async ')
                .write('function ', this.name, this._params({ withType: true, withDefault: true }))
                .writeIf(this.returnType !== null, ': ', this.returnType!)
        }

        // body
        if (this.options.bodyType !== null) {
            compiler.write(' ')
            if (this.options.arrow_) {
                compiler
                    .write('= ')
                    .writeIf(!!this.options.async_, 'async ')
                    .write(this._params({ withType: false, withDefault: true }))
                    .write(' => ')
            }
            if (this.options.arrow_ && this.options.bodyType === 'expression') compiler.write(this.body!)
            else compiler.write(new Block(this.body!))
        }
        return compiler
    }
}
