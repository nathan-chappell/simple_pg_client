import {
    ArrayType,
    TBuiltinTypeInfo,
    isArrayRawType,
    _getArrayType,
    builtinTypes,
} from './generate_message_impl2.ts'

export class TypeInfo {
    arrayType: ArrayType | null
    expected: string | null
    rawType: string
    tsType: string
    builtinTypeInfo: TBuiltinTypeInfo | null = null

    constructor(rawType: string) {
        this.rawType = rawType
        const _expectedMatch = rawType.match(/^(?<rest>[^()]*)(?<expected>\(\w+\))$/)
        if (!_expectedMatch) throw new Error(`Couldn't get TypeInfo for ${rawType}`)
        this.expected = _expectedMatch.groups!.expected ?? null
        const rawTypeNoExpected = _expectedMatch.groups!.rest
        this.tsType = rawTypeNoExpected.replace(/\[[^\]]+\]/g, '[]').replace(/\(.*/, '')
        this.arrayType = isArrayRawType(rawTypeNoExpected) ? _getArrayType(rawTypeNoExpected) : null
        this.builtinTypeInfo = builtinTypes[rawTypeNoExpected] ?? null
    }

    get isBuiltin() {
        return this.builtinTypeInfo !== null
    }

    get adapterType(): string {
        if (!this.isBuiltin)
            throw new Error(`Tried getting adapterType from non-builtin-type ${this.rawType}`)
        return this.builtinTypeInfo!.adapterType!
    }
}
