import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Block } from '../structures/Block.ts'
import { stringToLines } from './utils.ts'

export interface InterfacePropertyOptions {
    name: string
    type: string
    optional?: boolean
    comment?: string | string[]
}


export class Interface {
    _lineTargetLength = 100

    constructor(
        public name: string,
        public properties: InterfacePropertyOptions[],
        public options: DeclOptions = {}
    ) {}

    _writeCommentLines = (compiler: ITextCompiler, alignment: number, comment: string | string[]) => {
        if (!Array.isArray(comment)) comment = [...stringToLines(comment, this._lineTargetLength)]
        for (const commentLine of comment) {
            compiler.align(alignment).writeLine('// ', commentLine)
        }
    }

    _analyze() {
        const maxPropLength = Math.max(...this.properties.map(p => p.name.length))
        const maxTypeLength = Math.max(...this.properties.map(p => p.type.length))
        const maxCommentLength = Math.max(
            ...this.properties
                .map(p => p.comment ?? '')
                .filter(c => typeof c === 'string')
                .map(c => c.length)
        )
        const propAlignment = 4
        const typeAlignment = propAlignment + maxPropLength + 2
        const commentAlignment = propAlignment + maxPropLength + maxTypeLength + 2
        const commentBeforeProp =
            true ||
            this.properties.some(p => Array.isArray(p.comment)) ||
            (maxCommentLength > 0 && commentAlignment + maxCommentLength > this._lineTargetLength)

        return {
            propAlignment,
            typeAlignment,
            commentAlignment,
            commentBeforeProp,
        }
    }

    // TODO: Broken!!!
    write(compiler: ITextCompiler): ITextCompiler {
        const { propAlignment, typeAlignment, commentAlignment, commentBeforeProp } = this._analyze()

        if (this.options.export_) compiler.write('export ')
        compiler.write('interface ', this.name, ' ').build(new Block(), () => {
            for (const property of this.properties) {
                if (commentBeforeProp && property.comment)
                    this._writeCommentLines(compiler, propAlignment, property.comment)
                compiler
                    .align(propAlignment)
                    .write(property.name, ':')
                    .align(typeAlignment)
                    .write(property.type)
                if (!commentBeforeProp && typeof property.comment === 'string') {
                    compiler.align(commentAlignment).write(' // ', property.comment)
                }
                compiler.newLine()
            }
        })
        return compiler.writeLine(' // ', this.name).newLine()
    }
}
