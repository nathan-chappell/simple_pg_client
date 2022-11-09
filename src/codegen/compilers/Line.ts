import { ICompiler } from './ICompiler.ts'

export class Line implements ICompiler {
    line: string
    indent: number
    aligned: boolean
    _spacesPerIndent = 4

    constructor(line: string = '', indent = 0, aligned = false) {
        this.line = line
        this.indent = indent
        this.aligned = aligned
    }

    indent_(s: string) {
        return ' '.repeat(this._spacesPerIndent * this.indent) + s
        // return `/* ${this.indent} */` + ' '.repeat(this._spacesPerIndent * this.indent) + s
    }

    compile(): string {
        return this.aligned ? this.line : this.indent_(this.line)
    }
}
