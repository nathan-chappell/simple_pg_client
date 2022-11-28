import { isReadyForQuery } from '../messages/messageFormats.generated.ts'
import { IBackendMessage } from '../messages/messageFormats.generated.ts'
import { isErrorResponse } from '../messages/messageFormats.generated.ts'
import { IProtocol, IState } from './IProtocol.ts'

interface IDependencies {
    log: (m: IBackendMessage, s: IState) => void
}

class ProtocolError extends Error {
    constructor(public state: IState, public backendMessage: IBackendMessage, public remark: string = '') {
        super(`Error from ${state.name}: ${remark}`)
    }
}

export const proto: (I: IDependencies) => IProtocol = I => ({
    Initial: (s, m) => {
        let nextState: IState = s
        if (isErrorResponse(m)) {
            throw new ProtocolError(s, m)
        } else if (isReadyForQuery(m)) {
            nextState = { ...s, name: 'Ready' }
        } else {
            I.log(m, s)
        }
        return Promise.resolve(nextState)
    },
})
