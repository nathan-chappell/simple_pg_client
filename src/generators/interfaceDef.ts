import { GenWriterBase } from './genWriterBase.ts'
import { InterfacePropertyOptions, DeclOptions } from './options.ts'
import { stringToLines } from './utils.ts'

export class InterfaceDef {
    name: string
    properties: InterfacePropertyOptions[]
    options: DeclOptions
    _lineTargetLength = 100

    constructor(name: string, properties: InterfacePropertyOptions[], options: DeclOptions = {}) {
        this.name = name
        this.properties = properties
        this.options = options
    }

    _writeCommentLines = (writer: GenWriterBase, alignment: number, comment: string | string[]) => {
        if (!Array.isArray(comment)) comment = [...stringToLines(comment, this._lineTargetLength)]
        for (const commentLine of comment) {
            writer.align(alignment).writeLine('// ', commentLine)
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

    write(writer: GenWriterBase): GenWriterBase {
        const { propAlignment, typeAlignment, commentAlignment, commentBeforeProp } = this._analyze()

        if (this.options.export_) writer.write('export ')
        writer.write('interface ', this.name, ' ').withBlock(() => {
            for (const property of this.properties) {
                if (commentBeforeProp && property.comment)
                    this._writeCommentLines(writer, propAlignment, property.comment)
                writer
                    .align(propAlignment)
                    .write(property.name, ':')
                    .align(typeAlignment)
                    .write(property.type)
                if (!commentBeforeProp && typeof property.comment === 'string') {
                    writer.align(commentAlignment).write(' // ', property.comment)
                }
                writer.newLine()
            }
        })
        return writer.writeLine(' // ', this.name).newLine()
    }
}
