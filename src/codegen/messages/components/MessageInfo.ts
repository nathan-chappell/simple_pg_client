import { IMessageFormat } from '../import/formats.ts'
import { TypeInfo } from './TypeInfo.ts'

interface IMessageProperty {
    name: string
    typeInfo: TypeInfo
    definition: string
}

export class MessageInfo {
    name: string
    properties: IMessageProperty[]

    constructor(public format: IMessageFormat) {
        this.name = format.title
        this.properties = format.definition.map(p => ({
            name: p.name,
            typeInfo: TypeInfo.fromRawType(p.type),
            definition: p.definition,
        }))
    }

    get isAuthentication() {
        return this.format.title === 'IAuthenticationMessage'
    }

    get isBackend() {
        return !this.format.backend
    }

    get extendsAuthentication() {
        return !this.format.internal && this.format.title.match(/Authentication/) !== null
    }

    get extendsIBackendMessage() {
        return !this.format.internal && this.format.backend
    }
}
