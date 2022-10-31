const exp = require("node:constants")
const { exitCode } = require("node:process")
const { Readable } = require("node:stream")

const { makeParseInfoTree, nextParseInfoTree } = require("./parse_info_tree.js")
// const { frontEndFormat } = require("./message_format.js");

const expectedParseTreeJson = `{
    "childType": "Byte1",
    "childrenByValue": {
        "65": {
            "childType": "Int32",
            "childrenByValue": {
                "0": {
                    "childType": "Byte[]",
                    "childrenByValue": {
                        "null": {
                            "childType": null,
                            "childrenByValue": {},
                            "result": "A1"
                        }
                    }
                },
                "1": {
                    "childType": "Byte[]",
                    "childrenByValue": {
                        "null": {
                            "childType": null,
                            "childrenByValue": {},
                            "result": "A2"
                        }
                    }
                }
            }
        },
        "66": {
            "childType": "Int32",
            "childrenByValue": {
                "null": {
                    "childType": "Byte[]",
                    "childrenByValue": {
                        "null": {
                            "childType": null,
                            "childrenByValue": {},
                            "result": "B"
                        }
                    }
                }
            }
        },
        "67": {
            "childType": "Int32",
            "childrenByValue": {
                "null": {
                    "childType": "Int16[]",
                    "childrenByValue": {
                        "null": {
                            "childType": null,
                            "childrenByValue": {},
                            "result": "C"
                        }
                    }
                }
            }
        }
    }
}`

function test_makeParseInfoTree() {
    const tree = makeParseInfoTree([
        "A1: Byte1('A') Int32(0) Byte[]",
        "A2: Byte1('A') Int32(1) Byte[]",
        "B: Byte1('B') Int32 Byte[][]",
        "C: Byte1('C') Int32 Int16[]",
    ])
    // console.log(JSON.stringify(tree, null, 4))
    if (JSON.stringify(tree, null, 4) !== expectedParseTreeJson)
        throw new Error("Characterization test failed, tree didn't match JSON")
}

function test_nextParseInfoTree() {
    const tree = makeParseInfoTree([
        "A1: Byte1('A') Int32(0) Byte[]",
        "A2: Byte1('A') Int32(1) Byte[]",
        "B: Byte1('B') Int16 Byte[][]",
        "C: Byte1('C') Int16 Int16[] Int32(1234)",
    ])

    const validCases = [
        {
            result: 'A1',
            values: ['A'.charCodeAt(0), 0, null],
        },
        {
            result: 'A2',
            values: ['A'.charCodeAt(0), 1, null],
        },
        {
            result: 'C',
            values: ['C'.charCodeAt(0), 100, null, 1234],
        },
    ]

    for (let testCase of validCases) {
        const { result, values } = testCase
        let testTree = tree
        for (let value of values) {
            testTree = nextParseInfoTree(testTree, value)
        }
        if (testTree.result !== result)
            throw new Error(`Expected result: ${result} @ ${JSON.stringify(testTree)}`)
    }
}

function test_nextParseInfoTree_invalid() {
    const tree = makeParseInfoTree([
        "A1: Byte1('A') Int32(0) Byte[]",
        "A2: Byte1('A') Int32(1) Byte[]",
        "B: Byte1('B') Int16 Byte[][]",
        "C: Byte1('C') Int16 Int16[] Int32(1234)",
    ])

    const invalidCases = [
        {
            values: ['D'.charCodeAt(0), 0, null],
        },
        {
            values: ['A'.charCodeAt(0), 2],
        },
        {
            values: ['C'.charCodeAt(0), 100, null, 1235],
        },
    ]

    for (let testCase of invalidCases) {
        const { values } = testCase
        let testTree = tree
        let error = null;
        try {
            for (let value of values) {
                testTree = nextParseInfoTree(testTree, value)
            }
        } catch (_error) {
            error = _error;
        }
        if (error === null) {
            throw new Error(`No error thrown for: ${values.join(', ')}`);
        }
    }
}

test_makeParseInfoTree()
test_nextParseInfoTree()
test_nextParseInfoTree_invalid();