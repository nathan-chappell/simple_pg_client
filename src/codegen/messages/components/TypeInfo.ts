import { Configurable } from '../../Configurable.ts'

export interface TypeInfoOptions {
    itemType: string
    sizeTypes: string[]
    expected: string | null
    optional: boolean
}

export class TypeInfo extends Configurable<TypeInfoOptions> {
    private constructor(public rawType: string) {
        super({
            itemType: '__DEFAULT__',
            sizeTypes: [],
            expected: null,
            optional: false,
        })
    }

    static fromRawType(rawType: string): TypeInfo {
        const match = rawType.match(
            /^(?<itemType>\w+)((?<arrayModifiers>(\[\w+\])*)|(\((?<expected>[^)]*)\))|(?<optional>\?))?$/
        )
        if (!match) throw new Error(`Cannot create TypeInfo from ${rawType} - match failed`)
        const { itemType, expected, arrayModifiers, optional } = match.groups!
        const sizeTypes = [...(arrayModifiers ?? '').matchAll(/\[(\w+)\]/g)].map(m => m[1])
        return new TypeInfo(rawType).with({
            itemType,
            sizeTypes,
            expected: expected ?? null,
            optional: !!optional,
        })
    }

    get tsArrayPart() {
        return '[]'.repeat(this.options.sizeTypes.length)
    }

    get tsType(): string {
        const { itemType, optional } = this.options
        return `${itemType}${this.tsArrayPart}${optional ? ' | null' : ''}`
    }

    get isArray(): boolean {
        return this.options.sizeTypes.length > 0
    }
}
