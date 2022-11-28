import { IBackendMessage, IField } from '../messages/messageFormats.generated.ts'

type TActivator = { promise: Promise<void>; res: () => void }

const getActivator: () => TActivator = () => {
    let res: (() => void) | null = null
    const promise = new Promise<void>(_res => {
        res = _res
    })
    if (res === null) {
        throw new Error('[getActivator] internal failure.')
    } else {
        return {
            promise,
            res,
        }
    }
}

class Waiter {
    activator: TActivator | null = null

    get init(): Promise<void> {
        if (this.activator === null) {
            this.activator = getActivator()
        }
        return this.activator.promise
    }

    get wait(): Promise<void> {
        if (this.activator === null) {
            return Promise.resolve()
        } else {
            return this.activator.promise
        }
    }

    finish() {
        if (this.activator !== null) {
            this.activator.res()
        }
    }
}

type Column = number[]
type Row = Column[]

export interface IDataset {
    fields: IField[]
    rows: Row[]
}

export class ProtocolState {
    constructor(
        public name: string,
        public sendPassword: () => void,
        public datasets: IDataset[] = [],
        public activators: Record<string, Waiter> = {}
    ) {}

    transition(name: string) {
        this.name = name
    }
}

export interface IProtocol {
    [name: string]: (s: ProtocolState, m: IBackendMessage) => void //Promise<void>
}
