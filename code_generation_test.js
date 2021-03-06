const { egg } = require("./lib/codegeneration");

var a = {
    "type": "apply",
    "operator": {
        "type": "word",
        "name": "do"
    },
    "args": [
        {
            "type": "apply",
            "operator": {
                "type": "word",
                "name": "define"
            },
            "args": [
                {
                    "type": "word",
                    "name": "x"
                },
                {
                    "type": "value",
                    "value": 4
                }
            ]
        },
        {
            "type": "apply",
            "operator": {
                "type": "word",
                "name": "define"
            },
            "args": [
                {
                    "type": "word",
                    "name": "setx"
                },
                {
                    "type": "apply",
                    "operator": {
                        "type": "word",
                        "name": "fun"
                    },
                    "args": [
                        {
                            "type": "word",
                            "name": "val"
                        },
                        {
                            "type": "apply",
                            "operator": {
                                "type": "word",
                                "name": "set"
                            },
                            "args": [
                                {
                                    "type": "word",
                                    "name": "x"
                                },
                                {
                                    "type": "word",
                                    "name": "val"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "apply",
            "operator": {
                "type": "word",
                "name": "setx"
            },
            "args": [
                {
                    "type": "value",
                    "value": 50
                }
            ]
        },
        {
            "type": "apply",
            "operator": {
                "type": "word",
                "name": "print"
            },
            "args": [
                {
                    "type": "word",
                    "name": "x"
                }
            ]
        }
    ]
}
console.log(egg.javascript.visit(a))

tree = {
    "type": "apply",
    "operator": {
        "type": "word",
        "name": "do"
    },
    "args": [
        {
            "type": "apply",
            "operator": {
                "type": "word",
                "name": ":="
            },
            "args": [
                {
                    "type": "word",
                    "name": "r"
                },
                {
                    "type": "regex",
                    "expr": "(\\w+)\r\n        \\s+\r\n        (\\d+)  # numero \r\n        ",
                    "flags": "x"
                }
            ]
        },
        {
            "type": "apply",
            "operator": {
                "type": "word",
                "name": ":="
            },
            "args": [
                {
                    "type": "word",
                    "name": "s"
                },
                {
                    "type": "apply",
                    "operator": {
                        "type": "apply",
                        "operator": {
                            "type": "word",
                            "name": "r"
                        },
                        "args": [
                            {
                                "type": "value",
                                "value": "test"
                            }
                        ]
                    },
                    "args": [
                        {
                            "type": "value",
                            "value": "a 4"
                        }
                    ]
                }
            ]
        },
        {
            "type": "apply",
            "operator": {
                "type": "word",
                "name": ":="
            },
            "args": [
                {
                    "type": "word",
                    "name": "m"
                },
                {
                    "type": "apply",
                    "operator": {
                        "type": "apply",
                        "operator": {
                            "type": "word",
                            "name": "r"
                        },
                        "args": [
                            {
                                "type": "value",
                                "value": "exec"
                            }
                        ]
                    },
                    "args": [
                        {
                            "type": "value",
                            "value": ";;; a 42"
                        }
                    ]
                }
            ]
        },
        {
            "type": "apply",
            "operator": {
                "type": "word",
                "name": "print"
            },
            "args": [
                {
                    "type": "word",
                    "name": "s"
                }
            ]
        },
        {
            "type": "apply",
            "operator": {
                "type": "word",
                "name": "print"
            },
            "args": [
                {
                    "type": "word",
                    "name": "m"
                }
            ]
        }
    ]
}
console.log(egg.javascript.visit(tree))