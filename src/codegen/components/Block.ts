import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { TComponent } from '../compilers/TComponent.ts'
import { Configurable } from '../Configurable.ts'
import { IWriter } from './IWriter.ts'

export interface BlockOptions {
    singleLine: boolean
}

export class Block extends Configurable<BlockOptions> implements IWriter {
    constructor(public body: TComponent) {
        super({
            singleLine: false,
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        if (this.options.singleLine) {
            return compiler.write('{ ', this.body, ' }')
        } else {
            return compiler.write('{').withIndent(1, this.body).write('}')
        }
    }
}
