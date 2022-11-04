import { GenWriterBase } from './genWriterBase.ts'
import { DeclOptions } from './options.ts'
import { FunctionDef } from './functionDef.ts'

export class GenWriter extends GenWriterBase {
    writeFunction(f: FunctionDef, writeBody: () => void): GenWriter {
        f.writeDeclaration(this)
        if (f.options.expressionBody_) {
            writeBody()
        } else {
            this.withBlock(() => writeBody()).newLine()
        }
        return this
    }

    writeImports(names: string[], from: string): GenWriter {
        this.write('import ')
        if (names.length == 1) {
            this.write('{ ', names[0], ' }')
        } else {
            this.withBlock(() => {
                for (const name of names) this.writeLine(name, ',')
            })
        }
        return this.writeLine(" from '", from, "'") as GenWriter
    }

    writeTypeDef(name: string, def: string, options: DeclOptions = {}): GenWriter {
        if (options.export_) this.write('export ')
        return this.writeLine('type ', name, ' = ', def) as GenWriter
    }

    withRegion(name: string, cb: () => void): GenWriter {
        this.newLine().writeLine('//#region ', name).newLine()
        cb()
        return this.newLine().writeLine('//#endregion') as GenWriter
    }
}
