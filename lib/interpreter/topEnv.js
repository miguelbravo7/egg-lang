const parser = require('../parser/parse.js');

let topEnv = Object.create(null);//new Map();

// no enumerable, no configurable, no writable por defecto
Object.defineProperty(topEnv, 'true', { value: true });
Object.defineProperty(topEnv, 'false', { value: false });
Object.defineProperty(topEnv, 'null', { value: null });
Object.defineProperty(topEnv, 'undefined', { value: undefined });
Object.defineProperty(topEnv, 'RegExp', { value: require('xregexp') });

[
    '+',
    '-',

    '*',
    '/',
    '%',

    '<<',
    '>>',
    '>>>',

    '<',
    '<=',
    '>',
    '>=',
    'in',
    'instanceof',

    '==',
    '!=',
    '===',
    '!==',

    '&',

    '^',

    // '??', //Nullish coalescing operator - node version 14.0.0

    '&&',

    '||',
].forEach(op => {
    Object.defineProperty(topEnv, op, { value: new Function('a, b', `return a ${op} b;`) });
});

[
    '!',
    '~',
    // 'typeof',
    // 'delete',
].forEach(op => {
    Object.defineProperty(topEnv, op, { value: new Function('a', `return ${op} a;`) });
});

Object.defineProperty(topEnv, 'print', {
    value: function (...values) {
        return console.log(...values);
    }
});

Object.defineProperties(topEnv, {
    'arr': {
        value: function (...args) {
            return args;
        }
    }, 'array': function () { return this.arr; }
});

Object.defineProperties(topEnv, {
    'length': {
        value: function (array) {
            return array.length;
        }
    }, 'len': function () { return this.length; }
});

Object.defineProperties(topEnv, {
    "element": {
        value: function (array, ...indexes) {
            return array.sub(...indexes);
        }
    }, '[]': function () { return this.element; },
    "<-": function () { return this.element; }
});

Object.defineProperty(topEnv, 'sum', {
    value: function (array) {
        return array.reduce((a, b) => a + b, 0);
    }
});

Object.defineProperty(topEnv, 'map', {
    value: function (...args) {
        if (args.length % 2) {
            throw new SyntaxError(`Error: Number of parameters must be even when building a Map "${args}"`);
        }
        let map = new Map();
        for (let i = 0; i < args.length; i += 2) {
            map.set(args[i], args[i + 1]);
        }
        return map;
    }
});

Object.defineProperty(topEnv, 'require', {
    value: async function (path) {
        if (!topEnv.require.cache.has(path)) {
            const tree = parser.parseFromFile(path);
            const env = Object.create(topEnv);

            const module = await tree.evaluate(env);

            topEnv.require.cache.set(path, module);
        }
        return topEnv.require.cache.get(path);
    }
});

Object.defineProperty(topEnv.require, 'cache', { value: new Map() });

module.exports = topEnv;