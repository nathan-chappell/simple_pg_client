export interface ITV {
    name: string
    value: string | string[] | number | number[] | ITV[]
}

export type ITVObject = { [name: string]: string | string[] | number | number[] | ITVObject }

export function isStringArray(a: unknown): a is ITV[] {
    return Array.isArray(a) && typeof a[0] === 'string'
}

export function isNumberArray(a: unknown): a is number[] {
    return Array.isArray(a) && typeof a[0] === 'number'
}

export function isITVArray(a: unknown): a is ITV[] {
    return Array.isArray(a) && typeof a[0] === 'object'
}

export function objFromItvArray(a: ITV[]): ITVObject {
    return a.reduce(
        (obj, { name, value }) => ((obj[name] = isITVArray(value) ? objFromItvArray(value) : value), obj),
        {} as ITVObject
    )
}
