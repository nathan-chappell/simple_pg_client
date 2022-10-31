const exp = require("node:constants")
const { Readable } = require("node:stream");

const { makeParseInfoTree } = require("./parse_info_tree.js");
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
    ]);
    // console.log(JSON.stringify(tree, null, 4))
    if (JSON.stringify(tree, null, 4) !== expectedParseTreeJson)
        throw new Error("Characterization test failed, tree didn't match JSON");
}

test_makeParseInfoTree();