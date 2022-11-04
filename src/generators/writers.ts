interface IParameterDef {
    name: string
    type: string
    default?: string
}

interface IFunctionDef {
    name: string
    parameterList: IParameter[]
    returnType: string
    body: string
    async_: boolean
}

const writeParameter = (writer: WritableStreamDefaultWriter, p: IParameterDef, last=false) => {
    writer.write(`${p.name}: ${p.type}${p.default !== undefined ? ` = ${p.default}` : ''}${!last ? ', ' : ''}`)
}

const writeFunction = (writer: WritableStreamDefaultWriter, f: IFunctionDef) => {
    writer.write(`${f.async_ ? 'async ' : ''}function ${f.name}(`)
    for (let i = 0; i < f.parameterList.length; ++i) {
        writeParameter(writer, f.parameterList[i]);
    }
    writer.write(`) { ${f.body} }`)
}

