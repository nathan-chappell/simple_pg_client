const { getParseInfo } = require('./parse_info.js')

/**
 * @typedef ParseInfoTree
 * @type {object}
 * @property {string | null} childType
 * @property {Object.<string | number | null, ParseInfoTree>} childrenByValue
 */

/**
 * @returns ParseInfoTree
 */
function makeParseInfoTreeRoot() {
    return { childType: null, childrenByValue: {} }
}

/**
 *
 * @param {ParseInfoTree} parseInfoTree
 * @param {ParseInfo[]} parseInfos
 * @param {string} name
 */
function insertIntoParseInfoTree(parseInfoTree, parseInfos, name) {
    if (parseInfos.length == 0) {
        parseInfoTree.result = name
        return
    }
    const parseInfo = parseInfos[0]
    if (parseInfoTree.childType === null) {
        parseInfoTree.childType = parseInfo.type
    }
    if (parseInfoTree.childType !== parseInfo.type)
        throw new Error(
            `Insert requires all children to have the same type! ${parseInfoTree.childType} ${parseInfo.type}`
        )
    const nextChild = Object.hasOwn(parseInfoTree.childrenByValue, parseInfo.expected)
        ? parseInfoTree.childrenByValue[parseInfo.expected]
        : (parseInfoTree.childrenByValue[parseInfo.expected] = makeParseInfoTreeRoot())
    insertIntoParseInfoTree(nextChild, parseInfos.slice(1), name)
}

/**
 * 
 * @param {string} messageFormat 
 * @returns {{name: string, formats: Array.<ParseInfo>}}
 */
function getFormatInfo(messageFormat) {
    const { name, formatstring } = messageFormat.match(/^(?<name>\w+): (?<formatstring>.*)/).groups
    const formats = formatstring.split(/\s+/).map(getParseInfo)
    return { name, formats }
}


/**
 * 
 * @param {Array.<string>} formatSpec 
 * @returns {ParseInfoTree}
 */
function makeParseInfoTree(formatStrings) {
    const root = makeParseInfoTreeRoot()
    for (let formatString of formatStrings) {
        const { name, formats } = getFormatInfo(formatString)
        insertIntoParseInfoTree(root, formats, name)
    }
    return root
}

module.exports = {
    makeParseInfoTree,
}
