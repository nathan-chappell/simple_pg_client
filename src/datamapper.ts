/*
20	int8
21	int2
23	int4

700	float4
701	float8

18	    char
19	    name
25	    text
1043	varchar
*/

const _Int8 = 20
const _Int2 = 21
const _Int4 = 23

const _Float4 = 700
const _Float8 = 701

const _Char = 18
const _Name = 19
const _Text = 25
const _Varchar = 1043

import { IField } from './messages/messageFormats.generated.ts'

export function mapColumn(data: number[], field: IField): string | number {
    const strData = data.map(b => String.fromCharCode(b)).join('')
    switch (field.typeOid) {
        case _Int2:
        case _Int4:
        case _Int8:
            return parseInt(strData)
        case _Float4:
        case _Float8:
            return parseFloat(strData)
        case _Char:
        case _Name:
        case _Text:
        case _Varchar:
            return strData
        default:
            return data.map(c => `${c.toString(16)}`).join('')
    }
}
