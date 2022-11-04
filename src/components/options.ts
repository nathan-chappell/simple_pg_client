export interface ParamWriteOptions {
    withType?: boolean
    withDefault?: boolean
}

export interface DeclOptions {
    arrow_?: boolean
    async_?: boolean
    const_?: boolean
    export_?: boolean
    expressionBody_?: boolean
}

export interface InterfacePropertyOptions {
    name: string
    type: string
    optional?: boolean
    comment?: string | string[]
}

export interface VariableOptions {
    const_?: boolean
    initializer_?: string
    initAlignment?: number
    typeAlignment?: number
}