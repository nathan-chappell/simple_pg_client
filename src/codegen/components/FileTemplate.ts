import { ITextCompiler } from '../compilers/ITextCompiler.ts'
import { Configurable } from '../Configurable.ts'
import { IComponent } from './IComponent.ts'
import { Dependencies } from '../Dependencies.ts'
import { ICompiler } from '../compilers/ICompiler.ts'

export interface FileTemplateOptions {
    replacements: Record<string, string>
}

export class FileTemplate extends Configurable<FileTemplateOptions> implements IComponent, ICompiler {
    template: string

    constructor(public name: string, public templateDirectory: string) {
        super({
            replacements: {},
        })
        this.template = Dependencies.readTextFileSync(`${templateDirectory}/${name}.template`)
    }

    compile(): string {
        return Object.entries(this.options.replacements).reduce(
            (_template, [name, replacement]) => _template.replaceAll(name, replacement),
            this.template,
        )
    }

    write(compiler: ITextCompiler): ITextCompiler {
        return compiler.write(this.compile())
    }
}
