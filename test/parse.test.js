const parser = require('../lib/parser/parse.js');

test('test de parse from file', () => {
    var value = "Unexpected input after reached the end of parsing at line 1: 5) ; Calling ...";
    try {
        parser.parseFromFile('test/example/number-as-fun-err.egg');
    } catch (error) {
        expect(error.message).toEqual(value);
    }
});

test('test de parBalance', () => {
    expect(parser.parBalance('(())')).toEqual(0);
    expect(parser.parBalance(')}]')).toEqual(-3);
    expect(parser.parBalance('([{')).toEqual(3);
    expect(parser.parBalance('((}]')).toEqual(0);
    expect(parser.parBalance('{[))')).toEqual(0);
});