const vm = require('../lib/interpreter/eggvm.js');
const { testFile } = require('./utilities.js');

describe('Manejo de errores', () => {
    test('test de error de scope en eggvm', async () => {
        var expected = 'Tried setting an undefined variable: quux';
        try {
            await vm.run(`set(quux, true)`).catch(err => error = err);
        } catch (error) {
            expect(error.message).toEqual(expected);
        }
    });
});

describe('Pruebas a las funciones', () => {
    test('test de eggvm', async () => {
        var expected = [[50]];
        await vm.run(`
        do(define(x, 4),
        define(setx, fun(val, set(x, val))),
        setx(50),
        print(x))
        `);
        expect(console.log.args).toEqual(expected);
    });
    testFile('reto eggvm', 'test/example/reto.egg', [['sum(array[1, 2, 3]) := 6']]);
    testFile('test de llamada a metodos curry',
        'test/example/curry.egg',
        [[1, 2], [2, 1]]
    );
    testFile('test de llamada a metodos curry con valores por defecto',
        'test/example/default.egg',
        [[1, 2, 5], [2, 1, 5], [1, 2, 7], [2, 1, 9]]
    );
    testFile('test de llamada a metodos curry con con el operador spread',
        'test/example/spread.egg',
        [[1, 2, []], [2, 1, []], [1, 2, [7, 8, 9]], [2, 1, [10, 11, 12]]]
    );
});

describe('Pruebas a los objetos', () => {
    testFile('Indices negativos',
        'test/example/array-neg.egg',
        [[[2, 3]]]
    );
    testFile('Multi-indexado con indices negativos',
        'test/example/array-index.egg',
        [[1], [[2, 3]], [3], [3], [2]]
    );
    testFile('Multi-indexado con setter',
        'test/example/array-set-index.egg',
        [[[1, 2, 9, [9, 1000, 7]]]]
    );
    testFile('test de llamada al operador spread en arrays',
        'test/example/array-spread.egg',
        [[[1]], [[1, 2, 3]]]
    );
});

describe('Pruebas a los expresiones regulares', () => {
    test('prueba al metodo runFromEVM con Regexp', async () => {
        let match = ['a 42', 'a', '42'];
        match.groups = undefined;
        match.index = 4;
        match.input = ';;; a 42';
        var expected = [[true], [match]];
        await vm.runFromEVM('test/example/regex-simple.evm');
        expect(console.log.args).toEqual(expected);
    });
});

describe('Pruebas miscelaneas', () => {
    test('prueba al metodo runFromEVM', async () => {
        let expected = [[50]];
        await vm.runFromEVM('test/example/one.evm');
        expect(console.log.args).toEqual(expected);
    });
    test('test de llamada a metodos validos del objeto', async () => {
        var expected = [[5], ['4.00']];
        actual = await vm.run(`do(
            print("hello"("length")),
            print(4("toFixed")(2))
            )`);
        expect(console.log.args).toEqual(expected);
    });
});

describe('Pruebas a los metodos de specialForms', () => {
    testFile('Test for-loop',
        'test/example/for.egg',
        [[0], [1], [2], [3], [4]]
    );
    testFile('Test foreach-loop',
        'test/example/foreach.egg',
        [[1], [2], [3], ['A'], ['B'], ['C']]
    );
    testFile('Test objetos',
        'test/example/objects.egg',
        [[0], [4], [5]]
    );
    testFile('Test monkey-patching objetos',
        'test/example/monkey-patching-assign.egg',
        [[[-5]]]
    );
    testFile('Test DOT syntactic sugar',
        'test/example/dot-obj-2.egg',
        [[3], [3], [3], [5], [5]]
    );
    testFile('Test require',
        'test/example/client.egg',
        [['inside module'], [5]]
    );
});