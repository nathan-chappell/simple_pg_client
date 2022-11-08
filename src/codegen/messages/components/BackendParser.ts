import { ITextCompiler } from '../../compilers/ITextCompiler.ts'
import { Function_ } from '../../components/Function_.ts'
import { IComponent } from '../../components/IComponent.ts'
import { ParameterList } from '../../components/ParameterList.ts'
import { Variable } from '../../components/Variable.ts'
import { ConditionalClause, If_ } from '../../structures/If_.ts'
import { adapterParameter, parserName } from './common.ts'
import { MessageInfo } from './MessageInfo.ts'

export class BackendParser extends Function_ implements IComponent {
    constructor(public messageInfos: MessageInfo[]) {
        super('parseBackendMessage', new ParameterList([adapterParameter]), 'Promise<IBackendMessage>')
    }

    get compilerCallback(): (compiler: ITextCompiler) => void {
        return _compiler => _compiler.embed(this.withBody)
    }

    get withBody(): Function_ {
        return this.with({
            arrow_: false,
            async_: true,
            export_: true,
            body: compiler => {
                const baseMessageVariable = new Variable('baseMessage', 'IBackendMessage').with({
                    decl: 'const',
                    value: `await parseIBackendMessage(${adapterParameter.name})`,
                })
                const parserParameterList = new ParameterList([
                    adapterParameter,
                    baseMessageVariable.asParameter,
                ])
                const clauses: ConditionalClause[] = this.messageInfos
                    .filter(
                        info =>
                            info.extendsIBackendMessage &&
                            !info.extendsAuthentication &&
                            !info.isSSL &&
                            !info.isStartup
                    )
                    .map(info => ({
                        condition: new Variable(`_is${info.name}`, 'boolean').with({
                            decl: 'const',
                            value: `is${info.name}(${baseMessageVariable.name})`,
                        }),
                        body: _compiler =>
                            _compiler
                                .write(`return ${parserName(info)}`)
                                .embed(parserParameterList)
                                .newLine(),
                    }))
                const failMessage =
                    "Couldn't parse backend message: ${JSON.stringify(" + baseMessageVariable.name + ')}'
                compiler.embed(baseMessageVariable).newLine()
                for (const clause of clauses) {
                    compiler.embed(clause.condition, If_.fromClause(clause)).newLine()
                }
                return compiler.writeLine(`throw new Error(\`${failMessage}\`)`)
            },
        })
    }
}
