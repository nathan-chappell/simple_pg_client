import { IBackendMessage } from "../messages/messageFormats.generated.ts";

export type Action = () => void
export type Actions = Action[]
export type MessageTest = (m: IBackendMessage) => boolean
export type Handler = { if_: MessageTest, actions: Actions}

export interface IState {
    name: string
    fallbackActions: Actions
    handlers: Handler[]
    substates?: IState[]
}
