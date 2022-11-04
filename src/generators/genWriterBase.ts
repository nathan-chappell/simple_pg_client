interface LineSpec {
    line: string
    indent: number
}

type Column = number

export class GenWriterBase {
    _lines: LineSpec[] = []
    _indent = 0

    get column() {
        return this._lines.length === 0 ? 0 : this._lines[this._lines.length - 1].line.length
    }

    get line() {
        return this._lines.length
    }

    get _lastLineSpec(): LineSpec | null {
        return this._lines.length === 0 ? null : this._lines[this._lines.length - 1]
    }

    _setLastIndent() {
        if (this._lastLineSpec)
            this._lastLineSpec.indent = this._indent;
    }

    indent(n = 1) {
        this._indent += n
        this._setLastIndent();
    }

    dedent(n = 1) {
        if (this._indent - n < 0) {
            throw new Error('Tried to dedent past 0')
        }
        this._indent -= n
        this._setLastIndent();
    }

    withIndent(n: number, cb: () => void) {
        this.indent(n)
        cb()
        this.dedent(n)
    }

    withBlock(cb: () => void) {
        this.writeLine('{')
        this.withIndent(1, cb);
        this.writeLine('}')
    }

    newLine() {
        this._lines.push({ line: '', indent: this._indent })
    }

    write(...content: string[]) {
        if (this._lines.length === 0) this.newLine()
        this._lines[this._lines.length - 1].line += content.join('')
    }

    writeLine(...content: string[]) {
        this.write(...content)
        this.newLine()
    }

    compile(): string {
        return this._lines.map(lineSpec => this._compileLineSpec(lineSpec)).join('\n')
    }

    _getLineSpec(line: string): LineSpec {
        return { line, indent: this._indent }
    }

    _compileLineSpec(lineSpec: LineSpec) {
        return ' '.repeat(lineSpec.indent * 4) + lineSpec.line
    }
}
