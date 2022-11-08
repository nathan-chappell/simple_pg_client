import { CompilerCallback, ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Configurable } from '../Configurable.ts'
import { IComponent } from './IComponent.ts'

export interface CompilerCallbackOption {
    newLine: boolean
}

export class MultiCallback extends Configurable<CompilerCallbackOption> implements IComponent {
    callbacks: CompilerCallback[]
    constructor(...callbacks: CompilerCallback[]) {
        super({
            newLine: false,
        })
        this.callbacks = callbacks
    }

    write(compiler: ITextCompiler): ITextCompiler {
        for (const callback of this.callbacks) {
            callback(compiler)
            if (this.options.newLine) compiler.newLine()
        }
        return compiler
    }
}
