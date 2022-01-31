const sinon = require("sinon");
const vm = require('../lib/interpreter/eggvm.js');

let testFile = async (msg, file, outputs) => {
    test(msg, async () => {
        await vm.runFromFile(file);
        expect(console.log.args).toEqual(outputs);
    });
};

beforeEach(() => {
    sinon.stub(console, "log");
});

afterEach(() => {
    console.log.restore();
});

module.exports = {
    testFile
};