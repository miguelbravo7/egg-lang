const Lexer = require('../lib/parser/Lexer.js');

test('test de getTokens', () => {
    let lexer = new Lexer('do()');
    var value = [
        { "begin": 0, "end": 2, "lineno": 1, "type": "WORD", "value": "do" },
        { "begin": 2, "end": 3, "lineno": 1, "type": "LP", "value": "(" },
        { "begin": 3, "end": 4, "lineno": 1, "type": "RP", "value": ")" }];
    expect(lexer.tokens).toEqual(value);

    lexer = new Lexer(`do()
                        xaxa`);
    value = [
        { "begin": 0, "end": 2, "lineno": 1, "type": "WORD", "value": "do" },
        { "begin": 2, "end": 3, "lineno": 1, "type": "LP", "value": "(" },
        { "begin": 3, "end": 4, "lineno": 1, "type": "RP", "value": ")" },
        { "begin": 29, "end": 33, "lineno": 2, "type": "WORD", "value": "xaxa" }];
    expect(lexer.tokens).toEqual(value);
})