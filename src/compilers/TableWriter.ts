import { IComponent } from '../components/IComponent.ts'
import { Configurable } from '../Configurable.ts'
import { ITextCompiler } from './ITextCompiler.ts'

export interface TableWriterOptions {
    startAlignment: number
    alignments: number[] | null
    rows: string[][]
}

export class TableWriter extends Configurable<TableWriterOptions> implements IComponent {
    constructor(public compiler: ITextCompiler) {
        super({
            startAlignment: 0,
            alignments: null,
            rows: [],
        })
    }

    _getAlignments(): number[] {
        const _padding = 1
        const sizes = this.options.rows.map(row => row.map(item => item.length))
        const maxSizes = sizes.reduce((maxes, row) => maxes.map((_max, j) => Math.max(_max, row[j])))
        return maxSizes
    }

    write(compiler: ITextCompiler): ITextCompiler {
        const _alignments = this.options.alignments ?? this._getAlignments()
        for (const row of this.options.rows) {
            compiler.align(this.options.startAlignment)
            for (let j = 0; j < row.length; ++j) {
                compiler.align(_alignments[j]).write(row[j])
            }
            compiler.newLine()
        }
        return compiler
    }
}
