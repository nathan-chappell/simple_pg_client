import { IComponent } from '../components/IComponent.ts'
import { IStructure } from '../structures/IStructure.ts'
import { ICompiler } from './ICompiler.ts'

export type CompilerCallback = (compiler: ITextCompiler) => void

export interface ITextCompiler extends ICompiler {
    align(column: number): ITextCompiler
    alignIf(column: unknown): ITextCompiler
    indent(n: number): ITextCompiler
    dedent(n: number): ITextCompiler
    withIndent(n: number, ...callbacks: CompilerCallback[]): ITextCompiler

    newLine(n?: number): ITextCompiler
    write(...content: string[]): ITextCompiler
    writeIf(condition: boolean | undefined, ...content: string[]): ITextCompiler
    writeLine(...content: string[]): ITextCompiler
    writeLineIf(condition: boolean, ...content: string[]): ITextCompiler

    call_(...callbacks: CompilerCallback[]): ITextCompiler
    embed(...components: IComponent[]): ITextCompiler
    build(structure: IStructure, ...callbacks: CompilerCallback[]): ITextCompiler
}
