const { Readable } = require('node:stream')
const { parseTypeMap } = require('./parse_info.js')
const { nextParseInfoTree } = require('./parse_info_tree.js')

/**
 * @typedef {import('./write_message').MessageSpec} MessageSpec
 * @typedef {import('./parse_info_tree').ParseInfoTree} ParseInfoTree
 */


/**
 * @param {Readable} readable
 * @param {ParseInfoTree} parseInfoTree
 */
async function* readMessages(readable, parseInfoTree) {
    let currentTree = parseInfoTree
    let message = []
    while (!readable.closed) {
        if (Object.hasOwn(currentTree, 'result')) {
            yield Promise.resolve({ messageType: currentTree.result, message })
            currentTree = parseInfoTree
            message = []
        }
        const value = await parseTypeMap[currentTree.childType](readable)
        message.push({ type: currentTree.childType, value })
        currentTree = nextParseInfoTree(currentTree, value)
    }
}

module.exports = {
    readMessages
}