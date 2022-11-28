import { IMessageFormat } from '../import/formats.ts'
import { TypeInfo } from './TypeInfo.ts'

export interface IMessageProperty {
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
        return this.name === 'IAuthenticationMessage'
    }

    get isBackend() {
        return !!this.format.backend
    }

    get isFrontend() {
        return !!this.format.frontend
    }

    get isBackendBase() {
        return this.name === 'IBackendMessage'
    }

    get isInternal() {
        return !!this.format.internal
    }

    get isSSL() {
        return this.name.match(/SSL/) !== null
    }

    get isStartup() {
        return this.name.match(/StartupMessage/) !== null
    }

    get extendsAuthentication() {
        return !this.isBackendBase && !this.isAuthentication && this.name.match(/Authentication/) !== null
    }

    get extendsIBackendMessage() {
        return this.isAuthentication || (!this.isBackendBase && !this.isInternal && this.isBackend)
    }
}
