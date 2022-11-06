import { Configurable } from '../../Configurable.ts'

export interface TypeInfoOptions {
    itemType: string
    sizeTypes: string[]
    expected: string | null
}

export class TypeInfo extends Configurable<TypeInfoOptions> {
    constructor(public rawType: string) {
        super({
            itemType: '__DEFAULT__',
            sizeTypes: [],
            expected: null,
        })
    }

    static fromRawType(rawType: string): TypeInfo {
        const match = rawType.match(
            /^(?<itemType>\w+)(?<arrayModifiers>(\[\w+\])*)(\((?<expected>[^)]*)\))?$/
        )
        if (!match) throw new Error(`Cannot create TypeInfo from ${rawType} - match failed`)
        const { itemType, expected, arrayModifiers } = match.groups!
        const sizeTypes = [...arrayModifiers.matchAll(/\[(\w+)\]/g)].map(m => m[1])
        return new TypeInfo(rawType).with({ itemType, sizeTypes, expected: expected ?? null })
    }

    get tsType(): string {
        return `${this.options.itemType}${'[]'.repeat(this.options.sizeTypes.length)}`
    }

    get isArray(): boolean {
        return this.options.sizeTypes.length > 0
    }
}
