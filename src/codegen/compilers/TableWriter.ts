import { IWriter } from '../components/IWriter.ts'
import { Configurable } from '../Configurable.ts'
import { stringToLines } from '../utils.ts'
import { ITextCompiler } from './ITextCompiler.ts'

export interface AlignedTableOptions {
    startAlignment: number | null
    rows: string[][]
    prefixes: string[]
}

export class AlignedTable extends Configurable<AlignedTableOptions> implements IWriter {
    constructor(public columnWidths: number[]) {
        super({
            startAlignment: null,
            rows: [],
            prefixes: [],
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        const alignments = this.columnWidths.reduce(
            (acc, w) => (acc.push(w + acc[acc.length - 1] ?? 0), acc),
            [this.options.startAlignment ?? 0]
        )
        for (const row of this.options.rows) {
            // compiler.alignIf(this.options.startAlignment)
            const cells = row.map(s => [...stringToLines(s, this.columnWidths[0])])
            const lineCount = Math.max(...cells.map(c => c.length))
            for (let j = 0; j < lineCount; ++j) {
                for (let c = 0; c < cells.length; ++c) {
                    compiler
                        .align(alignments[c])
                        .write(`${this.options.prefixes[c] ?? ''}${cells[c][j] ?? ''}`)
                }
                compiler.newLine()
            }
        }
        return compiler
    }
}
