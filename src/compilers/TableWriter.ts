import { IComponent } from '../components/IComponent.ts'
import { Configurable } from '../Configurable.ts'
import { ITextCompiler } from './ITextCompiler.ts'
import { stringToLines } from '../utils.ts'

export interface TableWriterOptions {
    startAlignment: number | null
    rows: string[][]
}

export class TableWriter extends Configurable<TableWriterOptions> implements IComponent {
    constructor(public compiler: ITextCompiler, public columnWidths: number[]) {
        super({
            startAlignment: null,
            rows: [],
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
                for (let c = 0; c < cells.length; ++c) compiler.align(alignments[c]).write(cells[c][j] ?? '')
            }
            compiler.newLine()
        }
        return compiler
    }
}
