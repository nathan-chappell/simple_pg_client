import { CompilerCallback, ITextCompiler } from '../compilers/ITextCompiler.ts'
import { IComponent } from '../components/IComponent.ts'
import { IStructure } from '../structures/IStructure.ts'
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

    write(...content: string[]): TextCompiler {
        this._lastLine.line += content.join('')
        return this
    }

    writeIf(condition: boolean | undefined, ...content: string[]): TextCompiler {
        if (condition) this.write(...content)
        return this
    }

    writeLine(...content: string[]): TextCompiler {
        this.write(...content)
        this.newLine()
        return this
    }

    writeLineIf(condition: boolean, ...content: string[]): TextCompiler {
        if (condition) this.writeLine(...content)
        return this
    }

    embed(...components: IComponent[]): TextCompiler {
        for (const component of components) component.write(this).writeLineIf(components.length > 1)
        return this
    }

    build(structure: IStructure, ...callbacks: CompilerCallback[]): TextCompiler {
        return structure.build(this, ...callbacks) as TextCompiler
    }

    compile(): string {
        return this._lines.map(lineSpec => lineSpec.compile()).join('\n')
    }
}
