type TMessageFormat = string
type TAction = string
type THandler = { on: TMessageFormat; action: TAction }

interface IProtocol {
    name: string
    fallbackAction: TAction
    handlers: THandler[]
    phases?: IProtocol[]
}

export const proto: IProtocol = {
    name: "PG-Client",
    fallbackAction: 'log',
    handlers: [{ on: 'ErrorResponse', action: 'call fail' }],
    phases: [
        {
            name: 'StartUp',
            fallbackAction: 'goto Fail',
            handlers: [
                { on: 'AuthenticationOk', action: 'goto $Waiting' },
                { on: 'AuthenticationMD5Password', action: 'call sendMD5PasswordMessage' },
            ],
        },
        {
            name: 'Waiting',
            fallbackAction: '$log',
            handlers: [
                { on: 'ErrorResponse', action: 'call fail' },
                { on: 'BackendKeyData', action: 'store keyData' },
                { on: 'ReadyForQuery', action: 'goto $Ready' },
            ],
        },
        {
            name: 'Ready',
            fallbackAction: '$log',
            handlers: [{ on: 'ErrorResponse', action: 'call fail' }],
        },
    ],
}
