import { IComponent } from '../components/IComponent.ts'
import { ICompiler } from './ICompiler.ts'

export type CompilerCallback = (compiler: ITextCompiler) => ITextCompiler

export type Writable = string | CompilerCallback | IComponent | ICompiler
export function isCompilerCallback(writeable: Writable): writeable is CompilerCallback {
    return typeof writeable === 'function'
}
export function isIComponent(writeable: Writable): writeable is IComponent {
    return typeof writeable === 'object' && typeof (writeable as IComponent)['write'] === 'function'
}
export function isICompiler(writeable: Writable): writeable is ICompiler {
    return typeof writeable === 'object' && typeof (writeable as ICompiler)['compile'] === 'function'
}

export interface ITextCompiler extends ICompiler {
    align(column: number): ITextCompiler
    alignIf(column: unknown): ITextCompiler
    indent(n: number): ITextCompiler
    dedent(n: number): ITextCompiler
    withIndent(n: number, component: IComponent): ITextCompiler

    newLine(n?: number): ITextCompiler
    write(...content: Writable[]): ITextCompiler
    writeIf(condition: boolean | undefined, ...content: Writable[]): ITextCompiler
    writeLine(...content: Writable[]): ITextCompiler
    writeLineIf(condition: boolean, ...content: Writable[]): ITextCompiler
}
