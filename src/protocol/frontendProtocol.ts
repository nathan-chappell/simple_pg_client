import {
    ErrorResponse,
    isDataRow,
    isIAuthenticationMessage,
    isReadyForQuery,
    isRowDescription,
} from '../messages/messageFormats.generated.ts'
import { IBackendMessage } from '../messages/messageFormats.generated.ts'
import { isErrorResponse } from '../messages/messageFormats.generated.ts'
import { IProtocol, ProtocolState } from './IProtocol.ts'

const CLEARTEXT_PASSWORD = 3

class ProtocolError extends Error {
    constructor(public state: ProtocolState, public backendMessage: IBackendMessage, public remark: string = '') {
        super(`Error from ${state.name}: ${remark}`)
    }
}

const getErrorMessage = (m: ErrorResponse) =>
    m.fields.map(f => `(${String.fromCharCode(f[0])}) ${f[1]}`).join('; ')

export const frontendProtocol: IProtocol = {
    Initial: (s, m) => {
        if (isErrorResponse(m)) {
            throw new ProtocolError(s, m, getErrorMessage(m))
        } else if (isReadyForQuery(m)) {
            s.name = 'Ready'
        } else if (isIAuthenticationMessage(m)) {
            if (m.code === CLEARTEXT_PASSWORD) {
                s.sendPassword()
            }
            throw new ProtocolError(s, m, `AuthenticationMessage not supported: ${m.code}`)
        }
    },
    Ready: (s, m) => {},
    SimpleQuery: (s, m) => {
        if (isReadyForQuery(m)) {
            s.name = 'Ready'
        } else if (isErrorResponse(m)) {
            throw new ProtocolError(s, m, getErrorMessage(m))
        } else if (isRowDescription(m)) {
            s.datasets.push({ fields: m.fields, rows: [] })
        } else if (isDataRow(m)) {
            s.datasets[s.datasets.length - 1].rows.push(m.columns)
        }
    },
    Terminating: (s, m) => {},
}
