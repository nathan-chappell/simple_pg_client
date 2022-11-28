import { Action, IState, MessageTest } from './engine.ts'

interface IDependencies {
    fail: Action
    goto: (state: string) => Action
    log: Action

    sendMD5PasswordMessage: Action
    storeKeyData: Action

    isAuthenticationMD5Password: MessageTest
    isAuthenticationOk: MessageTest
    isBackendKeyData: MessageTest
    isErrorResponse: MessageTest
    isReadyForQuery: MessageTest
}

export const proto: (I: IDependencies) => IState = I => ({
    name: 'PG-Client',
    fallbackActions: [I.log],
    handlers: [{ if_: I.isErrorResponse, actions: [I.fail] }],
    substates: [
        {
            name: 'StartUp',
            fallbackActions: [I.goto('Fail')],
            handlers: [
                { if_: I.isAuthenticationOk, actions: [I.goto('Waiting')] },
                { if_: I.isAuthenticationMD5Password, actions: [I.sendMD5PasswordMessage] },
            ],
        },
        {
            name: 'Waiting',
            fallbackActions: [I.log],
            handlers: [
                { if_: I.isBackendKeyData, actions: [I.storeKeyData] },
                { if_: I.isReadyForQuery, actions: [I.goto('Ready')] },
            ],
        },
        {
            name: 'Ready',
            fallbackActions: [I.log],
            handlers: [{ if_: I.isErrorResponse, actions: [I.fail] }],
        },
    ],
})
