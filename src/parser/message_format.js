// Byten arrays have length given by Int32
// Int16[] arrays have length given by Int16
// Byte[][] has first dimension given by Int16, and each "row" is a Byten array

const frontEndFormat = [
    "Bind: Byte1('B') Int32 String String Int16[] Byte[][] Int16[]",
    "Close: Byte1('C') Int32 Byte1 String",
    "Describe: Byte1('D') Int32 Byte1 String",
    "Execute: Byte1('E') Int32 String Int32",
    "Flush: Byte1('H') Int32(4)",
    "FunctionCall: Byte1('F') Int32 Int32 Int16[] Int16 Byte[] Int16",
    "Parse: Byte1('P') Int32 String String Int16 Int32",
    "PasswordMessage: Byte1('p') Int32 String",
    "Query: Byte1('Q') Int32 String",
    // NOTE: startup is and always will be special...
    // "StartupMessage: Int32 Int32(196608) String[][] Byte(0)",
    "Sync: Byte1('S') Int32(4)",
    "Terminate: Byte1('X') Int32(4)"
]

const frontAndBackEndFormat = [
    "CopyData: Byte1('d') Byte[]",
    "CopyDone: Byte1('c') Int32(4)"
]

const backEndFormat = [
    "AuthenticationOk: Byte1('R') Int32(8) Int32(0)",
    "AuthenticationCleartextPassword: Byte1('R') Int32(8) Int32(3)",
    "AuthenticationMD5Password: Byte1('R') Int32(12) Int32(5) Byte4",
    "BackendKeyData: Byte1('K') Int32(12) Int32 Int32",
    "BindComplete: Byte1('2') Int32(4)",
    "CloseComplete: Byte1('3') Int32(4)",
    "CommandComplete: Byte1('C') Int32 String",
    "DataRow: Byte1('D') Int32 Int16 Byte[]",
    "EmptyQueryResponse: Byte1('I') Int32(4)",
    "ErrorResponse: Byte1('E') Int32 Byte1 String",
    "FunctionCallResponse: Byte1('V') Int32 Byte[]",
    "NegotiateProtocolVersion: Byte1('v') Int32 Int32 Int32 String",
    "NoData: Byte1('n') Int32(4)",
    "NoticeResponse: Byte1('N') Int32 Byte1 String",
    "NotificationResponse: Byte1('A') Int32 Int32 String String",
    "ParameterDescription: Byte1('t') Int32 Int16 Int32",
    "ParameterStatus: Byte1('S') Int32 String String",
    "ParseComplete: Byte1('1') Int32(4)",
    "PortalSuspended: Byte1('s') Int32(4)",
    "ReadyForQuery: Byte1('Z') Int32(5) Byte1",
    "RowDescription: Byte1('T') Int32 Int16 String Int32 Int16 Int32 Int16 Int32 Int16"
]

module.exports = {
    frontEndFormat,
    frontAndBackEndFormat,
    backEndFormat,
}