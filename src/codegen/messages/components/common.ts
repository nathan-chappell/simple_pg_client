import { Parameter } from '../../components/Parameter.ts'
import { MessageInfo } from './MessageInfo.ts'

export const adapterParameter = new Parameter('adapter', 'DataTypeAdapter').with({
    withType: true,
})

export const baseMessageParameter = new Parameter('baseMessage', 'IBackendMessage').with({
    withType: true,
})

export const parserName = (info: MessageInfo) => {
    if (info.extendsAuthentication) {
        throw new Error(`${info.name} extends Authentication and has no parser`)
    } else if (info.isAuthentication) {
        return `parseAuthentication`
    } else {
        return `parse${info.name}`
    }
}
