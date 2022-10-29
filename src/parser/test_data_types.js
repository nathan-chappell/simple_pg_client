const { Readable } = require('node:stream');

const { parseInt16, parseInt32 } = require('./data_types.js');

function test_parseInt16_valid() {
    const value = 0x1234;
    const bytes = new Uint8Array([value >> 8, value % 256], { objectMode: false });
    const readable = Readable.from([bytes]);
    return parseInt16(readable).then(_value => {
        if (_value !== value) {
            throw new Error(`expected: ${value}, got: ${_value}`);
        }
    });
}

test_parseInt16_valid();