import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { AlignedTable } from '../compilers/TableWriter.ts'
import { Configurable } from '../Configurable.ts'
import { IWriter } from './IWriter.ts'
import { Comment } from './Comment.ts'
import { Block } from './Block.ts'
import { CompilerCallback } from '../compilers/TComponent.ts'

export interface InterfacePropertyOptions {
    name: string
    type: string
    optional?: boolean
    lineComment?: string
}

export interface InterfaceOptions {
    export_: boolean
    autoAlign: boolean
    comment: Comment | null
    extends: string[]
}

export class Interface extends Configurable<InterfaceOptions> implements IWriter {
    constructor(public name: string, public properties: InterfacePropertyOptions[]) {
        super({
            export_: true,
            autoAlign: true,
            comment: null,
            extends: [],
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        let body: CompilerCallback
        const rows = this.properties.map(p => [`${p.name}:`, p.type, p.lineComment ?? ''])

        if (this.options.autoAlign) {
            const widths = [...Array(3)].map((_, i) => Math.max(...rows.map(row => row[i].length)) + 1)
            widths[1] += 4
            const propertyDefTable = new AlignedTable(widths).with({
                startAlignment: 4,
                rows: rows,
                prefixes: ['', '', '// '],
            })
            body = (_compiler: ITextCompiler) => _compiler.write(propertyDefTable)
        } else {
            body = (_compiler: ITextCompiler) => _compiler.writeLines(...rows.map(row => row.join(' ')))
        }

        return compiler
            .writeIf(this.options.comment !== null, this.options.comment!)
            .writeIf(this.options.export_, 'export ')
            .write('interface ', this.name, ' ', new Block(body), ' // ', this.name)
    }
}
