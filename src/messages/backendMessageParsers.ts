import { DataTypeAdapter } from "../streams/dataTypeAdapter.ts";
import { IBackendMessage } from "./backendFormats.generated.ts";

export const parseBackendMessage: (adapter: DataTypeAdapter) => Promise<IBackendMessage> = async (adapter) => {
    const messageType = await adapter.readChar();
    const length = await adapter.readInt32();
    const additionalProps = 

    return {
        messageType,
        length,
    };
};
