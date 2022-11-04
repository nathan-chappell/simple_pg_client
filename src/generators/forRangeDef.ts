import { GenWriterBase } from './genWriterBase.ts'
import { varName } from './utils.ts'
import { VariableDef } from './variableDef.ts'

export class ForRangeDef {
    constructor(public max: string | number, public body: (loopVar: string) => void) {}

    write(writer: GenWriterBase): GenWriterBase {
        const loopVar = new VariableDef(varName(), 'number', { initializer_: '0' })
        writer.write('for (')
        return loopVar
            .write(writer)
            .write('; ')
            .write(loopVar.name, ' < ', `${this.max}; `)
            .write('++', loopVar.name, ') ')
            .withBlock(() => this.body(loopVar.name))
    }
}
