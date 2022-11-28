import {
    Byte4Type,
    isByte4Type,
    isNumberType,
    isStringType,
    NumberType,
    StringType,
} from '../../../messages/ITypedValue.ts'
import { ITextCompiler } from '../../compilers/ITextCompiler.ts'
import { CompilerCallback, TComponent } from '../../compilers/TComponent.ts'
import { Block } from '../../components/Block.ts'
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
            /^(?<itemType>\w+)((?<arrayModifiers>(\[\w+\])*)|(\((?<expected>[^)]*)\))|(?<optional>\?))?$/,
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

    get sizeTypeInfo(): TypeInfo {
        if (!this.isArray) throw new Error(`Can't get sizeTypeInfo for ${this.rawType}`)
        return TypeInfo.fromRawType(this.options.sizeTypes[this.options.sizeTypes.length - 1])
    }

    get innerArrayTypeInfo(): TypeInfo {
        if (!this.isArray) throw new Error(`Can't get innerArrayType for ${this.rawType}`)
        // prettier-ignore
        const innerItemArrayPart = this.options.sizeTypes.slice(0, -1).map(t => `[${t}]`).join('')
        return TypeInfo.fromRawType(`${this.options.itemType}${innerItemArrayPart}`)
    }

    get typeValueType(): NumberType | StringType | Byte4Type {
        if (this.isArray) throw new Error('typeValueType of Array')
        const tsTypeMap: { [tsType: string]: NumberType | StringType | Byte4Type | undefined } = {
            Byte1: 'Char',
            Byte4: 'Byte4',
            String: 'String',
            Byte: 'Int8',
            Int8: 'Int8',
            Int16: 'Int16',
            Int32: 'Int32',
        }
        const _type = tsTypeMap[this.with({ optional: false }).tsType]
        if (_type !== undefined && (isNumberType(_type) || isStringType(_type) || isByte4Type(_type)))
            return _type
        else throw new Error(`Couldnt get typeValueType of ${this.rawType}`)
    }

    get literalTypedValueBlock(): Block {
        let body: CompilerCallback
        if (this.isArray) {
            body = (compiler: ITextCompiler) =>
                compiler.write(
                    'sizeType: "',
                    this.sizeTypeInfo.typeValueType,
                    '", value: ',
                    this.innerArrayTypeInfo.literalTypedValueBlock,
                    '[]',
                )
        } else {
            body = (compiler: ITextCompiler) =>
                compiler.write('type: "', this.typeValueType, '", value: ', this.tsType)
        }
        return new Block(body).with({ singleLine: true })
    }
}
