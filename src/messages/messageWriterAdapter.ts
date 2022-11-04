import { Byte } from "./builtinTypes.generated.ts";

type NumberType = "Byte" | "Int8" | "Int16" | "Int32";
type StringType = "String" | "Char";

export interface ITypedNumberValue {
  name?: string;
  type: NumberType;
  value: number;
}

export interface ITypedStringValue {
  name?: string;
  type: StringType;
  value: string;
}

export interface ITypedValueArray {
  name?: string;
  sizeType: 'Int16' | 'Int32';
  value: ITypedNumberValue[] | ITypedStringValue[] | ITypedValueArray[];
}

export type ITypedValue =
  | ITypedNumberValue
  | ITypedStringValue
//   | ITypedValueArray;

const l8 = (x: number) => x % 256;
const b0 = (x: number) => l8(x >> (8 * 3));
const b1 = (x: number) => l8(x >> (8 * 2));
const b2 = (x: number) => l8(x >> (8 * 1));
const b3 = (x: number) => l8(x >> (8 * 0));

export const toByteArray: (tv: ITypedValue) => Byte[] = (tv) => {
  // prettier-ignore
  switch (tv.type) {
    case "Int8":
      return [b3].map((b) => b(tv.value));
    case "Int16":
      return [b2, b3].map((b) => b(tv.value));
    case "Int32":
      return [b0, b1, b2, b3].map((b) => b(tv.value));
    case "Char":
    case "String":
      return [...tv.value].map((c) => c.charCodeAt(0));
    default:
      throw new Error(`[toByteArray] couldn't byteify ${JSON.stringify(tv)}`);
  }
};

export class MessageWriterAdapter {
  writer: WritableStreamDefaultWriter;

  constructor(writable: WritableStream<Byte>) {
    this.writer = writable.getWriter();
  }

  writeMessage(message: ITypedValue[]): Promise<void> {
    const lengthIndex = message.findIndex((tv) => tv.name === "length");
    if (lengthIndex === -1) {
      throw new Error(
        `[MessageWriterAdapter.writeMessage] all messages must have a "length" value`,
      );
    }
    const lengthType = message[lengthIndex].type;
    if (lengthType !== "Int32") {
      throw new Error(
        `[MessageWriterAdapter.writeMessage] only length types of Int32 are expected`,
      );
    }
    const byteArrays = message.map(toByteArray);
    const length = byteArrays.reduce((acc, a) => acc + a.length, 0);
    byteArrays[lengthIndex] = toByteArray(
      { type: lengthType, value: length } as ITypedNumberValue,
    );
    const bytes = Uint8Array.from(byteArrays.flat());
    return this.writer.write(bytes);
  }
}
