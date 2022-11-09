import type { IWriter } from '../components/IWriter.ts'
import type { ICompiler } from './ICompiler.ts'
import type { ITextCompiler } from './ITextCompiler.ts'

export type CompilerCallback = (compiler: ITextCompiler) => ITextCompiler

export type TComponent = string | CompilerCallback | IWriter | ICompiler

export function isCompilerCallback(writeable: TComponent): writeable is CompilerCallback {
    return typeof writeable === 'function'
}
export function isIComponent(writeable: TComponent): writeable is IWriter {
    return typeof writeable === 'object' && typeof (writeable as IWriter)['write'] === 'function'
}
export function isICompiler(writeable: TComponent): writeable is ICompiler {
    return typeof writeable === 'object' && typeof (writeable as ICompiler)['compile'] === 'function'
}
