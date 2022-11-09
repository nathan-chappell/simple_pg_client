import { ITextCompiler } from '../../compilers/ITextCompiler.ts'
import { TComponent } from '../../compilers/TComponent.ts'
import { Function_ } from '../../components/Function_.ts'
import { IWriter } from '../../components/IWriter.ts'
import { ParameterList } from '../../components/ParameterList.ts'
import { Variable } from '../../components/Variable.ts'
import { ConditionalClause, If_ } from '../../components/If_.ts'
import { Configurable } from '../../Configurable.ts'
import { adapterParameter, parserName } from './common.ts'
import { MessageInfo } from './MessageInfo.ts'

export class BackendParser extends Configurable implements IWriter {
    function_: Function_

    constructor(public messageInfos: MessageInfo[]) {
        super({})
        this.function_ = new Function_(
            'parseBackendMessage',
            new ParameterList([adapterParameter]),
            this._body,
            'Promise<IBackendMessage>',
        ).with({
            arrow_: false,
            async_: true,
            export_: true,
            bodyType: 'block',
        })
    }

    write(compiler: ITextCompiler): ITextCompiler {
        return compiler.write(this.function_)
    }

    get _body(): TComponent {
        return (compiler: ITextCompiler) => {
            const baseMessageVariable = new Variable('baseMessage', 'IBackendMessage').with({
                decl: 'const',
                value: `await parseIBackendMessage(${adapterParameter.name})`,
            })

            const parserParameterList = new ParameterList([
                adapterParameter.with({ withType: false, withDefault: false }),
                baseMessageVariable.asParameter,
            ])

            const clauses: ConditionalClause<Variable>[] = this.messageInfos
                .filter(
                    info =>
                        info.extendsIBackendMessage &&
                        !info.extendsAuthentication &&
                        !info.isSSL &&
                        !info.isStartup,
                )
                .map(info => ({
                    condition: new Variable(`_is${info.name}`, 'boolean').with({
                        decl: 'const',
                        value: `is${info.name}(${baseMessageVariable.name})`,
                    }),
                    body: compiler =>
                        compiler
                            .write(`return ${parserName(info)}`)
                            .write(parserParameterList)
                            .newLine(),
                }))

            const failMessage =
                "Couldn't parse backend message: ${JSON.stringify(" + baseMessageVariable.name + ')}'

            compiler.writeLine(baseMessageVariable)
            for (const clause of clauses) {
                compiler
                    .writeLine(clause.condition)
                    .writeLine(If_.fromClause({ ...clause, condition: clause.condition.name }))
            }
            return compiler.writeLine(`throw new Error(\`${failMessage}\`)`)
        }
    }
}
