const Parser = require('../lib/parser/Parser.js');
const { Apply, Word } = require('../lib/parser/ast.js');

test('test de parse numbers', () => {
    var value = { type: 'value', value: 1 };
    let parser = new Parser('1');
    expect(parser.parse()).toEqual(value);
});

test('parse strings', () => {
    let parser = new Parser('"s"');
    var value = { type: 'value', value: 's' };
    expect(parser.parse()).toEqual(value);
});

test('parse with comments', () => {
    let parser = new Parser("a # one\n   # two\n()");
    var value = new Apply(new Word({ value: "a" }));
    expect(parser.parse()).toEqual(value);
});

test("parse word not followed by '('", () => {
    let parser = new Parser('word');
    var value = { type: 'word', name: 'word' };
    expect(parser.parse()).toEqual(value);
});

test("parse apply if word followed by '('", () => {
    let parser = new Parser('word(a)');
    var value = new Apply(new Word({ value: 'word' }));
    value.args= [new Word({ value: 'a' })];
    expect(parser.parse()).toEqual(value);
});

test('syntax error if not valid', () => {
    let parser = new Parser('');
    try {
        parser.parse('');
    } catch (error) {
        expect(error.message).toBe("Cannot read property 'type' of null");
    }
});