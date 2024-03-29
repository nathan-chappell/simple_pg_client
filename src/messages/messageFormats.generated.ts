/* DO NOT EDIT THIS FILE!!!  It has been generated for your pleasure. */
// deno-lint-ignore-file no-inferrable-types require-await

import { DataTypeAdapter } from '../streams/dataTypeAdapter.ts'

import {
    Int32,
    Int16,
    Int8,
    Byte,
    Byte1,
    Byte4,
    String,
    parseInt32,
    parseInt16,
    parseInt8,
    parseByte,
    parseByte1,
    parseByte4,
    parseString,
} from './builtinTypes.generated.ts'



//#region IBackendMessage

// * @messageType: Identifies the message as an authentication request.
// * @length: Length of message contents in bytes, including self.
export interface IBackendMessage {
    messageType: String     // String
    length:      Int32      // Int32
} // IBackendMessage

export const parseIBackendMessage: (adapter: DataTypeAdapter) => Promise<IBackendMessage> = async (adapter) => {
    const messageType: String = await parseString(adapter)
    const length: Int32 = await parseInt32(adapter)
    return {
        messageType,
        length,
    }
}

// No type guard: no expected messageType

//#endregion

//#region AuthenticationOk

// * @messageType: Identifies the message as an authentication request.
// * @length: Length of message contents in bytes, including self.
// * @code: Specifies that the authentication was successful.
export interface AuthenticationOk {
    messageType: Byte1     // Byte1('R')
    length:      Int32     // Int32(8)
    code:        Int32     // Int32(0)
} // AuthenticationOk

// no parser for AuthenticationOk - authentication is handled separately

export function isAuthenticationOk(baseMessage: IBackendMessage): baseMessage is AuthenticationOk {
    return baseMessage.messageType === 'R'
}

//#endregion

//#region AuthenticationKerberosV5

// * @messageType: Identifies the message as an authentication request.
// * @length: Length of message contents in bytes, including self.
// * @code: Specifies that Kerberos V5 authentication is required.
export interface AuthenticationKerberosV5 {
    messageType: Byte1     // Byte1('R')
    length:      Int32     // Int32(8)
    code:        Int32     // Int32(2)
} // AuthenticationKerberosV5

// no parser for AuthenticationKerberosV5 - authentication is handled separately

export function isAuthenticationKerberosV5(baseMessage: IBackendMessage): baseMessage is AuthenticationKerberosV5 {
    return baseMessage.messageType === 'R'
}

//#endregion

//#region AuthenticationCleartextPassword

// * @messageType: Identifies the message as an authentication request.
// * @length: Length of message contents in bytes, including self.
// * @code: Specifies that a clear-text password is required.
export interface AuthenticationCleartextPassword {
    messageType: Byte1     // Byte1('R')
    length:      Int32     // Int32(8)
    code:        Int32     // Int32(3)
} // AuthenticationCleartextPassword

// no parser for AuthenticationCleartextPassword - authentication is handled separately

export function isAuthenticationCleartextPassword(baseMessage: IBackendMessage): baseMessage is AuthenticationCleartextPassword {
    return baseMessage.messageType === 'R'
}

//#endregion

//#region AuthenticationMD5Password

// * @messageType: Identifies the message as an authentication request.
// * @length: Length of message contents in bytes, including self.
// * @code: Specifies that an MD5-encrypted password is required.
// * @salt: The salt to use when encrypting the password.
export interface AuthenticationMD5Password {
    messageType: Byte1     // Byte1('R')
    length:      Int32     // Int32(12)
    code:        Int32     // Int32(5)
    salt:        Byte4     // Byte4
} // AuthenticationMD5Password

// no parser for AuthenticationMD5Password - authentication is handled separately

export function isAuthenticationMD5Password(baseMessage: IBackendMessage): baseMessage is AuthenticationMD5Password {
    return baseMessage.messageType === 'R'
}

//#endregion

//#region AuthenticationSCMCredential

// * @messageType: Identifies the message as an authentication request.
// * @length: Length of message contents in bytes, including self.
// * @code: Specifies that an SCM credentials message is required.
export interface AuthenticationSCMCredential {
    messageType: Byte1     // Byte1('R')
    length:      Int32     // Int32(8)
    code:        Int32     // Int32(6)
} // AuthenticationSCMCredential

// no parser for AuthenticationSCMCredential - authentication is handled separately

export function isAuthenticationSCMCredential(baseMessage: IBackendMessage): baseMessage is AuthenticationSCMCredential {
    return baseMessage.messageType === 'R'
}

//#endregion

//#region AuthenticationGSS

// * @messageType: Identifies the message as an authentication request.
// * @length: Length of message contents in bytes, including self.
// * @code: Specifies that GSSAPI authentication is required.
export interface AuthenticationGSS {
    messageType: Byte1     // Byte1('R')
    length:      Int32     // Int32(8)
    code:        Int32     // Int32(7)
} // AuthenticationGSS

// no parser for AuthenticationGSS - authentication is handled separately

export function isAuthenticationGSS(baseMessage: IBackendMessage): baseMessage is AuthenticationGSS {
    return baseMessage.messageType === 'R'
}

//#endregion

//#region AuthenticationSSPI

// * @messageType: Identifies the message as an authentication request.
// * @length: Length of message contents in bytes, including self.
// * @code: Specifies that SSPI authentication is required.
export interface AuthenticationSSPI {
    messageType: Byte1     // Byte1('R')
    length:      Int32     // Int32(8)
    code:        Int32     // Int32(9)
} // AuthenticationSSPI

// no parser for AuthenticationSSPI - authentication is handled separately

export function isAuthenticationSSPI(baseMessage: IBackendMessage): baseMessage is AuthenticationSSPI {
    return baseMessage.messageType === 'R'
}

//#endregion

//#region AuthenticationSASL

// * @messageType: Identifies the message as an authentication request.
// * @length: Length of message contents in bytes, including self.
// * @code: Specifies that SASL authentication is required.
export interface AuthenticationSASL {
    messageType: Byte1     // Byte1('R')
    length:      Int32     // Int32
    code:        Int32     // Int32(10)
} // AuthenticationSASL

// no parser for AuthenticationSASL - authentication is handled separately

export function isAuthenticationSASL(baseMessage: IBackendMessage): baseMessage is AuthenticationSASL {
    return baseMessage.messageType === 'R'
}

//#endregion

//#region BackendKeyData

// * @messageType: Identifies the message as cancellation key data. The frontend
//         must save these values if it wishes to be able to issue CancelRequest
//         messages later.
// * @length: Length of message contents in bytes, including self.
// * @pid: The process ID of this backend.
// * @key: The secret key of this backend.
export interface BackendKeyData {
    messageType: Byte1     // Byte1('K')
    length:      Int32     // Int32(12)
    pid:         Int32     // Int32
    key:         Int32     // Int32
} // BackendKeyData

export const parseBackendKeyData: (adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<BackendKeyData> = async (adapter, baseMessage) => {
    const pid: Int32 = await parseInt32(adapter)
    const key: Int32 = await parseInt32(adapter)
    return {
        ...baseMessage,
        pid,
        key,
    }
}

export function isBackendKeyData(baseMessage: IBackendMessage): baseMessage is BackendKeyData {
    return baseMessage.messageType === 'K'
}

//#endregion

//#region Bind

// * @messageType: Identifies the message as a Bind command.
// * @length: Length of message contents in bytes, including self.
// * @portalName: The name of the destination portal (an empty string selects
//         the unnamed portal).
// * @statementName: The name of the source prepared statement (an empty string
//         selects the unnamed prepared statement).
// * @pFormats: The parameter format codes. Each must presently be zero (text)
//         or one (binary).
// * @parameters: The parameters. [The number of parameter values that follow
//         (possibly zero). This must match the number of parameters needed by
//         the query.]
// * @rFormats: The result-column format codes. Each must presently be zero (text)
//         or one (binary).
export interface Bind {
    messageType:   Byte1        // Byte1('B')
    length:        Int32        // Int32
    portalName:    String       // String
    statementName: String       // String
    pFormats:      Int16[]      // Int16[Int16]
    parameters:    Byte[][]     // Byte[Int32][Int16]
    rFormats:      Int16[]      // Int16[Int16]
} // Bind

// no parser for Bind - currently only creating parsers for backend messages

export function isBind(baseMessage: IBackendMessage): baseMessage is Bind {
    return baseMessage.messageType === 'B'
}

//#endregion

//#region BindComplete

// * @messageType: Identifies the message as a Bind-complete indicator.
// * @length: Length of message contents in bytes, including self.
export interface BindComplete {
    messageType: Byte1     // Byte1('2')
    length:      Int32     // Int32(4)
} // BindComplete

export const parseBindComplete: (_adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<BindComplete> = async (_adapter, baseMessage) => baseMessage

export function isBindComplete(baseMessage: IBackendMessage): baseMessage is BindComplete {
    return baseMessage.messageType === '2'
}

//#endregion

//#region CancelRequest

// * @length: Length of message contents in bytes, including self.
// * @code: The cancel request code. The value is chosen to contain 1234 in the
//         most significant 16 bits, and 5678 in the least significant 16 bits.
//         (To avoid confusion, this code must not be the same as any protocol
//         version number.)
// * @pid: The process ID of the target backend.
// * @key: The secret key for the target backend.
export interface CancelRequest {
    length: Int32     // Int32(16)
    code:   Int32     // Int32(80877102)
    pid:    Int32     // Int32
    key:    Int32     // Int32
} // CancelRequest

// no parser for CancelRequest - currently only creating parsers for backend messages

// No type guard: messageType[0] === 'length'

//#endregion

//#region Close

// * @messageType: Identifies the message as a Close command.
// * @length: Length of message contents in bytes, including self.
// * @qType: 'S' to close a prepared statement; or 'P' to close a portal.
// * @name: The name of the prepared statement or portal to close (an empty string
//         selects the unnamed prepared statement or portal).
export interface Close {
    messageType: Byte1      // Byte1('C')
    length:      Int32      // Int32
    qType:       Byte1      // Byte1
    name:        String     // String
} // Close

// no parser for Close - currently only creating parsers for backend messages

export function isClose(baseMessage: IBackendMessage): baseMessage is Close {
    return baseMessage.messageType === 'C'
}

//#endregion

//#region CloseComplete

// * @messageType: Identifies the message as a Close-complete indicator.
// * @length: Length of message contents in bytes, including self.
export interface CloseComplete {
    messageType: Byte1     // Byte1('3')
    length:      Int32     // Int32(4)
} // CloseComplete

export const parseCloseComplete: (_adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<CloseComplete> = async (_adapter, baseMessage) => baseMessage

export function isCloseComplete(baseMessage: IBackendMessage): baseMessage is CloseComplete {
    return baseMessage.messageType === '3'
}

//#endregion

//#region CommandComplete

// * @messageType: Identifies the message as a command-completed response.
// * @length: Length of message contents in bytes, including self.
// * @message: The command tag. This is usually a single word that identifies
//         which SQL command was completed.                                 
//         * For an INSERT command, the tag is INSERT oid rows, where rows is
//         the number of rows inserted. oid used to be the object ID of the inserted
//         row if rows was 1 and the target table had OIDs, but OIDs system columns
//         are not supported anymore; therefore oid is always 0.            
//         * For a DELETE command, the tag is DELETE rows where rows is the number
//         of rows deleted.                                                 
//         * For an UPDATE command, the tag is UPDATE rows where rows is the
//         number of rows updated.                                          
//         * For a SELECT or CREATE TABLE AS command, the tag is SELECT rows
//         where rows is the number of rows retrieved.                      
//         * For a MOVE command, the tag is MOVE rows where rows is the number
//         of rows the cursor's position has been changed by.               
//         * For a FETCH command, the tag is FETCH rows where rows is the number
//         of rows that have been retrieved from the cursor.                
//         * For a COPY command, the tag is COPY rows where rows is the number
//         of rows copied. (Note: the row count appears only in PostgreSQL 8.2
//         and later.)
export interface CommandComplete {
    messageType: Byte1      // Byte1('C')
    length:      Int32      // Int32
    message:     String     // String
} // CommandComplete

export const parseCommandComplete: (adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<CommandComplete> = async (adapter, baseMessage) => {
    const message: String = await parseString(adapter)
    return {
        ...baseMessage,
        message,
    }
}

export function isCommandComplete(baseMessage: IBackendMessage): baseMessage is CommandComplete {
    return baseMessage.messageType === 'C'
}

//#endregion

//#region CopyFail

// * @messageType: Identifies the message as a COPY-failure indicator.
// * @length: Length of message contents in bytes, including self.
// * @message: An error message to report as the cause of failure.
export interface CopyFail {
    messageType: Byte1      // Byte1('f')
    length:      Int32      // Int32
    message:     String     // String
} // CopyFail

// no parser for CopyFail - currently only creating parsers for backend messages

export function isCopyFail(baseMessage: IBackendMessage): baseMessage is CopyFail {
    return baseMessage.messageType === 'f'
}

//#endregion

//#region CopyInResponse

// * @messageType: Identifies the message as a Start Copy In response. The frontend
//         must now send copy-in data (if not prepared to do so, send a CopyFail
//         message).
// * @length: Length of message contents in bytes, including self.
// * @isBinary: 0 indicates the overall COPY format is textual (rows separated
//         by newlines, columns separated by separator characters, etc.). 1 indicates
//         the overall copy format is binary (similar to DataRow format). See
//         COPY for more information.
// * @formatCodes: The format codes to be used for each column. Each must presently
//         be zero (text) or one (binary). All must be zero if the overall copy
//         format is textual.
export interface CopyInResponse {
    messageType: Byte1       // Byte1('G')
    length:      Int32       // Int32
    isBinary:    Int8        // Int8
    formatCodes: Int16[]     // Int16[Int16]
} // CopyInResponse

export const parseCopyInResponse: (adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<CopyInResponse> = async (adapter, baseMessage) => {
    const isBinary: Int8 = await parseInt8(adapter)
    const size0: Int16 = await parseInt16(adapter)
    const formatCodes: Int16[] = []
    for (let _2: number = 0; _2 < size0; ++_2) {
        const result1: Int16 = await parseInt16(adapter)
        formatCodes.push(result1)
    }
    return {
        ...baseMessage,
        isBinary,
        formatCodes,
    }
}

export function isCopyInResponse(baseMessage: IBackendMessage): baseMessage is CopyInResponse {
    return baseMessage.messageType === 'G'
}

//#endregion

//#region CopyOutResponse

// * @messageType: Identifies the message as a Start Copy Out response. This
//         message will be followed by copy-out data.
// * @length: Length of message contents in bytes, including self.
// * @isBinary: 0 indicates the overall COPY format is textual (rows separated
//         by newlines, columns separated by separator characters, etc.). 1 indicates
//         the overall copy format is binary (similar to DataRow format). See
//         COPY for more information.
// * @formatCodes: The format codes to be used for each column. Each must presently
//         be zero (text) or one (binary). All must be zero if the overall copy
//         format is textual.
export interface CopyOutResponse {
    messageType: Byte1       // Byte1('H')
    length:      Int32       // Int32
    isBinary:    Int8        // Int8
    formatCodes: Int16[]     // Int16[Int16]
} // CopyOutResponse

export const parseCopyOutResponse: (adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<CopyOutResponse> = async (adapter, baseMessage) => {
    const isBinary: Int8 = await parseInt8(adapter)
    const size3: Int16 = await parseInt16(adapter)
    const formatCodes: Int16[] = []
    for (let _5: number = 0; _5 < size3; ++_5) {
        const result4: Int16 = await parseInt16(adapter)
        formatCodes.push(result4)
    }
    return {
        ...baseMessage,
        isBinary,
        formatCodes,
    }
}

export function isCopyOutResponse(baseMessage: IBackendMessage): baseMessage is CopyOutResponse {
    return baseMessage.messageType === 'H'
}

//#endregion

//#region CopyBothResponse

// * @messageType: Identifies the message as a Start Copy Both response. This
//         message is used only for Streaming Replication.
// * @length: Length of message contents in bytes, including self.
// * @isBinary: 0 indicates the overall COPY format is textual (rows separated
//         by newlines, columns separated by separator characters, etc.). 1 indicates
//         the overall copy format is binary (similar to DataRow format). See
//         COPY for more information.
// * @formatCodes: The format codes to be used for each column. Each must presently
//         be zero (text) or one (binary). All must be zero if the overall copy
//         format is textual.
export interface CopyBothResponse {
    messageType: Byte1       // Byte1('W')
    length:      Int32       // Int32
    isBinary:    Int8        // Int8
    formatCodes: Int16[]     // Int16[Int16]
} // CopyBothResponse

export const parseCopyBothResponse: (adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<CopyBothResponse> = async (adapter, baseMessage) => {
    const isBinary: Int8 = await parseInt8(adapter)
    const size6: Int16 = await parseInt16(adapter)
    const formatCodes: Int16[] = []
    for (let _8: number = 0; _8 < size6; ++_8) {
        const result7: Int16 = await parseInt16(adapter)
        formatCodes.push(result7)
    }
    return {
        ...baseMessage,
        isBinary,
        formatCodes,
    }
}

export function isCopyBothResponse(baseMessage: IBackendMessage): baseMessage is CopyBothResponse {
    return baseMessage.messageType === 'W'
}

//#endregion

//#region DataRow

// * @messageType: Identifies the message as a data row.
// * @length: Length of message contents in bytes, including self.
// * @columns: The number of column values that follow (possibly zero).
export interface DataRow {
    messageType: Byte1        // Byte1('D')
    length:      Int32        // Int32
    columns:     Byte[][]     // Byte[Int32][Int16]
} // DataRow

export const parseDataRow: (adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<DataRow> = async (adapter, baseMessage) => {
    const size9: Int16 = await parseInt16(adapter)
    const columns: Byte[][] = []
    for (let _11: number = 0; _11 < size9; ++_11) {
        const size12: Int32 = await parseInt32(adapter)
        const result10: Byte[] = []
        for (let _14: number = 0; _14 < size12; ++_14) {
            const result13: Byte = await parseByte(adapter)
            result10.push(result13)
        }
        columns.push(result10)
    }
    return {
        ...baseMessage,
        columns,
    }
}

export function isDataRow(baseMessage: IBackendMessage): baseMessage is DataRow {
    return baseMessage.messageType === 'D'
}

//#endregion

//#region Describe

// * @messageType: Identifies the message as a Describe command.
// * @length: Length of message contents in bytes, including self.
// * @qType: 'S' to describe a prepared statement; or 'P' to describe a portal.
// * @name: The name of the prepared statement or portal to describe (an empty
//         string selects the unnamed prepared statement or portal).
export interface Describe {
    messageType: Byte1      // Byte1('D')
    length:      Int32      // Int32
    qType:       Byte1      // Byte1
    name:        String     // String
} // Describe

// no parser for Describe - currently only creating parsers for backend messages

export function isDescribe(baseMessage: IBackendMessage): baseMessage is Describe {
    return baseMessage.messageType === 'D'
}

//#endregion

//#region EmptyQueryResponse

// * @messageType: Identifies the message as a response to an empty query string.
//         (This substitutes for CommandComplete.)
// * @length: Length of message contents in bytes, including self.
export interface EmptyQueryResponse {
    messageType: Byte1     // Byte1('I')
    length:      Int32     // Int32(4)
} // EmptyQueryResponse

export const parseEmptyQueryResponse: (_adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<EmptyQueryResponse> = async (_adapter, baseMessage) => baseMessage

export function isEmptyQueryResponse(baseMessage: IBackendMessage): baseMessage is EmptyQueryResponse {
    return baseMessage.messageType === 'I'
}

//#endregion

//#region ErrorResponse

// * @messageType: Identifies the message as an error.
// * @length: Length of message contents in bytes, including self.
export interface ErrorResponse {
    messageType: Byte1     // Byte1('E')
    length:      Int32     // Int32
} // ErrorResponse

export const parseErrorResponse: (_adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<ErrorResponse> = async (_adapter, baseMessage) => baseMessage

export function isErrorResponse(baseMessage: IBackendMessage): baseMessage is ErrorResponse {
    return baseMessage.messageType === 'E'
}

//#endregion

//#region Execute

// * @messageType: Identifies the message as an Execute command.
// * @length: Length of message contents in bytes, including self.
// * @name: The name of the portal to execute (an empty string selects the unnamed
//         portal).
// * @limit: Maximum number of rows to return, if portal contains a query that
//         returns rows (ignored otherwise). Zero denotes “no limit”.
export interface Execute {
    messageType: Byte1      // Byte1('E')
    length:      Int32      // Int32
    name:        String     // String
    limit:       Int32      // Int32
} // Execute

// no parser for Execute - currently only creating parsers for backend messages

export function isExecute(baseMessage: IBackendMessage): baseMessage is Execute {
    return baseMessage.messageType === 'E'
}

//#endregion

//#region Flush

// * @messageType: Identifies the message as a Flush command.
// * @length: Length of message contents in bytes, including self.
export interface Flush {
    messageType: Byte1     // Byte1('H')
    length:      Int32     // Int32(4)
} // Flush

// no parser for Flush - currently only creating parsers for backend messages

export function isFlush(baseMessage: IBackendMessage): baseMessage is Flush {
    return baseMessage.messageType === 'H'
}

//#endregion

//#region NoData

// * @messageType: Identifies the message as a no-data indicator.
// * @length: Length of message contents in bytes, including self.
export interface NoData {
    messageType: Byte1     // Byte1('n')
    length:      Int32     // Int32(4)
} // NoData

export const parseNoData: (_adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<NoData> = async (_adapter, baseMessage) => baseMessage

export function isNoData(baseMessage: IBackendMessage): baseMessage is NoData {
    return baseMessage.messageType === 'n'
}

//#endregion

//#region NoticeResponse

// * @messageType: Identifies the message as a notice.
// * @length: Length of message contents in bytes, including self.
export interface NoticeResponse {
    messageType: Byte1     // Byte1('N')
    length:      Int32     // Int32
} // NoticeResponse

export const parseNoticeResponse: (_adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<NoticeResponse> = async (_adapter, baseMessage) => baseMessage

export function isNoticeResponse(baseMessage: IBackendMessage): baseMessage is NoticeResponse {
    return baseMessage.messageType === 'N'
}

//#endregion

//#region NotificationResponse

// * @messageType: Identifies the message as a notification response.
// * @length: Length of message contents in bytes, including self.
// * @pid: The process ID of the notifying backend process.
// * @channelName: The name of the channel that the notify has been raised on.
// * @message: The “payload” string passed from the notifying process.
export interface NotificationResponse {
    messageType: Byte1      // Byte1('A')
    length:      Int32      // Int32
    pid:         Int32      // Int32
    channelName: String     // String
    message:     String     // String
} // NotificationResponse

export const parseNotificationResponse: (adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<NotificationResponse> = async (adapter, baseMessage) => {
    const pid: Int32 = await parseInt32(adapter)
    const channelName: String = await parseString(adapter)
    const message: String = await parseString(adapter)
    return {
        ...baseMessage,
        pid,
        channelName,
        message,
    }
}

export function isNotificationResponse(baseMessage: IBackendMessage): baseMessage is NotificationResponse {
    return baseMessage.messageType === 'A'
}

//#endregion

//#region ParameterDescription

// * @messageType: Identifies the message as a parameter description.
// * @length: Length of message contents in bytes, including self.
// * @pTypes: OID of parameter data types. [The number of parameters used by
//         the statement (can be zero).]
export interface ParameterDescription {
    messageType: Byte1       // Byte1('t')
    length:      Int32       // Int32
    pTypes:      Int32[]     // Int32[Int16]
} // ParameterDescription

export const parseParameterDescription: (adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<ParameterDescription> = async (adapter, baseMessage) => {
    const size15: Int16 = await parseInt16(adapter)
    const pTypes: Int32[] = []
    for (let _17: number = 0; _17 < size15; ++_17) {
        const result16: Int32 = await parseInt32(adapter)
        pTypes.push(result16)
    }
    return {
        ...baseMessage,
        pTypes,
    }
}

export function isParameterDescription(baseMessage: IBackendMessage): baseMessage is ParameterDescription {
    return baseMessage.messageType === 't'
}

//#endregion

//#region ParameterStatus

// * @messageType: Identifies the message as a run-time parameter status report.
// * @length: Length of message contents in bytes, including self.
// * @name: The name of the run-time parameter being reported.
// * @value: The current value of the parameter.
export interface ParameterStatus {
    messageType: Byte1      // Byte1('S')
    length:      Int32      // Int32
    name:        String     // String
    value:       String     // String
} // ParameterStatus

export const parseParameterStatus: (adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<ParameterStatus> = async (adapter, baseMessage) => {
    const name: String = await parseString(adapter)
    const value: String = await parseString(adapter)
    return {
        ...baseMessage,
        name,
        value,
    }
}

export function isParameterStatus(baseMessage: IBackendMessage): baseMessage is ParameterStatus {
    return baseMessage.messageType === 'S'
}

//#endregion

//#region Parse

// * @messageType: Identifies the message as a Parse command.
// * @length: Length of message contents in bytes, including self.
// * @name: The name of the destination prepared statement (an empty string selects
//         the unnamed prepared statement).
// * @query: The query string to be parsed.
// * @pTypes: OID of parameter data types. [The number of parameter data types
//         specified (can be zero). Note that this is not an indication of the
//         number of parameters that might appear in the query string, only the
//         number that the frontend wants to prespecify types for.]
export interface Parse {
    messageType: Byte1       // Byte1('P')
    length:      Int32       // Int32
    name:        String      // String
    query:       String      // String
    pTypes:      Int32[]     // Int32[Int16]
} // Parse

// no parser for Parse - currently only creating parsers for backend messages

export function isParse(baseMessage: IBackendMessage): baseMessage is Parse {
    return baseMessage.messageType === 'P'
}

//#endregion

//#region ParseComplete

// * @messageType: Identifies the message as a Parse-complete indicator.
// * @length: Length of message contents in bytes, including self.
export interface ParseComplete {
    messageType: Byte1     // Byte1('1')
    length:      Int32     // Int32(4)
} // ParseComplete

export const parseParseComplete: (_adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<ParseComplete> = async (_adapter, baseMessage) => baseMessage

export function isParseComplete(baseMessage: IBackendMessage): baseMessage is ParseComplete {
    return baseMessage.messageType === '1'
}

//#endregion

//#region PasswordMessage

// * @messageType: Identifies the message as a password response. Note that this
//         is also used for GSSAPI, SSPI and SASL response messages. The exact
//         message type can be deduced from the context.
// * @length: Length of message contents in bytes, including self.
// * @password: The password (encrypted, if requested).
export interface PasswordMessage {
    messageType: Byte1      // Byte1('p')
    length:      Int32      // Int32
    password:    String     // String
} // PasswordMessage

// no parser for PasswordMessage - currently only creating parsers for backend messages

export function isPasswordMessage(baseMessage: IBackendMessage): baseMessage is PasswordMessage {
    return baseMessage.messageType === 'p'
}

//#endregion

//#region PortalSuspended

// * @messageType: Identifies the message as a portal-suspended indicator. Note
//         this only appears if an Execute message's row-count limit was reached.
// * @length: Length of message contents in bytes, including self.
export interface PortalSuspended {
    messageType: Byte1     // Byte1('s')
    length:      Int32     // Int32(4)
} // PortalSuspended

export const parsePortalSuspended: (_adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<PortalSuspended> = async (_adapter, baseMessage) => baseMessage

export function isPortalSuspended(baseMessage: IBackendMessage): baseMessage is PortalSuspended {
    return baseMessage.messageType === 's'
}

//#endregion

//#region Query

// * @messageType: Identifies the message as a simple query.
// * @length: Length of message contents in bytes, including self.
// * @query: The query string itself.
export interface Query {
    messageType: Byte1      // Byte1('Q')
    length:      Int32      // Int32
    query:       String     // String
} // Query

// no parser for Query - currently only creating parsers for backend messages

export function isQuery(baseMessage: IBackendMessage): baseMessage is Query {
    return baseMessage.messageType === 'Q'
}

//#endregion

//#region ReadyForQuery

// * @messageType: Identifies the message type. ReadyForQuery is sent whenever
//         the backend is ready for a new query cycle.
// * @length: Length of message contents in bytes, including self.
// * @status: Current backend transaction status indicator. Possible values are
//         'I' if idle (not in a transaction block); 'T' if in a transaction
//         block; or 'E' if in a failed transaction block (queries will be rejected
//         until block is ended).
export interface ReadyForQuery {
    messageType: Byte1     // Byte1('Z')
    length:      Int32     // Int32(5)
    status:      Byte1     // Byte1
} // ReadyForQuery

export const parseReadyForQuery: (adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<ReadyForQuery> = async (adapter, baseMessage) => {
    const status: Byte1 = await parseByte1(adapter)
    return {
        ...baseMessage,
        status,
    }
}

export function isReadyForQuery(baseMessage: IBackendMessage): baseMessage is ReadyForQuery {
    return baseMessage.messageType === 'Z'
}

//#endregion

//#region IField

// * @name: The field name.
// * @tableOid: If the field can be identified as a column of a specific table,
//         the object ID of the table; otherwise zero.
// * @attrNo: If the field can be identified as a column of a specific table,
//         the attribute number of the column; otherwise zero.
// * @typeOid: The object ID of the field's data type.
// * @typeSize: The data type size (see pg_type.typlen). Note that negative values
//         denote variable-width types.
// * @typeModifier: The type modifier (see pg_attribute.atttypmod). The meaning
//         of the modifier is type-specific.
// * @isBinary: The format code being used for the field. Currently will be zero
//         (text) or one (binary). In a RowDescription returned from the statement
//         variant of Describe, the format code is not yet known and will always
//         be zero.
export interface IField {
    name:         String     // String
    tableOid:     Int32      // Int32
    attrNo:       Int16      // Int16
    typeOid:      Int32      // Int32
    typeSize:     Int16      // Int16
    typeModifier: Int32      // Int32
    isBinary:     Int16      // Int16
} // IField

export const parseIField: (adapter: DataTypeAdapter) => Promise<IField> = async (adapter) => {
    const name: String = await parseString(adapter)
    const tableOid: Int32 = await parseInt32(adapter)
    const attrNo: Int16 = await parseInt16(adapter)
    const typeOid: Int32 = await parseInt32(adapter)
    const typeSize: Int16 = await parseInt16(adapter)
    const typeModifier: Int32 = await parseInt32(adapter)
    const isBinary: Int16 = await parseInt16(adapter)
    return {
        name,
        tableOid,
        attrNo,
        typeOid,
        typeSize,
        typeModifier,
        isBinary,
    }
}

// No type guard: messageType[0] === 'name'

//#endregion

//#region RowDescription

// * @messageType: Identifies the message as a row description.
// * @length: Length of message contents in bytes, including self.
// * @fields: Specifies the number of fields in a row (can be zero).
export interface RowDescription {
    messageType: Byte1        // Byte1('T')
    length:      Int32        // Int32
    fields:      IField[]     // IField[Int16]
} // RowDescription

export const parseRowDescription: (adapter: DataTypeAdapter, baseMessage: IBackendMessage) => Promise<RowDescription> = async (adapter, baseMessage) => {
    const size18: Int16 = await parseInt16(adapter)
    const fields: IField[] = []
    for (let _20: number = 0; _20 < size18; ++_20) {
        const result19: IField = await parseIField(adapter)
        fields.push(result19)
    }
    return {
        ...baseMessage,
        fields,
    }
}

export function isRowDescription(baseMessage: IBackendMessage): baseMessage is RowDescription {
    return baseMessage.messageType === 'T'
}

//#endregion

//#region SSLRequest

// * @messageType: Length of message contents in bytes, including self.
// * @length: The SSL request code. The value is chosen to contain 1234 in the
//         most significant 16 bits, and 5679 in the least significant 16 bits.(To
//         avoid confusion, this code must not be the same as any protocol version
//         number.)
export interface SSLRequest {
    messageType: Int32     // Int32(8)
    length:      Int32     // Int32(80877103)
} // SSLRequest

// no parser for SSLRequest - currently only creating parsers for backend messages

// No type guard: itemType: Int32

//#endregion

//#region StartupMessage

// * @length: Length of message contents in bytes, including self.
// * @protocol: The protocol version number. The most significant 16 bits are
//         the major version number (3 for the protocol described here). The
//         least significant 16 bits are the minor version number (0 for the
//         protocol described here).
export interface StartupMessage {
    length:   Int32     // Int32
    protocol: Int32     // Int32(196608)
} // StartupMessage

// no parser for StartupMessage - currently only creating parsers for backend messages

// No type guard: messageType[0] === 'length'

//#endregion

//#region Sync

// * @messageType: Identifies the message as a Sync command.
// * @length: Length of message contents in bytes, including self.
export interface Sync {
    messageType: Byte1     // Byte1('S')
    length:      Int32     // Int32(4)
} // Sync

// no parser for Sync - currently only creating parsers for backend messages

export function isSync(baseMessage: IBackendMessage): baseMessage is Sync {
    return baseMessage.messageType === 'S'
}

//#endregion

//#region Terminate

// * @messageType: Identifies the message as a termination.
// * @length: Length of message contents in bytes, including self.
export interface Terminate {
    messageType: Byte1     // Byte1('X')
    length:      Int32     // Int32(4)
} // Terminate

// no parser for Terminate - currently only creating parsers for backend messages

export function isTerminate(baseMessage: IBackendMessage): baseMessage is Terminate {
    return baseMessage.messageType === 'X'
}

//#endregion

/* DO NOT EDIT THIS FILE!!!  It has been generated for your pleasure. */