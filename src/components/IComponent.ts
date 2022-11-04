import { ITextCompiler } from "../compilers/ITextCompiler.ts";

export interface IComponent {
    write(compiler: ITextCompiler): ITextCompiler;
}