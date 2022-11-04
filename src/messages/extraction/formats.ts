export interface IProperty {
    name: string
    type: string
    definition: string
}

export interface IMessageDef {
    internal?: boolean
    backend?: boolean
    frontend?: boolean
    title: string
    definition: IProperty[]
}

export const formats: IMessageDef[] = [
    {
        internal: true,
        backend: true,
        "title": "IBackendMessage",
        "definition": [
            {
                "name": "messageType",
                "type": "String",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
        // {
        //     internal: true,
        //     backend: true,
        //     "title": "IAuthenticationMessage",
        //     "definition": [
        //         {
        //             "name": "messageType",
        //             "type": "String",
        //             "definition": "Identifies the message as an authentication request.",
        //         },
        //         {
        //             "name": "length",
        //             "type": "Int32",
        //             "definition": "Length of message contents in bytes, including self.",
        //         },
        //         {
        //             "name": "code",
        //             "type": "Int32",
        //             "definition": "Specifies that the authentication was successful.",
        //         },
        //     ],
        // },
    {
        backend: true,
        "title": "AuthenticationOk",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "name": "length",
                "type": "Int32(8)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "code",
                "type": "Int32(0)",
                "definition": "Specifies that the authentication was successful.",
            },
        ],
    },
    {
        backend: true,
        "title": "AuthenticationKerberosV5",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "name": "length",
                "type": "Int32(8)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "code",
                "type": "Int32(2)",
                "definition": "Specifies that Kerberos V5 authentication is required.",
            },
        ],
    },
    {
        backend: true,
        "title": "AuthenticationCleartextPassword",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "name": "length",
                "type": "Int32(8)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "code",
                "type": "Int32(3)",
                "definition": "Specifies that a clear-text password is required.",
            },
        ],
    },
    {
        backend: true,
        "title": "AuthenticationMD5Password",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "name": "length",
                "type": "Int32(12)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "code",
                "type": "Int32(5)",
                "definition": "Specifies that an MD5-encrypted password is required.",
            },
            {
                "name": "salt",
                "type": "Byte4",
                "definition": "The salt to use when encrypting the password.",
            },
        ],
    },
    {
        backend: true,
        "title": "AuthenticationSCMCredential",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "name": "length",
                "type": "Int32(8)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "code",
                "type": "Int32(6)",
                "definition": "Specifies that an SCM credentials message is required.",
            },
        ],
    },
    {
        backend: true,
        "title": "AuthenticationGSS",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "name": "length",
                "type": "Int32(8)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "code",
                "type": "Int32(7)",
                "definition": "Specifies that GSSAPI authentication is required.",
            },
        ],
    },
    // {
    //      backend: true,
    //     "title": "AuthenticationGSSContinue",
    //     "definition": [
    //         {
    //             "name": "messageType",
    //             "type": "Byte1('R')",
    //             "definition": "Identifies the message as an authentication request.",
    //         },
    //         {
    //             "name": "length",
    //             "type": "Int32",
    //             "definition": "Length of message contents in bytes, including self.",
    //         },
    //         {
    //             "name": "code",
    //             "type": "Int32(8)",
    //             "definition": "Specifies that this message contains GSSAPI or SSPI data.",
    //         },
    //         {
    //             "name": "data",
    //             "type": "Byten",
    //             "definition": "GSSAPI or SSPI authentication data.",
    //         },
    //     ],
    // },
    {
        backend: true,
        "title": "AuthenticationSSPI",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "name": "length",
                "type": "Int32(8)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "code",
                "type": "Int32(9)",
                "definition": "Specifies that SSPI authentication is required.",
            },
        ],
    },
    {
        backend: true,
        "title": "AuthenticationSASL",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "code",
                "type": "Int32(10)",
                "definition": "Specifies that SASL authentication is required.",
            },
        ],
    },
    // {
    //      backend: true,
    //     "title": "AuthenticationSASLContinue",
    //     "definition": [
    //         {
    //             "name": "messageType",
    //             "type": "Byte1('R')",
    //             "definition": "Identifies the message as an authentication request.",
    //         },
    //         {
    //             "name": "length",
    //             "type": "Int32",
    //             "definition": "Length of message contents in bytes, including self.",
    //         },
    //         {
    //             "name": "code",
    //             "type": "Int32(11)",
    //             "definition": "Specifies that this message contains a SASL challenge.",
    //         },
    //         {
    //             "name": "data",
    //             "type": "Byten",
    //             "definition": "SASL data, specific to the SASL mechanism being used.",
    //         },
    //     ],
    // },
    // {
    //      backend: true,
    //     "title": "AuthenticationSASLFinal",
    //     "definition": [
    //         {
    //             "name": "messageType",
    //             "type": "Byte1('R')",
    //             "definition": "Identifies the message as an authentication request.",
    //         },
    //         {
    //             "name": "length",
    //             "type": "Int32",
    //             "definition": "Length of message contents in bytes, including self.",
    //         },
    //         {
    //             "name": "code",
    //             "type": "Int32(12)",
    //             "definition": "Specifies that SASL authentication has completed.",
    //         },
    //         {
    //             "name": "data",
    //             "type": "Byten",
    //             "definition": 'SASL outcome "additional data", specific to the SASL mechanism being used.',
    //         },
    //     ],
    // },
    {
        backend: true,
        "title": "BackendKeyData",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('K')",
                "definition": "Identifies the message as cancellation key data. The frontend must save these values if it wishes to be able to issue CancelRequest messages later.",
            },
            {
                "name": "length",
                "type": "Int32(12)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "pid",
                "type": "Int32",
                "definition": "The process ID of this backend.",
            },
            {
                "name": "key",
                "type": "Int32",
                "definition": "The secret key of this backend.",
            },
        ],
    },
    {
        frontend: true,
        "title": "Bind",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('B')",
                "definition": "Identifies the message as a Bind command.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "portalName",
                "type": "String",
                "definition": "The name of the destination portal (an empty string selects the unnamed portal).",
            },
            {
                "name": "statementName",
                "type": "String",
                "definition": "The name of the source prepared statement (an empty string selects the unnamed prepared statement).",
            },
            // {
            //     "name": "",
            //     "type": "Int16",
            //     "definition": "The number of parameter format codes that follow (denoted C below). This can be zero to indicate that there are no parameters or that the parameters all use the default format (text); or one, in which case the specified format code is applied to all parameters; or it can equal the actual number of parameters.",
            // },
            {
                "name": "pFormats",
                "type": "Int16[Int16]",
                "definition": "The parameter format codes. Each must presently be zero (text) or one (binary).",
            },
            {
                "name": "parameters",
                "type": "Byte[Int32][Int16]",
                "definition": "The parameters. [The number of parameter values that follow (possibly zero). This must match the number of parameters needed by the query.]",
            },
            {
                "name": "rFormats",
                "type": "Int16[Int16]",
                "definition": "The result-column format codes. Each must presently be zero (text) or one (binary).",
            },
        ],
    },
    {
        backend: true,
        "title": "BindComplete",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('2')",
                "definition": "Identifies the message as a Bind-complete indicator.",
            },
            {
                "name": "length",
                "type": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        frontend: true,
        "title": "CancelRequest",
        "definition": [
            {
                "name": "messageType",
                "type": "Int32(16)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "length",
                "type": "Int32(80877102)",
                "definition": "The cancel request code. The value is chosen to contain 1234 in the most significant 16 bits, and 5678 in the least significant 16 bits. (To avoid confusion, this code must not be the same as any protocol version number.)",
            },
            {
                "name": "pid",
                "type": "Int32",
                "definition": "The process ID of the target backend.",
            },
            {
                "name": "key",
                "type": "Int32",
                "definition": "The secret key for the target backend.",
            },
        ],
    },
    {
        frontend: true,
        "title": "Close",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('C')",
                "definition": "Identifies the message as a Close command.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "qType",
                "type": "'S' | 'P'",
                "definition": "'S' to close a prepared statement; or 'P' to close a portal.",
            },
            {
                "name": "name",
                "type": "String",
                "definition": "The name of the prepared statement or portal to close (an empty string selects the unnamed prepared statement or portal).",
            },
        ],
    },
    {
        backend: true,
        "title": "CloseComplete",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('3')",
                "definition": "Identifies the message as a Close-complete indicator.",
            },
            {
                "name": "length",
                "type": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        backend: true,
        "title": "CommandComplete",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('C')",
                "definition": "Identifies the message as a command-completed response.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "message",
                "type": "String",
                "definition": "The command tag. This is usually a single word that identifies which SQL command was completed.\n\nFor an INSERT command, the tag is INSERT oid rows, where rows is the number of rows inserted. oid used to be the object ID of the inserted row if rows was 1 and the target table had OIDs, but OIDs system columns are not supported anymore; therefore oid is always 0.\n\nFor a DELETE command, the tag is DELETE rows where rows is the number of rows deleted.\n\nFor an UPDATE command, the tag is UPDATE rows where rows is the number of rows updated.\n\nFor a SELECT or CREATE TABLE AS command, the tag is SELECT rows where rows is the number of rows retrieved.\n\nFor a MOVE command, the tag is MOVE rows where rows is the number of rows the cursor's position has been changed by.\n\nFor a FETCH command, the tag is FETCH rows where rows is the number of rows that have been retrieved from the cursor.\n\nFor a COPY command, the tag is COPY rows where rows is the number of rows copied. (Note: the row count appears only in PostgreSQL 8.2 and later.)",
            },
        ],
    },
    // {
    //     "title": "CopyData (F & B)",
    //     "definition": [
    //         {
    //             "name": "messageType",
    //             "type": "Byte1('d')",
    //             "definition": "Identifies the message as COPY data.",
    //         },
    //         {
    //             "name": "length",
    //             "type": "Int32",
    //             "definition": "Length of message contents in bytes, including self.",
    //         },
    //         {
    //             "name": "data",
    //             "type": "Byten",
    //             "definition": "Data that forms part of a COPY data stream. Messages sent from the backend will always correspond to single data rows, but messages sent by frontends might divide the data stream arbitrarily.",
    //         },
    //     ],
    // },
    // {
    //     "title": "CopyDone (F & B)",
    //     "definition": [
    //         {
    //             "name": "messageType",
    //             "type": "Byte1('c')",
    //             "definition": "Identifies the message as a COPY-complete indicator.",
    //         },
    //         {
    //             "name": "length",
    //             "type": "Int32(4)",
    //             "definition": "Length of message contents in bytes, including self.",
    //         },
    //     ],
    // },
    {
        frontend: true,
        "title": "CopyFail",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('f')",
                "definition": "Identifies the message as a COPY-failure indicator.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "message",
                "type": "String",
                "definition": "An error message to report as the cause of failure.",
            },
        ],
    },
    {
        backend: true,
        "title": "CopyInResponse",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('G')",
                "definition": "Identifies the message as a Start Copy In response. The frontend must now send copy-in data (if not prepared to do so, send a CopyFail message).",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "isBinary",
                "type": "Int8",
                "definition": "0 indicates the overall COPY format is textual (rows separated by newlines, columns separated by separator characters, etc.). 1 indicates the overall copy format is binary (similar to DataRow format). See COPY for more information.",
            },
            // {
            //     "name": "",
            //     "type": "Int16",
            //     "definition": "The number of columns in the data to be copied (denoted N below).",
            // },
            {
                "name": "formatCodes",
                "type": "Int16[Int16]",
                "definition": "The format codes to be used for each column. Each must presently be zero (text) or one (binary). All must be zero if the overall copy format is textual.",
            },
        ],
    },
    {
        backend: true,
        "title": "CopyOutResponse",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('H')",
                "definition": "Identifies the message as a Start Copy Out response. This message will be followed by copy-out data.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "isBinary",
                "type": "Int8",
                "definition": "0 indicates the overall COPY format is textual (rows separated by newlines, columns separated by separator characters, etc.). 1 indicates the overall copy format is binary (similar to DataRow format). See COPY for more information.",
            },
            // {
            //     "name": "",
            //     "type": "Int16",
            //     "definition": "The number of columns in the data to be copied (denoted N below).",
            // },
            {
                "name": "formatCodes",
                "type": "Int16[Int16]",
                "definition": "The format codes to be used for each column. Each must presently be zero (text) or one (binary). All must be zero if the overall copy format is textual.",
            },
        ],
    },
    {
        backend: true,
        "title": "CopyBothResponse",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('W')",
                "definition": "Identifies the message as a Start Copy Both response. This message is used only for Streaming Replication.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "isBinary",
                "type": "Int8",
                "definition": "0 indicates the overall COPY format is textual (rows separated by newlines, columns separated by separator characters, etc.). 1 indicates the overall copy format is binary (similar to DataRow format). See COPY for more information.",
            },
            // {
            //     "name": "",
            //     "type": "Int16",
            //     "definition": "The number of columns in the data to be copied (denoted N below).",
            // },
            {
                "name": "formatCodes",
                "type": "Int16[Int16]",
                "definition": "The format codes to be used for each column. Each must presently be zero (text) or one (binary). All must be zero if the overall copy format is textual.",
            },
        ],
    },
    {
        backend: true,
        "title": "DataRow",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('D')",
                "definition": "Identifies the message as a data row.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "columns",
                "type": "Byte[Int32][Int16]",
                "definition": "The number of column values that follow (possibly zero).",
            },
        ],
    },
    {
        frontend: true,
        "title": "Describe",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('D')",
                "definition": "Identifies the message as a Describe command.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "qType",
                "type": "Byte1",
                "definition": "'S' to describe a prepared statement; or 'P' to describe a portal.",
            },
            {
                "name": "name",
                "type": "String",
                "definition": "The name of the prepared statement or portal to describe (an empty string selects the unnamed prepared statement or portal).",
            },
        ],
    },
    {
        backend: true,
        "title": "EmptyQueryResponse",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('I')",
                "definition": "Identifies the message as a response to an empty query string. (This substitutes for CommandComplete.)",
            },
            {
                "name": "length",
                "type": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        backend: true,
        "title": "ErrorResponse",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('E')",
                "definition": "Identifies the message as an error.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        frontend: true,
        "title": "Execute",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('E')",
                "definition": "Identifies the message as an Execute command.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "name",
                "type": "String",
                "definition": "The name of the portal to execute (an empty string selects the unnamed portal).",
            },
            {
                "name": "limit",
                "type": "Int32",
                "definition": "Maximum number of rows to return, if portal contains a query that returns rows (ignored otherwise). Zero denotes “no limit”.",
            },
        ],
    },
    {
        frontend: true,
        "title": "Flush",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('H')",
                "definition": "Identifies the message as a Flush command.",
            },
            {
                "name": "length",
                "type": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    // {
    //      frontend: true,
    //     "title": "FunctionCall",
    //     "definition": [
    //         {
    //             "name": "messageType",
    //             "type": "Byte1('F')",
    //             "definition": "Identifies the message as a function call.",
    //         },
    //         {
    //             "name": "length",
    //             "type": "Int32",
    //             "definition": "Length of message contents in bytes, including self.",
    //         },
    //         {
    //             "name": "",
    //             "type": "Int32",
    //             "definition": "Specifies the object ID of the function to call.",
    //         },
    //         {
    //             "name": "",
    //             "type": "Int16",
    //             "definition": "The number of argument format codes that follow (denoted C below). This can be zero to indicate that there are no arguments or that the arguments all use the default format (text); or one, in which case the specified format code is applied to all arguments; or it can equal the actual number of arguments.",
    //         },
    //         {
    //             "name": "",
    //             "type": "Int16[C]",
    //             "definition": "The argument format codes. Each must presently be zero (text) or one (binary).",
    //         },
    //         {
    //             "name": "",
    //             "type": "Int16",
    //             "definition": "Specifies the number of arguments being supplied to the function.",
    //         },
    //     ],
    // },
    // {
    //      backend: true,
    //     "title": "FunctionCallResponse",
    //     "definition": [
    //         {
    //             "name": "messageType",
    //             "type": "Byte1('V')",
    //             "definition": "Identifies the message as a function call result.",
    //         },
    //         {
    //             "name": "length",
    //             "type": "Int32",
    //             "definition": "Length of message contents in bytes, including self.",
    //         },
    //         {
    //             "name": "",
    //             "type": "Int32",
    //             "definition": "The length of the function result value, in bytes (this count does not include itself). Can be zero. As a special case, -1 indicates a NULL function result. No value bytes follow in the NULL case.",
    //         },
    //         {
    //             "name": "data",
    //             "type": "Byten",
    //             "definition": "The value of the function result, in the format indicated by the associated format code. n is the above length.",
    //         },
    //     ],
    // },
    // {
    //      frontend: true,
    //     "title": "GSSENCRequest",
    //     "definition": [
    //         {
    //             "name": "messageType",
    //             "type": "Int32(8)",
    //             "definition": "Length of message contents in bytes, including self.",
    //         },
    //         {
    //             "name": "length",
    //             "type": "Int32(80877104)",
    //             "definition": "The GSSAPI Encryption request code. The value is chosen to contain 1234 in the most significant 16 bits, and 5680 in the least significant 16 bits. (To avoid confusion, this code must not be the same as any protocol version number.)",
    //         },
    //     ],
    // },
    // {
    //      frontend: true,
    //     "title": "GSSResponse",
    //     "definition": [
    //         {
    //             "name": "messageType",
    //             "type": "Byte1('p')",
    //             "definition": "Identifies the message as a GSSAPI or SSPI response. Note that this is also used for SASL and password response messages. The exact message type can be deduced from the context.",
    //         },
    //         {
    //             "name": "length",
    //             "type": "Int32",
    //             "definition": "Length of message contents in bytes, including self.",
    //         },
    //         {
    //             "name": "data",
    //             "type": "Byten",
    //             "definition": "GSSAPI/SSPI specific message data.",
    //         },
    //     ],
    // },
    // {
    //      backend: true,
    //     "title": "NegotiateProtocolVersion",
    //     "definition": [
    //         {
    //             "name": "messageType",
    //             "type": "Byte1('v')",
    //             "definition": "Identifies the message as a protocol version negotiation message.",
    //         },
    //         {
    //             "name": "length",
    //             "type": "Int32",
    //             "definition": "Length of message contents in bytes, including self.",
    //         },
    //         {
    //             "name": "",
    //             "type": "Int32",
    //             "definition": "Newest minor protocol version supported by the server for the major protocol version requested by the client.",
    //         },
    //         {
    //             "name": "",
    //             "type": "Int32",
    //             "definition": "Number of protocol options not recognized by the server.",
    //         },
    //     ],
    // },
    {
        backend: true,
        "title": "NoData",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('n')",
                "definition": "Identifies the message as a no-data indicator.",
            },
            {
                "name": "length",
                "type": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        backend: true,
        "title": "NoticeResponse",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('N')",
                "definition": "Identifies the message as a notice.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        backend: true,
        "title": "NotificationResponse",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('A')",
                "definition": "Identifies the message as a notification response.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "pid",
                "type": "Int32",
                "definition": "The process ID of the notifying backend process.",
            },
            {
                "name": "channelName",
                "type": "String",
                "definition": "The name of the channel that the notify has been raised on.",
            },
            {
                "name": "message",
                "type": "String",
                "definition": "The “payload” string passed from the notifying process.",
            },
        ],
    },
    {
        backend: true,
        "title": "ParameterDescription",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('t')",
                "definition": "Identifies the message as a parameter description.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "pTypes",
                "type": "Int32[Int16]",
                "definition": "OID of parameter data types. [The number of parameters used by the statement (can be zero).]",
            },
        ],
    },
    {
        backend: true,
        "title": "ParameterStatus",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('S')",
                "definition": "Identifies the message as a run-time parameter status report.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "name",
                "type": "String",
                "definition": "The name of the run-time parameter being reported.",
            },
            {
                "name": "value",
                "type": "String",
                "definition": "The current value of the parameter.",
            },
        ],
    },
    {
        frontend: true,
        "title": "Parse",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('P')",
                "definition": "Identifies the message as a Parse command.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "name",
                "type": "String",
                "definition": "The name of the destination prepared statement (an empty string selects the unnamed prepared statement).",
            },
            {
                "name": "query",
                "type": "String",
                "definition": "The query string to be parsed.",
            },
            {
                "name": "pTypes",
                "type": "Int32[Int16]",
                "definition": "OID of parameter data types. [The number of parameter data types specified (can be zero). Note that this is not an indication of the number of parameters that might appear in the query string, only the number that the frontend wants to prespecify types for.]",
            },
        ],
    },
    {
        backend: true,
        "title": "ParseComplete",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('1')",
                "definition": "Identifies the message as a Parse-complete indicator.",
            },
            {
                "name": "length",
                "type": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        frontend: true,
        "title": "PasswordMessage",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('p')",
                "definition": "Identifies the message as a password response. Note that this is also used for GSSAPI, SSPI and SASL response messages. The exact message type can be deduced from the context.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "password",
                "type": "String",
                "definition": "The password (encrypted, if requested).",
            },
        ],
    },
    {
        backend: true,
        "title": "PortalSuspended",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('s')",
                "definition": "Identifies the message as a portal-suspended indicator. Note this only appears if an Execute message's row-count limit was reached.",
            },
            {
                "name": "length",
                "type": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        frontend: true,
        "title": "Query",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('Q')",
                "definition": "Identifies the message as a simple query.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "query",
                "type": "String",
                "definition": "The query string itself.",
            },
        ],
    },
    {
        backend: true,
        "title": "ReadyForQuery",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('Z')",
                "definition": "Identifies the message type. ReadyForQuery is sent whenever the backend is ready for a new query cycle.",
            },
            {
                "name": "length",
                "type": "Int32(5)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "status",
                "type": "'I' | 'T' | 'E'",
                "definition": "Current backend transaction status indicator. Possible values are 'I' if idle (not in a transaction block); 'T' if in a transaction block; or 'E' if in a failed transaction block (queries will be rejected until block is ended).",
            },
        ],
    },
    {
        internal: true,
        backend: true,
        "title": "IField",
        "definition": [
            {
                "name": "name",
                "type": "String",
                "definition": "The field name."
            },
            {
                "name": "tableOid",
                "type": "Int32",
                "definition": "If the field can be identified as a column of a specific table, the object ID of the table; otherwise zero."
            },
            {
                "name": "attrNo",
                "type": "Int16",
                "definition": "If the field can be identified as a column of a specific table, the attribute number of the column; otherwise zero."
            },
            {
                "name": "typeOid",
                "type": "Int32",
                "definition": "The object ID of the field's data type."
            },
            {
                "name": "typeSize",
                "type": "Int16",
                "definition": "The data type size (see pg_type.typlen). Note that negative values denote variable-width types."
            },
            {
                "name": "typeModifier",
                "type": "Int32",
                "definition": "The type modifier (see pg_attribute.atttypmod). The meaning of the modifier is type-specific."
            },
            {
                "name": "isBinary",
                "type": "Int16",
                "definition": "The format code being used for the field. Currently will be zero (text) or one (binary). In a RowDescription returned from the statement variant of Describe, the format code is not yet known and will always be zero."
            }
        ]
    },
    {
        backend: true,
        "title": "RowDescription",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('T')",
                "definition": "Identifies the message as a row description.",
            },
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "fields",
                "type": "IField[Int16]",
                "definition": "Specifies the number of fields in a row (can be zero).",
            },
        ],
    },
    // {
    //      frontend: true,
    //     "title": "SASLInitialResponse",
    //     "definition": [
    //         {
    //             "name": "messageType",
    //             "type": "Byte1('p')",
    //             "definition": "Identifies the message as an initial SASL response. Note that this is also used for GSSAPI, SSPI and password response messages. The exact message type is deduced from the context.",
    //         },
    //         {
    //             "name": "length",
    //             "type": "Int32",
    //             "definition": "Length of message contents in bytes, including self.",
    //         },
    //         {
    //             "name": "name",
    //             "type": "String",
    //             "definition": "Name of the SASL authentication mechanism that the client selected.",
    //         },
    //         {
    //             "name": "responseLength",
    //             "type": "Int32",
    //             "definition": 'Length of SASL mechanism specific "Initial Client Response" that follows, or -1 if there is no Initial Response.',
    //         },
    //         {
    //             "name": "data",
    //             "type": "Byten",
    //             "definition": 'SASL mechanism specific "Initial Response".',
    //         },
    //     ],
    // },
    // {
    //      frontend: true,
    //     "title": "SASLResponse",
    //     "definition": [
    //         {
    //             "name": "messageType",
    //             "type": "Byte1('p')",
    //             "definition": "Identifies the message as a SASL response. Note that this is also used for GSSAPI, SSPI and password response messages. The exact message type can be deduced from the context.",
    //         },
    //         {
    //             "name": "length",
    //             "type": "Int32",
    //             "definition": "Length of message contents in bytes, including self.",
    //         },
    //         {
    //             "name": "data",
    //             "type": "Byten",
    //             "definition": "SASL mechanism specific message data.",
    //         },
    //     ],
    // },
    {
        frontend: true,
        "title": "SSLRequest",
        "definition": [
            {
                "name": "messageType",
                "type": "Int32(8)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "length",
                "type": "Int32(80877103)",
                "definition": "The SSL request code. The value is chosen to contain 1234 in the most significant 16 bits, and 5679 in the least significant 16 bits." + "(To avoid confusion, this code must not be the same as any protocol version number.)",
            },
        ],
    },
    {
        frontend: true,
        "title": "StartupMessage",
        "definition": [
            {
                "name": "length",
                "type": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "name": "protocol",
                "type": "Int32(196608)",
                "definition": "The protocol version number. The most significant 16 bits are the major version number (3 for the protocol described here)." + " The least significant 16 bits are the minor version number (0 for the protocol described here).",
            },
        ],
    },
    {
        frontend: true,
        "title": "Sync",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('S')",
                "definition": "Identifies the message as a Sync command.",
            },
            {
                "name": "length",
                "type": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        frontend: true,
        "title": "Terminate",
        "definition": [
            {
                "name": "messageType",
                "type": "Byte1('X')",
                "definition": "Identifies the message as a termination.",
            },
            {
                "name": "length",
                "type": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
]
