import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { TComponent } from '../compilers/TComponent.ts'
import { Configurable } from '../Configurable.ts'
import { IWriter } from './IWriter.ts'

export interface BlockOptions {
    singleLine: boolean
}

export class Block extends Configurable<BlockOptions> implements IWriter {
    constructor(public body: TComponent, public start: string = '{', public end: string = '}') {
        super({
            singleLine: false,
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        if (this.options.singleLine) {
            return compiler.write(this.start, ' ', this.body, ' ', this.end)
        } else {
            return compiler.write(this.start).withIndent(1, this.body).write(this.end)
        }
    }
}