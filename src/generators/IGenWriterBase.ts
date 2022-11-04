import { IComponentWriter } from './IComponentWriter.ts'

export interface IGenWriterBase {
    align(column: number): IGenWriterBase
    alignIf(column: unknown): IGenWriterBase
    indent(n: number): IGenWriterBase
    dedent(n: number): IGenWriterBase

    withIndent(n: number, cb: () => void): IGenWriterBase
    withBlock(cb: () => void): IGenWriterBase

    newLine(n: number): IGenWriterBase
    write(...content: string[]): IGenWriterBase
    writeIf(condition: boolean | undefined, ...content: string[]): IGenWriterBase
    writeLine(...content: string[]): IGenWriterBase
    writeLineIf(condition: boolean, ...content: string[]): IGenWriterBase

    callWriter(writer: IComponentWriter): IGenWriterBase
}
