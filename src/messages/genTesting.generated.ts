/* DO NOT EDIT THIS FILE!!!  It has been generated for your pleasure. */
import { DataTypeAdapter } from '../streams/dataTypeAdapter.ts'
import { MessageWriterAdapter } from './messageWriterAdapter.ts'
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

//#region INTERFACES

export interface IBackendMessage {
    // Identifies the message as an authentication request.
    messageType: String
    // Length of message contents in bytes, including self.
    length:      Int32
} // IBackendMessage

export interface AuthenticationOk {
    // Identifies the message as an authentication request.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // Specifies that the authentication was successful.
    code:        Int32
} // AuthenticationOk

export interface AuthenticationKerberosV5 {
    // Identifies the message as an authentication request.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // Specifies that Kerberos V5 authentication is required.
    code:        Int32
} // AuthenticationKerberosV5

export interface AuthenticationCleartextPassword {
    // Identifies the message as an authentication request.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // Specifies that a clear-text password is required.
    code:        Int32
} // AuthenticationCleartextPassword

export interface AuthenticationMD5Password {
    // Identifies the message as an authentication request.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // Specifies that an MD5-encrypted password is required.
    code:        Int32
    // The salt to use when encrypting the password.
    salt:        Byte4
} // AuthenticationMD5Password

export interface AuthenticationSCMCredential {
    // Identifies the message as an authentication request.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // Specifies that an SCM credentials message is required.
    code:        Int32
} // AuthenticationSCMCredential

export interface AuthenticationGSS {
    // Identifies the message as an authentication request.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // Specifies that GSSAPI authentication is required.
    code:        Int32
} // AuthenticationGSS

export interface AuthenticationSSPI {
    // Identifies the message as an authentication request.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // Specifies that SSPI authentication is required.
    code:        Int32
} // AuthenticationSSPI

export interface AuthenticationSASL {
    // Identifies the message as an authentication request.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // Specifies that SASL authentication is required.
    code:        Int32
} // AuthenticationSASL

export interface BackendKeyData {
    // Identifies the message as cancellation key data. The frontend must save these values if it wishes
    // to be able to issue CancelRequest messages later.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // The process ID of this backend.
    pid:         Int32
    // The secret key of this backend.
    key:         Int32
} // BackendKeyData

export interface Bind {
    // Identifies the message as a Bind command.
    messageType:   Byte1
    // Length of message contents in bytes, including self.
    length:        Int32
    // The name of the destination portal (an empty string selects the unnamed portal).
    portalName:    String
    // The name of the source prepared statement (an empty string selects the unnamed prepared statement).
    statementName: String
    // The parameter format codes. Each must presently be zero (text) or one (binary).
    pFormats:      Int16[]
    // The parameters. [The number of parameter values that follow (possibly zero). This must match the
    // number of parameters needed by the query.]
    parameters:    Byte[][]
    // The result-column format codes. Each must presently be zero (text) or one (binary).
    rFormats:      Int16[]
} // Bind

export interface BindComplete {
    // Identifies the message as a Bind-complete indicator.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
} // BindComplete

export interface CancelRequest {
    // Length of message contents in bytes, including self.
    messageType: Int32
    // The cancel request code. The value is chosen to contain 1234 in the most significant 16 bits,
    // and 5678 in the least significant 16 bits. (To avoid confusion, this code must not be the same
    // as any protocol version number.)
    length:      Int32
    // The process ID of the target backend.
    pid:         Int32
    // The secret key for the target backend.
    key:         Int32
} // CancelRequest

export interface Close {
    // Identifies the message as a Close command.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // 'S' to close a prepared statement; or 'P' to close a portal.
    qType:       'S' | 'P'
    // The name of the prepared statement or portal to close (an empty string selects the unnamed prepared
    // statement or portal).
    name:        String
} // Close

export interface CloseComplete {
    // Identifies the message as a Close-complete indicator.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
} // CloseComplete

export interface CommandComplete {
    // Identifies the message as a command-completed response.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // The command tag. This is usually a single word that identifies which SQL command was completed.
    // * For an INSERT command, the tag is INSERT oid rows, where rows is the number of rows inserted.
    // oid used to be the object ID of the inserted row if rows was 1 and the target table had OIDs,
    // but OIDs system columns are not supported anymore; therefore oid is always 0.                
    // * For a DELETE command, the tag is DELETE rows where rows is the number of rows deleted.     
    // * For an UPDATE command, the tag is UPDATE rows where rows is the number of rows updated.    
    // * For a SELECT or CREATE TABLE AS command, the tag is SELECT rows where rows is the number of
    // rows retrieved.                                                                              
    // * For a MOVE command, the tag is MOVE rows where rows is the number of rows the cursor's position
    // has been changed by.                                                                         
    // * For a FETCH command, the tag is FETCH rows where rows is the number of rows that have been retrieved
    // from the cursor.                                                                             
    // * For a COPY command, the tag is COPY rows where rows is the number of rows copied. (Note: the
    // row count appears only in PostgreSQL 8.2 and later.)
    message:     String
} // CommandComplete

export interface CopyFail {
    // Identifies the message as a COPY-failure indicator.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // An error message to report as the cause of failure.
    message:     String
} // CopyFail

export interface CopyInResponse {
    // Identifies the message as a Start Copy In response. The frontend must now send copy-in data (if
    // not prepared to do so, send a CopyFail message).
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // 0 indicates the overall COPY format is textual (rows separated by newlines, columns separated
    // by separator characters, etc.). 1 indicates the overall copy format is binary (similar to DataRow
    // format). See COPY for more information.
    isBinary:    Int8
    // The format codes to be used for each column. Each must presently be zero (text) or one (binary).
    // All must be zero if the overall copy format is textual.
    formatCodes: Int16[]
} // CopyInResponse

export interface CopyOutResponse {
    // Identifies the message as a Start Copy Out response. This message will be followed by copy-out
    // data.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // 0 indicates the overall COPY format is textual (rows separated by newlines, columns separated
    // by separator characters, etc.). 1 indicates the overall copy format is binary (similar to DataRow
    // format). See COPY for more information.
    isBinary:    Int8
    // The format codes to be used for each column. Each must presently be zero (text) or one (binary).
    // All must be zero if the overall copy format is textual.
    formatCodes: Int16[]
} // CopyOutResponse

export interface CopyBothResponse {
    // Identifies the message as a Start Copy Both response. This message is used only for Streaming
    // Replication.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // 0 indicates the overall COPY format is textual (rows separated by newlines, columns separated
    // by separator characters, etc.). 1 indicates the overall copy format is binary (similar to DataRow
    // format). See COPY for more information.
    isBinary:    Int8
    // The format codes to be used for each column. Each must presently be zero (text) or one (binary).
    // All must be zero if the overall copy format is textual.
    formatCodes: Int16[]
} // CopyBothResponse

export interface DataRow {
    // Identifies the message as a data row.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // The number of column values that follow (possibly zero).
    columns:     Byte[][]
} // DataRow

export interface Describe {
    // Identifies the message as a Describe command.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // 'S' to describe a prepared statement; or 'P' to describe a portal.
    qType:       Byte1
    // The name of the prepared statement or portal to describe (an empty string selects the unnamed
    // prepared statement or portal).
    name:        String
} // Describe

export interface EmptyQueryResponse {
    // Identifies the message as a response to an empty query string. (This substitutes for CommandComplete.)
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
} // EmptyQueryResponse

export interface ErrorResponse {
    // Identifies the message as an error.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
} // ErrorResponse

export interface Execute {
    // Identifies the message as an Execute command.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // The name of the portal to execute (an empty string selects the unnamed portal).
    name:        String
    // Maximum number of rows to return, if portal contains a query that returns rows (ignored otherwise).
    // Zero denotes “no limit”.
    limit:       Int32
} // Execute

export interface Flush {
    // Identifies the message as a Flush command.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
} // Flush

export interface NoData {
    // Identifies the message as a no-data indicator.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
} // NoData

export interface NoticeResponse {
    // Identifies the message as a notice.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
} // NoticeResponse

export interface NotificationResponse {
    // Identifies the message as a notification response.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // The process ID of the notifying backend process.
    pid:         Int32
    // The name of the channel that the notify has been raised on.
    channelName: String
    // The “payload” string passed from the notifying process.
    message:     String
} // NotificationResponse

export interface ParameterDescription {
    // Identifies the message as a parameter description.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // OID of parameter data types. [The number of parameters used by the statement (can be zero).]
    pTypes:      Int32[]
} // ParameterDescription

export interface ParameterStatus {
    // Identifies the message as a run-time parameter status report.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // The name of the run-time parameter being reported.
    name:        String
    // The current value of the parameter.
    value:       String
} // ParameterStatus

export interface Parse {
    // Identifies the message as a Parse command.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // The name of the destination prepared statement (an empty string selects the unnamed prepared statement).
    name:        String
    // The query string to be parsed.
    query:       String
    // OID of parameter data types. [The number of parameter data types specified (can be zero). Note
    // that this is not an indication of the number of parameters that might appear in the query string,
    // only the number that the frontend wants to prespecify types for.]
    pTypes:      Int32[]
} // Parse

export interface ParseComplete {
    // Identifies the message as a Parse-complete indicator.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
} // ParseComplete

export interface PasswordMessage {
    // Identifies the message as a password response. Note that this is also used for GSSAPI, SSPI and
    // SASL response messages. The exact message type can be deduced from the context.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // The password (encrypted, if requested).
    password:    String
} // PasswordMessage

export interface PortalSuspended {
    // Identifies the message as a portal-suspended indicator. Note this only appears if an Execute message's
    // row-count limit was reached.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
} // PortalSuspended

export interface Query {
    // Identifies the message as a simple query.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // The query string itself.
    query:       String
} // Query

export interface ReadyForQuery {
    // Identifies the message type. ReadyForQuery is sent whenever the backend is ready for a new query
    // cycle.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // Current backend transaction status indicator. Possible values are 'I' if idle (not in a transaction
    // block); 'T' if in a transaction block; or 'E' if in a failed transaction block (queries will be
    // rejected until block is ended).
    status:      'I' | 'T' | 'E'
} // ReadyForQuery

export interface IField {
    // The field name.
    name:         String
    // If the field can be identified as a column of a specific table, the object ID of the table; otherwise
    // zero.
    tableOid:     Int32
    // If the field can be identified as a column of a specific table, the attribute number of the column;
    // otherwise zero.
    attrNo:       Int16
    // The object ID of the field's data type.
    typeOid:      Int32
    // The data type size (see pg_type.typlen). Note that negative values denote variable-width types.
    typeSize:     Int16
    // The type modifier (see pg_attribute.atttypmod). The meaning of the modifier is type-specific.
    typeModifier: Int32
    // The format code being used for the field. Currently will be zero (text) or one (binary). In a
    // RowDescription returned from the statement variant of Describe, the format code is not yet known
    // and will always be zero.
    isBinary:     Int16
} // IField

export interface RowDescription {
    // Identifies the message as a row description.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
    // Specifies the number of fields in a row (can be zero).
    fields:      IField[]
} // RowDescription

export interface SSLRequest {
    // Length of message contents in bytes, including self.
    messageType: Int32
    // The SSL request code. The value is chosen to contain 1234 in the most significant 16 bits, and
    // 5679 in the least significant 16 bits.(To avoid confusion, this code must not be the same as any
    // protocol version number.)
    length:      Int32
} // SSLRequest

export interface StartupMessage {
    // Length of message contents in bytes, including self.
    length:   Int32
    // The protocol version number. The most significant 16 bits are the major version number (3 for
    // the protocol described here). The least significant 16 bits are the minor version number (0 for
    // the protocol described here).
    protocol: Int32
} // StartupMessage

export interface Sync {
    // Identifies the message as a Sync command.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
} // Sync

export interface Terminate {
    // Identifies the message as a termination.
    messageType: Byte1
    // Length of message contents in bytes, including self.
    length:      Int32
} // Terminate


//#endregion

/* DO NOT EDIT THIS FILE!!!  It has been generated for your pleasure. */