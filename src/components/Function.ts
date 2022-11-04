import { CompilerCallback, ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Parameter } from './parameter.ts'
import { DeclOptions, ParamWriteOptions } from './options.ts'
import { ICompiler } from '../compilers/ICompiler.ts'
import { IComponent } from './IComponent.ts'
import { IStructure } from '../structures/IStructure.ts'
import { Block } from '../structures/Block.ts'

export class Function_ implements IComponent, IStructure {
    constructor(
        public name: string,
        public parameterList: Parameter[],
        public returnType: string | null = null,
        public options: DeclOptions = {}
    ) {}

    write(compiler: ITextCompiler): ITextCompiler {
        // TODO: this will die on arrow functions
        return this.writeDeclaration(compiler)
    }

    build(compiler: ITextCompiler, ...callbacks: CompilerCallback[]): ITextCompiler {
        return this.writeDeclaration(compiler).build(new Block(), ...callbacks)
    }

    writeParams(compiler: ITextCompiler, options: ParamWriteOptions): ITextCompiler {
        const isMultiLine = this.parameterList.length > 2
        if (isMultiLine) {
            compiler.newLine().withIndent(1, () => {
                for (const parameter of this.parameterList)
                    parameter.writeWithOptions(compiler, options).writeLine(',')
            })
        } else {
            for (let i = 0; i < this.parameterList.length; ++i) {
                this.parameterList[i]
                    .writeWithOptions(compiler, options)
                    .writeIf(i < this.parameterList.length - 1, ', ')
            }
        }
        return compiler
    }

    writeDeclaration(compiler: ITextCompiler): ITextCompiler {
        if (this.options.export_) compiler.write('export ')
        if (this.options.arrow_) {
            compiler.writeIf(this.options.const_, 'const ').write(this.name)
            if (this.returnType !== null) {
                compiler.write(': (')
                this.writeParams(compiler, { withType: true, withDefault: false })
                    .write(') => ', this.returnType, ' = ')
                    .writeIf(!!this.options.async_, 'async ')
                    .write('(')
                this.writeParams(compiler, { withType: false, withDefault: true })
            } else {
                compiler.write(' = ').writeIf(this.options.async_, 'async ').write('(')
                this.writeParams(compiler, { withType: true, withDefault: true })
            }
            compiler.write(') =>')
        } else {
            compiler.writeIf(!!this.options.async_, 'async ').write('function ', this.name, '(')
            this.writeParams(compiler, { withType: true, withDefault: true }).write(')')
            if (this.returnType !== null) {
                compiler.write(': ', this.returnType)
            }
        }
        return compiler.write(' ')
    }
}
