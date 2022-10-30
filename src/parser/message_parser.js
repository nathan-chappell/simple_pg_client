const { parseInt16, parseInt32, parseBytes, parseString } = require("./data_types");

async function* parseArray(readable, parseLength, parseItem) {
    const length = await parseLength(readable);
    const result = [];
    for (let i = 0; i < length; ++i) result.push(await parseItem(readable));
    return result;
}

const parseCountBytes = (count) => (readable) => parseBytes(readable, count);
const parseOneByte = (readable) => parseBytes(readable, 1).then(bytes => bytes[0]);

parseItemMap = {
    Byte: parseOneByte,
    Byte1: parseOneByte,
    Byte4: parseCountBytes(4),
    Int16: parseInt16,
    Int32: parseInt32,
    String: parseString,
};

function getFormatParser(format) {
    const { type, arraySpec, expectedSpec } = format.match(
        /^(?<type>Int16|Int32|Byte(1|4)?|String)(?<arraySpec>\[\]){0,2}(\('?(?<expectedSpec>[^)']*)'?\))?/
    ).groups;
    const parseItem = parseItemMap[type];
    let parser;
    if (!parseItem) throw new Error(`No item-parser found for type: ${type}`);
    if (!arraySpec) {
        parser = parseItem;
    } else {
        const _parseItem = getFormatParser(`${type}${arraySpec.replace("[]", "")}`);
        const _parseLength = type == "Byte" ? parseInt32 : parseInt16;
        parser = (readable) => parseArray(readable, _parseLength, _parseItem);
    }
    let expected = null;
    if (expectedSpec) {
        switch (type) {
            case 'Byte1':
                expected = expectedSpec.charCodeAt(0);
                break;
            case 'Int32':
                expected = parseInt(expectedSpec);
                break;
            default:
                throw new Error(`No conversion for expected type ${type}`)
        }
    }
    return { parser, expected };
}

function generateParser(messageFormat) {
    const { name, formatstring } = messageFormat.match(/^(?<name>\w+): (?<formatstring>.*)/).groups;
    const formats = formatstring.split(/\s+/);
    const formatParsers = formats.map(getFormatParser);
}

module.exports = {
    getFormatParser,
    generateParser,
};
