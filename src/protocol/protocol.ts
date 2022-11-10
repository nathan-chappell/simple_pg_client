import { Configurable } from '../codegen/Configurable.ts'
import { IBackendMessage } from '../messages/messageFormats.generated.ts'

export type TStateNames = 'startup' | 'idle' | 'query' | 'extended-query'

export interface ISession {
    [key: string]: string | string[] | number | number[] | ISession | ISession[]
}

export interface ISessionCallback {
    (session: ISession): void
}

export class SessionStack {
    stack: ISession[] = []
    sessionCallbacks: ISessionCallback[] = []

    constructor() {}

    pushNew() {
        this.stack.push({})
    }

    then(cb: ISessionCallback) {
        this.sessionCallbacks.push(cb)
    }

    pop() {
        const session = this.stack.pop()
        if (session === undefined)
            throw new Error('Empty session stack')
        for (const cb of this.sessionCallbacks)
            cb(session)
        return session
    }
}

// class State {
//     name: TStateNames = 'startup'
// }

// function handleMessage(message: IBackendMessage, state: Readonly<IState>): IState {}


let p = new Promise<ISession>(r => r({}))
p.then()