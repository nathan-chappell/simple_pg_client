import { IBackendMessage } from "../messages/messageFormats.generated.ts";

export interface IState {
    name: string
}

export interface IProtocol {
    [name: string]: (s: IState, m: IBackendMessage) => Promise<IState>
}
