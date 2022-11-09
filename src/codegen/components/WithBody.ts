import { ITextCompiler, Writable } from '../compilers/ITextCompiler.ts'
import { IComponent } from '../components/IComponent.ts'
import { Configurable } from '../Configurable.ts'

export interface WithBodyOptions {
    body: Writable | null
}

export class WithBody<TOptions extends WithBodyOptions = WithBodyOptions>
    extends Configurable<TOptions>
    implements IComponent
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
}
