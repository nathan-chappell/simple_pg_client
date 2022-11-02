/* DO NOT EDIT THIS FILE!!! */

import builtin from './builtinParsers.ts'
import { DataTypeAdapter } from "../streams/dataTypeAdapter.ts";
import {
    IBackendMessage,
    IBackendKeyData,
    IBindComplete,
    ICloseComplete,
    ICommandComplete,
    ICopyInResponse,
    ICopyOutResponse,
    ICopyBothResponse,
    IDataRow,
    IEmptyQueryResponse,
    IErrorResponse,
    INoData,
    INoticeResponse,
    INotificationResponse,
    IParameterDescription,
    IParameterStatus,
    IParseComplete,
    IPortalSuspended,
    IReadyForQuery,
    IRowDescriptionField,
    IRowDescription,
} from './backendFormats.generated.ts'

export const parseBackendKeyData: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<IBackendKeyData> = async (adapter, baseProps) => {
    const pid = await builtin.parseInt32(adapter);
    const key = await builtin.parseInt32(adapter);
    return {
        ...baseProps,
        pid,
        key,
    } as IBackendKeyData
}


export const parseBindComplete: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<IBindComplete> 
    = (_, baseProps) => Promise.resolve(baseProps as IBindComplete);


export const parseCloseComplete: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<ICloseComplete> 
    = (_, baseProps) => Promise.resolve(baseProps as ICloseComplete);


export const parseCommandComplete: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<ICommandComplete> = async (adapter, baseProps) => {
    const message = await builtin.parseString(adapter);
    return {
        ...baseProps,
        message,
    } as ICommandComplete
}


export const parseCopyInResponse: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<ICopyInResponse> = async (adapter, baseProps) => {
    const isBinary = await builtin.parseInt8(adapter);
    const formatCodes = await builtin.parse_NOT_IMPLEMENTED(adapter);
    return {
        ...baseProps,
        isBinary,
        formatCodes,
    } as ICopyInResponse
}


export const parseCopyOutResponse: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<ICopyOutResponse> = async (adapter, baseProps) => {
    const isBinary = await builtin.parseInt8(adapter);
    const formatCodes = await builtin.parse_NOT_IMPLEMENTED(adapter);
    return {
        ...baseProps,
        isBinary,
        formatCodes,
    } as ICopyOutResponse
}


export const parseCopyBothResponse: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<ICopyBothResponse> = async (adapter, baseProps) => {
    const isBinary = await builtin.parseInt8(adapter);
    const formatCodes = await builtin.parse_NOT_IMPLEMENTED(adapter);
    return {
        ...baseProps,
        isBinary,
        formatCodes,
    } as ICopyBothResponse
}


export const parseDataRow: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<IDataRow> = async (adapter, baseProps) => {
    const columns = await builtin.parse_NOT_IMPLEMENTED(adapter);
    return {
        ...baseProps,
        columns,
    } as IDataRow
}


export const parseEmptyQueryResponse: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<IEmptyQueryResponse> 
    = (_, baseProps) => Promise.resolve(baseProps as IEmptyQueryResponse);


export const parseErrorResponse: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<IErrorResponse> 
    = (_, baseProps) => Promise.resolve(baseProps as IErrorResponse);


export const parseNoData: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<INoData> 
    = (_, baseProps) => Promise.resolve(baseProps as INoData);


export const parseNoticeResponse: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<INoticeResponse> 
    = (_, baseProps) => Promise.resolve(baseProps as INoticeResponse);


export const parseNotificationResponse: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<INotificationResponse> = async (adapter, baseProps) => {
    const pid = await builtin.parseInt32(adapter);
    const channelName = await builtin.parseString(adapter);
    const message = await builtin.parseString(adapter);
    return {
        ...baseProps,
        pid,
        channelName,
        message,
    } as INotificationResponse
}


export const parseParameterDescription: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<IParameterDescription> = async (adapter, baseProps) => {
    const parameterTypes = await builtin.parse_NOT_IMPLEMENTED(adapter);
    return {
        ...baseProps,
        parameterTypes,
    } as IParameterDescription
}


export const parseParameterStatus: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<IParameterStatus> = async (adapter, baseProps) => {
    const name = await builtin.parseString(adapter);
    const value = await builtin.parseString(adapter);
    return {
        ...baseProps,
        name,
        value,
    } as IParameterStatus
}


export const parseParseComplete: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<IParseComplete> 
    = (_, baseProps) => Promise.resolve(baseProps as IParseComplete);


export const parsePortalSuspended: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<IPortalSuspended> 
    = (_, baseProps) => Promise.resolve(baseProps as IPortalSuspended);


export const parseReadyForQuery: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<IReadyForQuery> = async (adapter, baseProps) => {
    const status = await builtin.parseByte1(adapter);
    return {
        ...baseProps,
        status,
    } as IReadyForQuery
}


export const parseIRowDescriptionField: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<IRowDescriptionField> = async (adapter, baseProps) => {
    const columnAttributeNumber = await builtin.parseInt16(adapter);
    const typeOid = await builtin.parseInt32(adapter);
    const typeSize = await builtin.parseInt16(adapter);
    const typeModifier = await builtin.parseInt32(adapter);
    const isBinary = await builtin.parseInt16(adapter);
    return {
        ...baseProps,
        columnAttributeNumber,
        typeOid,
        typeSize,
        typeModifier,
        isBinary,
    } as IRowDescriptionField
}


export const parseRowDescription: (adapter: DataTypeAdapter, baseProps: IBackendMessage) => Promise<IRowDescription> = async (adapter, baseProps) => {
    const fields = await builtin.parse_NOT_IMPLEMENTED(adapter);
    return {
        ...baseProps,
        fields,
    } as IRowDescription
}