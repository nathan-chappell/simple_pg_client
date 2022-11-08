import { ITextCompiler, CompilerCallback } from '../compilers/ITextCompiler.ts'
import { IComponent } from '../components/IComponent.ts'
import { MultiCallback } from '../components/MultiCallback.ts'
import { Configurable } from '../Configurable.ts'
import { IStructure } from './IStructure.ts'

export interface OptionsWithBody {
    body: IComponent | null
}

export class StructureWithBody<TOptions extends OptionsWithBody = OptionsWithBody>
    extends Configurable<TOptions>
    implements IStructure, IComponent
{
    constructor(options: TOptions) {
        super(options)
    }

    write(_compiler: ITextCompiler): ITextCompiler {
        throw new Error('Method not implemented.')
    }

    _checkBody() {
        if (this.options.body === null) throw new Error('Body is null')
    }

    build(compiler: ITextCompiler, ...callbacks: CompilerCallback[]): ITextCompiler {
        return compiler.embed(
            // including ...this.options is to unconfuse tsc
            this.with({ ...this.options, body: new MultiCallback(...callbacks) } as TOptions),
        )
    }
}
