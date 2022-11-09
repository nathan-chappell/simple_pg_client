import { CompilerCallback, isCompilerCallback, isICompiler, isIComponent, ITextCompiler, Writable } from '../compilers/ITextCompiler.ts'
import { IComponent } from '../components/IComponent.ts'
import { Line } from './Line.ts'

export class TextCompiler implements ITextCompiler {
    _lines: Line[] = [new Line()]
    _indent = 0

    get _lastLine(): Line {
        return this._lines[this._lines.length - 1]
    }

    get column() {
        return this._lastLine.compile().length
    }

    get line() {
        return this._lines.length
    }

    align(column: number): TextCompiler {
        if (this.column > column) {
            console.warn(`can't align to ${column}(${this.column}): ${JSON.stringify(this._lastLine)}`)
        } else {
            this._lastLine.line = this._lastLine.compile()
            this._lastLine.aligned = true
            this.write(' '.repeat(column - this.column))
        }
        return this
    }

    alignIf(column: unknown): TextCompiler {
        return typeof column === 'number' ? this.align(column) : this
    }

    indent(n = 1): TextCompiler {
        this._indent += n
        this._lastLine.indent = this._indent
        return this
    }

    dedent(n = 1): TextCompiler {
        if (this._indent - n < 0) {
            throw new Error('Tried to dedent past 0')
        }
        this._indent -= n
        this._lastLine.indent = this._indent
        return this
    }

    withIndent(n: number, component: IComponent): TextCompiler {
        return this.indent(n).embed(component).dedent(n)
    }

    newLine(n = 1): TextCompiler {
        for (let i = 0; i < n; i++) this._lines.push(new Line('', this._indent))
        return this
    }

    _append(text: string) {
        this._lastLine.line += text
    }

    write(...content: Writable[]): TextCompiler {
        for (const item of content) {
            if (typeof item === 'string') {
                this._append(item)
            } else if (isIComponent(item)) {
                item.write(this)
            } else if (isCompilerCallback(item)) {
                item(this)
            } else if (isICompiler(item)) {
                this.write(item.compile())
            }
        }
        return this
    }

    writeIf(condition: boolean | undefined, ...content: Writable[]): TextCompiler {
        if (condition) this.write(...content)
        return this
    }

    writeLine(...content: Writable[]): TextCompiler {
        this.write(...content)
        this.newLine()
        return this
    }

    writeLineIf(condition: boolean, ...content: Writable[]): TextCompiler {
        if (condition) this.writeLine(...content)
        return this
    }

    compile(): string {
        return this._lines.map(lineSpec => lineSpec.compile()).join('\n')
    }
}
