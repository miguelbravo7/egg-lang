const {
    parse,
    parseFromFile,
    getTokens,
    parBalance
} = require("./lib/parser/parse");

const {
    run,
    runFromFile,
    runFromEVM,
    topEnv,
    specialForms
} = require("./lib/interpreter/eggvm");

const {
    Value,
    Word,
    Apply,
    Regex
} = require("./lib/parser/ast");

const Lexer = require("./lib/parser/Lexer");
const Parser = require("./lib/parser/Parser");

module.exports = {
    Lexer,
    Parser,
    parse,
    parseFromFile,
    getTokens,
    parBalance,
    run,
    runFromFile,
    runFromEVM,
    topEnv,
    specialForms,
    Value,
    Word,
    Apply,
    Regex
};