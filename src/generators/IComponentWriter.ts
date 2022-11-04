import { IGenWriterBase } from "./IGenWriterBase.ts";

export interface IComponentWriter {
    write(writer: IGenWriterBase): IGenWriterBase;
}