import type { IWriter } from '../components/IWriter.ts'
import type { TComponent } from './TComponent.ts'
import type { ICompiler } from './ICompiler.ts'

export interface ITextCompiler extends ICompiler {
    align(column: number): ITextCompiler
    alignIf(column: unknown): ITextCompiler
    indent(n: number): ITextCompiler
    dedent(n: number): ITextCompiler
    withIndent(n: number, component: TComponent): ITextCompiler

    newLine(n?: number): ITextCompiler
    write(...components: TComponent[]): ITextCompiler
    writeIf(condition: boolean | undefined, ...components: TComponent[]): ITextCompiler
    writeLine(...components: TComponent[]): ITextCompiler
    writeLines(...components: TComponent[]): ITextCompiler
    writeLineIf(condition: boolean, ...components: TComponent[]): ITextCompiler
}
