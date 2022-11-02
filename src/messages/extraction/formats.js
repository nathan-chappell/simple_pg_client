export const formats = [
    {
        "title": "AuthenticationOk (B)",
        "definition": [
            {
                "title": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "title": "Int32(8)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32(0)",
                "definition": "Specifies that the authentication was successful.",
            },
        ],
    },
    {
        "title": "AuthenticationKerberosV5 (B)",
        "definition": [
            {
                "title": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "title": "Int32(8)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32(2)",
                "definition": "Specifies that Kerberos V5 authentication is required.",
            },
        ],
    },
    {
        "title": "AuthenticationCleartextPassword (B)",
        "definition": [
            {
                "title": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "title": "Int32(8)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32(3)",
                "definition": "Specifies that a clear-text password is required.",
            },
        ],
    },
    {
        "title": "AuthenticationMD5Password (B)",
        "definition": [
            {
                "title": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "title": "Int32(12)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32(5)",
                "definition": "Specifies that an MD5-encrypted password is required.",
            },
            {
                "title": "Byte4",
                "definition": "The salt to use when encrypting the password.",
            },
        ],
    },
    {
        "title": "AuthenticationSCMCredential (B)",
        "definition": [
            {
                "title": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "title": "Int32(8)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32(6)",
                "definition": "Specifies that an SCM credentials message is required.",
            },
        ],
    },
    {
        "title": "AuthenticationGSS (B)",
        "definition": [
            {
                "title": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "title": "Int32(8)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32(7)",
                "definition": "Specifies that GSSAPI authentication is required.",
            },
        ],
    },
    {
        "title": "AuthenticationGSSContinue (B)",
        "definition": [
            {
                "title": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32(8)",
                "definition":
                    "Specifies that this message contains GSSAPI or SSPI data.",
            },
            {
                "title": "Byten",
                "definition": "GSSAPI or SSPI authentication data.",
            },
        ],
    },
    {
        "title": "AuthenticationSSPI (B)",
        "definition": [
            {
                "title": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "title": "Int32(8)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32(9)",
                "definition": "Specifies that SSPI authentication is required.",
            },
        ],
    },
    {
        "title": "AuthenticationSASL (B)",
        "definition": [
            {
                "title": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32(10)",
                "definition": "Specifies that SASL authentication is required.",
            },
        ],
    },
    {
        "title": "AuthenticationSASLContinue (B)",
        "definition": [
            {
                "title": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32(11)",
                "definition": "Specifies that this message contains a SASL challenge.",
            },
            {
                "title": "Byten",
                "definition": "SASL data, specific to the SASL mechanism being used.",
            },
        ],
    },
    {
        "title": "AuthenticationSASLFinal (B)",
        "definition": [
            {
                "title": "Byte1('R')",
                "definition": "Identifies the message as an authentication request.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32(12)",
                "definition": "Specifies that SASL authentication has completed.",
            },
            {
                "title": "Byten",
                "definition":
                    'SASL outcome "additional data", specific to the SASL mechanism being used.',
            },
        ],
    },
    {
        "title": "BackendKeyData (B)",
        "definition": [
            {
                "title": "Byte1('K')",
                "definition":
                    "Identifies the message as cancellation key data. The frontend must save these values if it wishes to be able to issue CancelRequest messages later.",
            },
            {
                "title": "Int32(12)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32",
                "definition": "The process ID of this backend.",
            },
            {
                "title": "Int32",
                "definition": "The secret key of this backend.",
            },
        ],
    },
    {
        "title": "Bind (F)",
        "definition": [
            {
                "title": "Byte1('B')",
                "definition": "Identifies the message as a Bind command.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "String",
                "definition":
                    "The name of the destination portal (an empty string selects the unnamed portal).",
            },
            {
                "title": "String",
                "definition":
                    "The name of the source prepared statement (an empty string selects the unnamed prepared statement).",
            },
            {
                "title": "Int16",
                "definition":
                    "The number of parameter format codes that follow (denoted C below). This can be zero to indicate that there are no parameters or that the parameters all use the default format (text); or one, in which case the specified format code is applied to all parameters; or it can equal the actual number of parameters.",
            },
            {
                "title": "Int16[C]",
                "definition":
                    "The parameter format codes. Each must presently be zero (text) or one (binary).",
            },
            {
                "title": "Int16",
                "definition":
                    "The number of parameter values that follow (possibly zero). This must match the number of parameters needed by the query.",
            },
        ],
    },
    {
        "title": "BindComplete (B)",
        "definition": [
            {
                "title": "Byte1('2')",
                "definition": "Identifies the message as a Bind-complete indicator.",
            },
            {
                "title": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        "title": "CancelRequest (F)",
        "definition": [
            {
                "title": "Int32(16)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32(80877102)",
                "definition":
                    "The cancel request code. The value is chosen to contain 1234 in the most significant 16 bits, and 5678 in the least significant 16 bits. (To avoid confusion, this code must not be the same as any protocol version number.)",
            },
            {
                "title": "Int32",
                "definition": "The process ID of the target backend.",
            },
            {
                "title": "Int32",
                "definition": "The secret key for the target backend.",
            },
        ],
    },
    {
        "title": "Close (F)",
        "definition": [
            {
                "title": "Byte1('C')",
                "definition": "Identifies the message as a Close command.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Byte1",
                "definition":
                    "'S' to close a prepared statement; or 'P' to close a portal.",
            },
            {
                "title": "String",
                "definition":
                    "The name of the prepared statement or portal to close (an empty string selects the unnamed prepared statement or portal).",
            },
        ],
    },
    {
        "title": "CloseComplete (B)",
        "definition": [
            {
                "title": "Byte1('3')",
                "definition": "Identifies the message as a Close-complete indicator.",
            },
            {
                "title": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        "title": "CommandComplete (B)",
        "definition": [
            {
                "title": "Byte1('C')",
                "definition": "Identifies the message as a command-completed response.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "String",
                "definition":
                    "The command tag. This is usually a single word that identifies which SQL command was completed.\n\nFor an INSERT command, the tag is INSERT oid rows, where rows is the number of rows inserted. oid used to be the object ID of the inserted row if rows was 1 and the target table had OIDs, but OIDs system columns are not supported anymore; therefore oid is always 0.\n\nFor a DELETE command, the tag is DELETE rows where rows is the number of rows deleted.\n\nFor an UPDATE command, the tag is UPDATE rows where rows is the number of rows updated.\n\nFor a SELECT or CREATE TABLE AS command, the tag is SELECT rows where rows is the number of rows retrieved.\n\nFor a MOVE command, the tag is MOVE rows where rows is the number of rows the cursor's position has been changed by.\n\nFor a FETCH command, the tag is FETCH rows where rows is the number of rows that have been retrieved from the cursor.\n\nFor a COPY command, the tag is COPY rows where rows is the number of rows copied. (Note: the row count appears only in PostgreSQL 8.2 and later.)",
            },
        ],
    },
    {
        "title": "CopyData (F & B)",
        "definition": [
            {
                "title": "Byte1('d')",
                "definition": "Identifies the message as COPY data.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Byten",
                "definition":
                    "Data that forms part of a COPY data stream. Messages sent from the backend will always correspond to single data rows, but messages sent by frontends might divide the data stream arbitrarily.",
            },
        ],
    },
    {
        "title": "CopyDone (F & B)",
        "definition": [
            {
                "title": "Byte1('c')",
                "definition": "Identifies the message as a COPY-complete indicator.",
            },
            {
                "title": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        "title": "CopyFail (F)",
        "definition": [
            {
                "title": "Byte1('f')",
                "definition": "Identifies the message as a COPY-failure indicator.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "String",
                "definition": "An error message to report as the cause of failure.",
            },
        ],
    },
    {
        "title": "CopyInResponse (B)",
        "definition": [
            {
                "title": "Byte1('G')",
                "definition":
                    "Identifies the message as a Start Copy In response. The frontend must now send copy-in data (if not prepared to do so, send a CopyFail message).",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int8",
                "definition":
                    "0 indicates the overall COPY format is textual (rows separated by newlines, columns separated by separator characters, etc.). 1 indicates the overall copy format is binary (similar to DataRow format). See COPY for more information.",
            },
            {
                "title": "Int16",
                "definition":
                    "The number of columns in the data to be copied (denoted N below).",
            },
            {
                "title": "Int16[N]",
                "definition":
                    "The format codes to be used for each column. Each must presently be zero (text) or one (binary). All must be zero if the overall copy format is textual.",
            },
        ],
    },
    {
        "title": "CopyOutResponse (B)",
        "definition": [
            {
                "title": "Byte1('H')",
                "definition":
                    "Identifies the message as a Start Copy Out response. This message will be followed by copy-out data.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int8",
                "definition":
                    "0 indicates the overall COPY format is textual (rows separated by newlines, columns separated by separator characters, etc.). 1 indicates the overall copy format is binary (similar to DataRow format). See COPY for more information.",
            },
            {
                "title": "Int16",
                "definition":
                    "The number of columns in the data to be copied (denoted N below).",
            },
            {
                "title": "Int16[N]",
                "definition":
                    "The format codes to be used for each column. Each must presently be zero (text) or one (binary). All must be zero if the overall copy format is textual.",
            },
        ],
    },
    {
        "title": "CopyBothResponse (B)",
        "definition": [
            {
                "title": "Byte1('W')",
                "definition":
                    "Identifies the message as a Start Copy Both response. This message is used only for Streaming Replication.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int8",
                "definition":
                    "0 indicates the overall COPY format is textual (rows separated by newlines, columns separated by separator characters, etc.). 1 indicates the overall copy format is binary (similar to DataRow format). See COPY for more information.",
            },
            {
                "title": "Int16",
                "definition":
                    "The number of columns in the data to be copied (denoted N below).",
            },
            {
                "title": "Int16[N]",
                "definition":
                    "The format codes to be used for each column. Each must presently be zero (text) or one (binary). All must be zero if the overall copy format is textual.",
            },
        ],
    },
    {
        "title": "DataRow (B)",
        "definition": [
            {
                "title": "Byte1('D')",
                "definition": "Identifies the message as a data row.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int16",
                "definition":
                    "The number of column values that follow (possibly zero).",
            },
        ],
    },
    {
        "title": "Describe (F)",
        "definition": [
            {
                "title": "Byte1('D')",
                "definition": "Identifies the message as a Describe command.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Byte1",
                "definition":
                    "'S' to describe a prepared statement; or 'P' to describe a portal.",
            },
            {
                "title": "String",
                "definition":
                    "The name of the prepared statement or portal to describe (an empty string selects the unnamed prepared statement or portal).",
            },
        ],
    },
    {
        "title": "EmptyQueryResponse (B)",
        "definition": [
            {
                "title": "Byte1('I')",
                "definition":
                    "Identifies the message as a response to an empty query string. (This substitutes for CommandComplete.)",
            },
            {
                "title": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        "title": "ErrorResponse (B)",
        "definition": [
            {
                "title": "Byte1('E')",
                "definition": "Identifies the message as an error.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        "title": "Execute (F)",
        "definition": [
            {
                "title": "Byte1('E')",
                "definition": "Identifies the message as an Execute command.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "String",
                "definition":
                    "The name of the portal to execute (an empty string selects the unnamed portal).",
            },
            {
                "title": "Int32",
                "definition":
                    "Maximum number of rows to return, if portal contains a query that returns rows (ignored otherwise). Zero denotes “no limit”.",
            },
        ],
    },
    {
        "title": "Flush (F)",
        "definition": [
            {
                "title": "Byte1('H')",
                "definition": "Identifies the message as a Flush command.",
            },
            {
                "title": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        "title": "FunctionCall (F)",
        "definition": [
            {
                "title": "Byte1('F')",
                "definition": "Identifies the message as a function call.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32",
                "definition": "Specifies the object ID of the function to call.",
            },
            {
                "title": "Int16",
                "definition":
                    "The number of argument format codes that follow (denoted C below). This can be zero to indicate that there are no arguments or that the arguments all use the default format (text); or one, in which case the specified format code is applied to all arguments; or it can equal the actual number of arguments.",
            },
            {
                "title": "Int16[C]",
                "definition":
                    "The argument format codes. Each must presently be zero (text) or one (binary).",
            },
            {
                "title": "Int16",
                "definition":
                    "Specifies the number of arguments being supplied to the function.",
            },
        ],
    },
    {
        "title": "FunctionCallResponse (B)",
        "definition": [
            {
                "title": "Byte1('V')",
                "definition": "Identifies the message as a function call result.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32",
                "definition":
                    "The length of the function result value, in bytes (this count does not include itself). Can be zero. As a special case, -1 indicates a NULL function result. No value bytes follow in the NULL case.",
            },
            {
                "title": "Byten",
                "definition":
                    "The value of the function result, in the format indicated by the associated format code. n is the above length.",
            },
        ],
    },
    {
        "title": "GSSENCRequest (F)",
        "definition": [
            {
                "title": "Int32(8)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32(80877104)",
                "definition":
                    "The GSSAPI Encryption request code. The value is chosen to contain 1234 in the most significant 16 bits, and 5680 in the least significant 16 bits. (To avoid confusion, this code must not be the same as any protocol version number.)",
            },
        ],
    },
    {
        "title": "GSSResponse (F)",
        "definition": [
            {
                "title": "Byte1('p')",
                "definition":
                    "Identifies the message as a GSSAPI or SSPI response. Note that this is also used for SASL and password response messages. The exact message type can be deduced from the context.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Byten",
                "definition": "GSSAPI/SSPI specific message data.",
            },
        ],
    },
    {
        "title": "NegotiateProtocolVersion (B)",
        "definition": [
            {
                "title": "Byte1('v')",
                "definition":
                    "Identifies the message as a protocol version negotiation message.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32",
                "definition":
                    "Newest minor protocol version supported by the server for the major protocol version requested by the client.",
            },
            {
                "title": "Int32",
                "definition":
                    "Number of protocol options not recognized by the server.",
            },
        ],
    },
    {
        "title": "NoData (B)",
        "definition": [
            {
                "title": "Byte1('n')",
                "definition": "Identifies the message as a no-data indicator.",
            },
            {
                "title": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        "title": "NoticeResponse (B)",
        "definition": [
            {
                "title": "Byte1('N')",
                "definition": "Identifies the message as a notice.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        "title": "NotificationResponse (B)",
        "definition": [
            {
                "title": "Byte1('A')",
                "definition": "Identifies the message as a notification response.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32",
                "definition": "The process ID of the notifying backend process.",
            },
            {
                "title": "String",
                "definition":
                    "The name of the channel that the notify has been raised on.",
            },
            {
                "title": "String",
                "definition": "The “payload” string passed from the notifying process.",
            },
        ],
    },
    {
        "title": "ParameterDescription (B)",
        "definition": [
            {
                "title": "Byte1('t')",
                "definition": "Identifies the message as a parameter description.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int16",
                "definition":
                    "The number of parameters used by the statement (can be zero).",
            },
        ],
    },
    {
        "title": "ParameterStatus (B)",
        "definition": [
            {
                "title": "Byte1('S')",
                "definition":
                    "Identifies the message as a run-time parameter status report.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "String",
                "definition": "The name of the run-time parameter being reported.",
            },
            {
                "title": "String",
                "definition": "The current value of the parameter.",
            },
        ],
    },
    {
        "title": "Parse (F)",
        "definition": [
            {
                "title": "Byte1('P')",
                "definition": "Identifies the message as a Parse command.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "String",
                "definition":
                    "The name of the destination prepared statement (an empty string selects the unnamed prepared statement).",
            },
            {
                "title": "String",
                "definition": "The query string to be parsed.",
            },
            {
                "title": "Int16",
                "definition":
                    "The number of parameter data types specified (can be zero). Note that this is not an indication of the number of parameters that might appear in the query string, only the number that the frontend wants to prespecify types for.",
            },
        ],
    },
    {
        "title": "ParseComplete (B)",
        "definition": [
            {
                "title": "Byte1('1')",
                "definition": "Identifies the message as a Parse-complete indicator.",
            },
            {
                "title": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        "title": "PasswordMessage (F)",
        "definition": [
            {
                "title": "Byte1('p')",
                "definition":
                    "Identifies the message as a password response. Note that this is also used for GSSAPI, SSPI and SASL response messages. The exact message type can be deduced from the context.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "String",
                "definition": "The password (encrypted, if requested).",
            },
        ],
    },
    {
        "title": "PortalSuspended (B)",
        "definition": [
            {
                "title": "Byte1('s')",
                "definition":
                    "Identifies the message as a portal-suspended indicator. Note this only appears if an Execute message's row-count limit was reached.",
            },
            {
                "title": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        "title": "Query (F)",
        "definition": [
            {
                "title": "Byte1('Q')",
                "definition": "Identifies the message as a simple query.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "String",
                "definition": "The query string itself.",
            },
        ],
    },
    {
        "title": "ReadyForQuery (B)",
        "definition": [
            {
                "title": "Byte1('Z')",
                "definition":
                    "Identifies the message type. ReadyForQuery is sent whenever the backend is ready for a new query cycle.",
            },
            {
                "title": "Int32(5)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Byte1",
                "definition":
                    "Current backend transaction status indicator. Possible values are 'I' if idle (not in a transaction block); 'T' if in a transaction block; or 'E' if in a failed transaction block (queries will be rejected until block is ended).",
            },
        ],
    },
    {
        "title": "RowDescription (B)",
        "definition": [
            {
                "title": "Byte1('T')",
                "definition": "Identifies the message as a row description.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int16",
                "definition": "Specifies the number of fields in a row (can be zero).",
            },
        ],
    },
    {
        "title": "SASLInitialResponse (F)",
        "definition": [
            {
                "title": "Byte1('p')",
                "definition":
                    "Identifies the message as an initial SASL response. Note that this is also used for GSSAPI, SSPI and password response messages. The exact message type is deduced from the context.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "String",
                "definition":
                    "Name of the SASL authentication mechanism that the client selected.",
            },
            {
                "title": "Int32",
                "definition":
                    'Length of SASL mechanism specific "Initial Client Response" that follows, or -1 if there is no Initial Response.',
            },
            {
                "title": "Byten",
                "definition": 'SASL mechanism specific "Initial Response".',
            },
        ],
    },
    {
        "title": "SASLResponse (F)",
        "definition": [
            {
                "title": "Byte1('p')",
                "definition":
                    "Identifies the message as a SASL response. Note that this is also used for GSSAPI, SSPI and password response messages. The exact message type can be deduced from the context.",
            },
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Byten",
                "definition": "SASL mechanism specific message data.",
            },
        ],
    },
    {
        "title": "SSLRequest (F)",
        "definition": [
            {
                "title": "Int32(8)",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32(80877103)",
                "definition":
                    "The SSL request code. The value is chosen to contain 1234 in the most significant 16 bits, and 5679 in the least significant 16 bits."
                    + "(To avoid confusion, this code must not be the same as any protocol version number.)",
            },
        ],
    },
    {
        "title": "StartupMessage (F)",
        "definition": [
            {
                "title": "Int32",
                "definition": "Length of message contents in bytes, including self.",
            },
            {
                "title": "Int32(196608)",
                "definition": "The protocol version number. The most significant 16 bits are the major version number (3 for the protocol described here)."
                    + " The least significant 16 bits are the minor version number (0 for the protocol described here).",
            },
        ],
    },
    {
        "title": "Sync (F)",
        "definition": [
            {
                "title": "Byte1('S')",
                "definition": "Identifies the message as a Sync command.",
            },
            {
                "title": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
    {
        "title": "Terminate (F)",
        "definition": [
            {
                "title": "Byte1('X')",
                "definition": "Identifies the message as a termination.",
            },
            {
                "title": "Int32(4)",
                "definition": "Length of message contents in bytes, including self.",
            },
        ],
    },
]
