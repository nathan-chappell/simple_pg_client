import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { IWriter } from '../components/IWriter.ts'
import { isCompilerCallback, isICompiler, isIComponent, TComponent } from './TComponent.ts'
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

    _newLineIfNotEmpty(): TextCompiler {
        return this._lastLine.line === '' ? this : this.newLine()
    }

    indent(n = 1): TextCompiler {
        this._indent += n
        this._newLineIfNotEmpty()
        this._lastLine.indent = this._indent
        return this
    }

    dedent(n = 1): TextCompiler {
        if (this._indent - n < 0) {
            throw new Error('Tried to dedent past 0')
        }
        this._indent -= n
        this._newLineIfNotEmpty()
        this._lastLine.indent = this._indent
        return this
    }

    withIndent(n: number, component: IWriter): TextCompiler {
        return this.indent(n).write(component).dedent(n)
    }

    newLine(n = 1): TextCompiler {
        for (let i = 0; i < n; i++) this._lines.push(new Line('', this._indent))
        return this
    }

    _append(text: string) {
        this._lastLine.line += text
    }

    write(...components: TComponent[]): TextCompiler {
        for (const component of components) {
            if (typeof component === 'string') {
                this._append(component)
            } else if (isIComponent(component)) {
                component.write(this)
            } else if (isCompilerCallback(component)) {
                component(this)
            } else if (isICompiler(component)) {
                this.write(component.compile())
            }
        }
        return this
    }

    writeIf(condition: boolean | undefined, ...components: TComponent[]): TextCompiler {
        if (condition) this.write(...components)
        return this
    }

    writeLine(...components: TComponent[]): TextCompiler {
        return this.write(...components).newLine()
    }

    writeLines(...components: TComponent[]): TextCompiler {
        for (const component of components) this.writeLine(component)
        return this
    }

    writeLineIf(condition: boolean, ...components: TComponent[]): TextCompiler {
        if (condition) this.writeLine(...components)
        return this
    }

    compile(): string {
        return this._lines.map(lineSpec => lineSpec.compile()).join('\n')
    }
}
