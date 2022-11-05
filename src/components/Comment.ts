import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Configurable } from '../Configurable.ts'
import { IComponent } from './IComponent.ts'
import { stringToLines } from './utils.ts'

interface MultiLineCommentOptions {
    beginning: string
    middle: string | null
    end: string | null
    lineTargetLength: number
    alignment: number | null
}

interface _MarkerOptions {
    line: number
    total: number
}

// not exported...
class _Marker extends Configurable<_MarkerOptions> implements IComponent {
    constructor(public beginning: string, public middle: string | null, public end: string | null) {
        super({ line: 0, total: 0 })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        const marker =
            this.options.line === 0
                ? this.beginning
                : 0 < this.options.line && this.options.line < this.options.total - 1
                ? this.middle ?? this.beginning
                : this.options.line === this.options.total - 1
                ? this.end ?? this.beginning
                : this.beginning
        return compiler.write(marker)
    }
}

export class MultiLineComment extends Configurable<MultiLineCommentOptions> implements IComponent {
    constructor(public content: string) {
        super({
            beginning: '/*',
            middle: ' *',
            end: '*/',
            lineTargetLength: 100,
            alignment: null,
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        const { beginning, middle, end } = this.options
        const lines = [...stringToLines(this.content, this.options.lineTargetLength)]
        const marker = new _Marker(beginning, middle, end).with({ total: lines.length })
        for (let i = 0; i < lines.length; ++i) {
            compiler
                .alignIf(this.options.alignment)
                .embed(marker.with({ line: i }))
                .writeLine(' ', lines[i])
        }
        return compiler
    }
}
