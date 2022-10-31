const { parseInt16, parseInt32, parseBytes, parseString } = require("./data_types")

/**
 * @typedef ParseInfo
 * @type {object}
 * @property {string} type
 * @property {string | number | null} expected
 */


async function parseArray(readable, parseLength, parseItem) {
    const length = await parseLength(readable)
    const result = []
    for (let i = 0; i < length; ++i) result.push(await parseItem(readable))
    return result
}

const parseCountBytes = (count) => (readable) => parseBytes(readable, count)
const parseOneByte = (readable) => parseBytes(readable, 1).then((bytes) => bytes[0])
const parseByteArray = (readable) => parseArray(readable, parseInt32, parseOneByte)

const parseTypeMap = {
    Byte: parseOneByte,
    Byte1: parseOneByte,
    Byte4: parseCountBytes(4),
    Int16: parseInt16,
    Int32: parseInt32,
    String: parseString,
    ["Int16[]"]: (readable) => parseArray(readable, parseInt16, parseInt16),
    ["Byte[]"]: parseByteArray,
    ["Byte[][]"]: (readable) => parseArray(readable, parseInt32, parseByteArray),
}

const getExpected = (expectedSpec, type) => {
    if (expectedSpec) {
        switch (type) {
            case "Byte1":
                return expectedSpec.charCodeAt(0)
            case "Int32":
                return parseInt(expectedSpec)
            default:
                throw new Error(`No conversion for expected type ${type}`)
        }
    } else {
        return null
    }
}


/**
 *
 * @param {string} format
 * @returns {ParseInfo}
 */
function getParseInfo(format) {
    const { baseType, arraySpec, expectedSpec } = format.match(
        /^(?<baseType>Int16|Int32|Byte(1|4)?|String)(?<arraySpec>\[\]){0,2}(\('?(?<expectedSpec>[^)']*)'?\))?/
    ).groups
    const type = arraySpec ? `${baseType}${arraySpec}` : baseType
    if (!(type in parseTypeMap)) throw new Error(`No parser found for type: ${type}`)
    const expected = getExpected(expectedSpec, type)
    return { type, expected }
}


module.exports = {
    getParseInfo,
    parseTypeMap,
}
