import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { TableWriter } from '../compilers/TableWriter.ts'
import { Configurable } from '../Configurable.ts'
import { Block } from '../structures/Block.ts'
import { Comment } from './Comment.ts'
import { IComponent } from './IComponent.ts'

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

export class Interface extends Configurable<InterfaceOptions> implements IComponent {
    constructor(public name: string, public properties: InterfacePropertyOptions[]) {
        super({
            export_: true,
            autoAlign: true,
            comment: null,
            extends: [],
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        if (this.options.comment !== null) compiler.embed(this.options.comment)
        let body: () => void
        const rows = this.properties.map(p => [`${p.name}:`, p.type, p.lineComment ?? ''])

        if (this.options.autoAlign) {
            const widths = [...Array(3)].map((_, i) => Math.max(...rows.map(row => row[i].length)) + 1)
            widths[1] += 4
            const propertyDefTable = new TableWriter(compiler, widths).with({
                startAlignment: 4,
                rows: rows,
                prefixes: ['', '', '// '],
            })
            body = () => compiler.embed(propertyDefTable)
        } else {
            body = () => {
                for (const row of rows) {
                    compiler.writeLine(row.join(' '))
                }
            }
        }

        return compiler
            .writeIf(this.options.export_, 'export ')
            .write('interface ', this.name, ' ')
            .build(new Block(), body)
            .write(' // ', this.name)
    }
}
