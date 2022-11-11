export type TypedValue<T = unknown> = { type: string; value: T }
export type NamedValue<T = unknown> = { name: string } & TypedValue<T>
export type O = string | number | { [name: string]: O } | Array<O>

export function isString(o: unknown): o is string {
    return typeof o === 'string'
}

export function isNumber(o: unknown): o is number {
    return typeof o === 'number'
}

export function isTypedValue(o: Record<never, never> | TypedValue): o is TypedValue {
    return 'type' in o && typeof o.type === 'string' && 'value' in o
}

export function isNamedValue(o: Record<never, never> | NamedValue): o is NamedValue {
    return isTypedValue(o) && 'name' in o && typeof o.name === 'string'
}

export function isObjDef(o: Record<never, never>[] | NamedValue[]): o is NamedValue[] {
    return isNamedValue(o[0])
}

export function isArrayDef(o: Record<never, never>[] | TypedValue[]): o is TypedValue[] {
    return isTypedValue(o[0]) && !isNamedValue(o[0])
}

export function fromEntries(o: unknown): O {
    if (isString(o)) {
        return o
    } else if (isNumber(o)) {
        return o
    } else if (Array.isArray(o) && o.every(isString)) {
        throw new Error('unexpected string[]')
        // return o.map(fromEntries)
    } else if (Array.isArray(o) && o.every(isNumber)) {
        throw new Error('unexpected number[]')
        // return o.map(fromEntries)
    } else if (Array.isArray(o) && isObjDef(o)) {
        return o.reduce(
            (result, item) => ((result[item.name] = fromEntries(item.value)), result),
            {} as { [name: string]: O },
        )
    } else if (Array.isArray(o) && isArrayDef(o)) {
        return o.map(item => fromEntries(item.value))
    }

    throw new Error(`Unable to create V from ${JSON.stringify(o, null, 2)}`)
}
