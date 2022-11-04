import { ICompiler } from './ICompiler.ts'
import { IComponent } from '../components/IComponent.ts'
import { IStructure } from "../structures/IStructure.ts";

export type CompilerCallback = () => void

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

    writeComponent(component: IComponent): ITextCompiler
    build(structure: IStructure, ...callbacks: CompilerCallback[]): ITextCompiler
}
