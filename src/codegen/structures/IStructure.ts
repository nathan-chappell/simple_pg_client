import { ITextCompiler, CompilerCallback } from "../compilers/ITextCompiler.ts";

export interface IStructure {
    build(compiler: ITextCompiler, ...callbacks: CompilerCallback[]): ITextCompiler
}