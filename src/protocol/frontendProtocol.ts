import {
    ErrorResponse,
    isCommandComplete,
    isDataRow,
    isIAuthenticationMessage,
    isReadyForQuery,
    isRowDescription,
} from '../messages/messageFormats.generated.ts'
import { IBackendMessage } from '../messages/messageFormats.generated.ts'
import { isErrorResponse } from '../messages/messageFormats.generated.ts'
import { IProtocol, ProtocolState } from './IProtocol.ts'

const AUTHENTICATION_OK = 0
const CLEARTEXT_PASSWORD = 3

class ProtocolError extends Error {
    constructor(
        public state: ProtocolState,
        public backendMessage: IBackendMessage,
        public remark: string = '',
    ) {
        super(`Error from ${state.name}: ${remark}`)
    }
}

const getErrorMessage = (m: ErrorResponse) =>
    m.fields.map(f => `(${String.fromCharCode(f[0])}) ${f[1]}`).join('; ')

const log = (s: ProtocolState, m: IBackendMessage) => {
    // console.debug(`[Log] (${s.name})`)
    // console.debug(JSON.stringify(m, null, 0))
}

export const frontendProtocol: IProtocol = {
    Initial: (s, m) => {
        log(s, m)
        if (isErrorResponse(m)) {
            throw new ProtocolError(s, m, getErrorMessage(m))
        } else if (isReadyForQuery(m)) {
            s.transition('Ready')
        } else if (isIAuthenticationMessage(m)) {
            if (m.code === CLEARTEXT_PASSWORD) {
                s.sendPassword()
            } else if (m.code === AUTHENTICATION_OK) {
                // console.debug('[frontendProtocol.Initial] AUTHENTICATION_OK')
            } else {
                throw new ProtocolError(s, m, `AuthenticationMessage not supported: ${m.code}`)
            }
        }
    },
    Ready: (s, m) => {
        log(s, m)
    },
    SimpleQuery: (s, m) => {
        log(s, m)
        if (isReadyForQuery(m)) {
            s.transition('Ready')
        } else if (isErrorResponse(m)) {
            throw new ProtocolError(s, m, getErrorMessage(m))
        } else if (isRowDescription(m)) {
            s.datasets.push({ fields: m.fields, rows: [] })
        } else if (isDataRow(m)) {
            s.datasets[s.datasets.length - 1].rows.push(m.columns)
        } else if (isCommandComplete(m)) {
            s.completionMessages.push(m.message)
        }
    },
    Shutdown: (s, m) => {
        log(s, m)
    },
}
