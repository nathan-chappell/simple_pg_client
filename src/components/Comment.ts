import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Configurable } from '../Configurable.ts'
import { IComponent } from './IComponent.ts'
import { stringToLines } from '../utils.ts'

interface CommentOptions {
    lineTargetLength: number
    mark: string
    indent: number
}

export class Comment extends Configurable<CommentOptions> implements IComponent {
    constructor(public remarks: string[]) {
        super({
            lineTargetLength: 80,
            mark: '//',
            indent: 8,
        })
    }

    _getRemarkLines(remark: string) {
        return [...stringToLines(remark, this.options.lineTargetLength, this.options.indent)]
    }

    write(compiler: ITextCompiler): ITextCompiler {
        for (const remark of this.remarks) {
            for (const line of this._getRemarkLines(remark)) compiler.writeLine(this.options.mark, ' ', line)
        }
        return compiler
    }
}
