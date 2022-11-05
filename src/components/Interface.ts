import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { TableWriter } from '../compilers/TableWriter.ts'
import { Configurable } from '../Configurable.ts'
import { Block } from '../structures/Block.ts'
import { MultiLineComment } from './Comment.ts'
import { IComponent } from './IComponent.ts'

export interface InterfacePropertyOptions {
    name: string
    type: string
    optional?: boolean
    comment?: string
}

export interface InterfaceOptions {
    commentAfterProp: boolean
    export_: boolean
    autoAlign: boolean
}

export class Interface extends Configurable<InterfaceOptions> implements IComponent {
    _lineTargetLength = 100

    constructor(public name: string, public properties: InterfacePropertyOptions[]) {
        super({
            commentAfterProp: false,
            export_: true,
            autoAlign: true,
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        if (!this.options.commentAfterProp) {
            for (const property of this.properties.filter(p => p.comment)) {
                compiler.embed(new MultiLineComment(`* @${property.name}: ${property.comment!}`))
            }
        }

        const propertyDefTable = new TableWriter(compiler).with({
            startAlignment: 4,
            rows: this.properties.map(p =>
                this.options.commentAfterProp
                    ? [`${p.name}:`, p.type, p.comment || '']
                    : [`${p.name}:`, p.type]
            ),
        })

        return compiler
            .writeIf(this.options.export_, 'export ')
            .write('interface ', this.name, ' ')
            .build(new Block(), () => {
                return compiler.embed(propertyDefTable)
            })
            .writeLine(' // ', this.name)
            .newLine()
    }
}
