const { Readable } = require("node:stream");

const { getFormatParser, parseTypeMap } = require("./message_parser.js");
const { frontEndFormat } = require("./message_format");

function test_getInt16FormatParser_valid() {
    const value = 0x1234;
    const bytes = new Uint8Array([value >> 8, value % 256], { objectMode: false });
    const readable = Readable.from([bytes]);
    return parseTypeMap[getFormatParser("Int16").type](readable).then((_value) => {
        if (_value !== value) {
            throw new Error(`expected: ${value}, got: ${_value}`);
        }
    });
}

function test_getByte1FormatParser_valid() {
    const value = "R".charCodeAt(0);
    const bytes = new Uint8Array([value], { objectMode: false });
    const readable = Readable.from([bytes]);
    const formatParser = getFormatParser("Byte1('R')");
    if (formatParser.expected !== value) throw new Error(`expected: ${value}, got: ${formatParser.expected}`);
    return parseTypeMap[formatParser.type](readable).then((_value) => {
        if (_value !== formatParser.expected) {
            throw new Error(
                `expected: ${
                    formatParser.expected
                }, got: ${_value} | ${typeof formatParser.expected} - ${typeof _value}`
            );
        }
    });
}

function test_getStringFormatParser_valid() {
    const value = "foo";
    const byteValue = [..."foo"].map((c) => c.charCodeAt(0));
    // const bytes = new Uint8Array([...[...value].map(c => c.charCodeAt(0)),0], {objectMode: false});
    const bytes = new Uint8Array([...byteValue, 0]);
    const readable = Readable.from([bytes], { objectMode: false });
    readable.pause();
    const formatParser = getFormatParser("String");
    return parseTypeMap[formatParser.type](readable).then((_value) => {
        if (_value !== value) {
            throw new Error(`expected: ${value}, got: ${_value} | ${typeof value} - ${typeof _value}`);
        }
    });
}

test_getInt16FormatParser_valid();
test_getByte1FormatParser_valid();
test_getStringFormatParser_valid();
