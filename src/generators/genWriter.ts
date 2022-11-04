import { GenWriterBase } from './genWriterBase.ts'

interface ParamWriteOptions {
    withType?: boolean
    withDefault?: boolean
}

export interface DeclOptions {
    arrow_?: boolean
    async_?: boolean
    const_?: boolean
    export_?: boolean
    expressionBody_?: boolean
}

export class ParameterDef {
    name: string
    type: string
    default_: string | null

    constructor(name: string, type: string, default_: string | null = null) {
        this.name = name
        this.type = type
        this.default_ = default_
    }

    write(writer: GenWriterBase, options: ParamWriteOptions) {
        writer.write(`${this.name}`)
        if (options.withType) writer.write(`: ${this.type}`)
        if (options.withDefault && this.default_ !== null) {
            writer.write(` = ${this.default_}`)
        }
    }
}

export class FunctionDef {
    name: string
    parameterList: ParameterDef[] = []
    returnType: string | null = null
    options: DeclOptions = {}

    constructor(
        name: string,
        parameterList: ParameterDef[] | null = null,
        returnType: string | null = null,
        options: DeclOptions = {}
    ) {
        this.name = name
        this.parameterList = parameterList ?? []
        this.returnType = returnType
        this.options = options
    }

    writeParams(writer: GenWriterBase, options: ParamWriteOptions) {
        const isMultiLine = this.parameterList.length > 2
        if (isMultiLine) {
            writer.newLine()
            writer.withIndent(1, () => {
                for (const parameter of this.parameterList) {
                    parameter.write(writer, options)
                    writer.writeLine(',')
                }
            })
        } else {
            for (let i = 0; i < this.parameterList.length; ++i) {
                this.parameterList[i].write(writer, options)
                if (i < this.parameterList.length - 1) writer.write(', ')
            }
        }
    }

    writeDeclaration(writer: GenWriterBase) {
        const _writeAsync = () => {
            if (this.options.async_) writer.write('async ')
        }

        if (this.options.export_) writer.write('export ')
        if (this.options.arrow_) {
            if (this.options.const_) writer.write('const ')
            writer.write(this.name)
            if (this.returnType !== null) {
                writer.write(': (')
                this.writeParams(writer, { withType: true, withDefault: false })
                writer.write(') => ', this.returnType, ' = ')
                _writeAsync()
                writer.write('(')
                this.writeParams(writer, { withType: false, withDefault: true })
            } else {
                writer.write(' = ')
                _writeAsync()
                writer.write('(')
                this.writeParams(writer, { withType: true, withDefault: true })
            }
            writer.write(') =>')
        } else {
            _writeAsync()
            writer.write('function ', this.name, '(')
            this.writeParams(writer, { withType: true, withDefault: true })
            writer.write(')')
            if (this.returnType !== null) {
                writer.write(': ', this.returnType)
            }
        }
        writer.write(' ')
    }
}

export class GenWriter extends GenWriterBase {
    writeFunction(f: FunctionDef, writeBody: (writer: GenWriterBase) => void) {
        f.writeDeclaration(this)
        if (f.options.expressionBody_) {
            writeBody(this)
        } else {
            this.withBlock(() => writeBody(this));
        }
    }

    writeTypeDef(name: string, def: string, options: DeclOptions = {}) {
        if (options.export_) this.write('export ')
        this.writeLine('type ', name, ' = ', def)
    }
}
