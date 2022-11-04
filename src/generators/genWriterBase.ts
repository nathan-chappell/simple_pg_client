import { ICompiler } from "./ICompiler.ts";
import { IComponentWriter } from "./IComponentWriter";
import { IGenWriterBase } from "./IGenWriterBase.ts";
import { LineSpec } from "./lineSpec.ts";

export class GenWriterBase implements IGenWriterBase, ICompiler {
    _lines: LineSpec[] = [new LineSpec()]
    _indent = 0

    get _lastLineSpec(): LineSpec {
        return this._lines[this._lines.length - 1]
    }

    get column() {
        return this._lastLineSpec.compile().length
    }

    get line() {
        return this._lines.length
    }

    align(column: number): GenWriterBase {
        if (this.column > column) {
            console.warn(`can't align to ${column}: ${JSON.stringify(this._lastLineSpec)}`)
        } else {
            this._lastLineSpec.line = this._lastLineSpec.compile()
            this._lastLineSpec.aligned = true
            this.write(' '.repeat(column - this.column))
        }
        return this
    }

    alignIf(column: unknown): GenWriterBase {
        return typeof column === 'number' ? this.align(column) : this
    }

    indent(n = 1): GenWriterBase {
        this._indent += n
        this._lastLineSpec.indent = this._indent
        return this
    }

    dedent(n = 1): GenWriterBase {
        if (this._indent - n < 0) {
            throw new Error('Tried to dedent past 0')
        }
        this._indent -= n
        this._lastLineSpec.indent = this._indent
        return this
    }

    withIndent(n: number, cb: () => void): GenWriterBase {
        this.indent(n)
        cb()
        this.dedent(n)
        return this
    }

    withBlock(cb: () => void): GenWriterBase {
        this.writeLine('{')
        this.withIndent(1, cb)
        this.write('}')
        return this
    }

    newLine(n = 1): GenWriterBase {
        for (let i = 0; i < n; i++)
            this._lines.push(new LineSpec('', this._indent))
        return this
    }

    write(...content: string[]): GenWriterBase {
        this._lastLineSpec.line += content.join('')
        return this
    }

    writeLine(...content: string[]): GenWriterBase {
        this.write(...content)
        this.newLine()
        return this
    }

    writeIf(condition: boolean | undefined, ...content: string[]): GenWriterBase {
        if (condition) this.write(...content)
        return this
    }

    writeLineIf(condition: boolean, ...content: string[]): GenWriterBase {
        if (condition) this.writeLine(...content)
        return this
    }

    callWriter(writer: IComponentWriter): IGenWriterBase {
        return writer.write(this)
    }

    compile(): string {
        return this._lines.map(lineSpec => lineSpec.compile()).join('\n')
    }
}
