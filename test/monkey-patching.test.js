const vm = require('../lib/interpreter/eggvm.js');
const { testFile } = require('./utilities.js');

testFile('test de eggvm',
    'test/example/multi-sub-array.egg',
    [[4], [4]]
);

testFile('test de eggvm',
    'test/example/set-multiarray.egg',
    [[[[1, 5], [3, 4]]]]
);