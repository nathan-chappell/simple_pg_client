import { DataTypeAdapter } from "../streams/dataTypeAdapter.ts";

const parseByte1 = (adapter: DataTypeAdapter) => adapter.readChar();
const parseInt8 = (adapter: DataTypeAdapter) => adapter.readInt8();
const parseInt16 = (adapter: DataTypeAdapter) => adapter.readInt16();
const parseInt32 = (adapter: DataTypeAdapter) => adapter.readInt32();
const parseString = (adapter: DataTypeAdapter) => adapter.readString();
const parse_NOT_IMPLEMENTED = (_: DataTypeAdapter) => { throw new Error("NOT IMPLEMENTED"); };

export default {
    parseByte1,
    parseInt8,
    parseInt16,
    parseInt32,
    parseString,
    parse_NOT_IMPLEMENTED,
};
