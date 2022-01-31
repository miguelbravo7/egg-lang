const { Value, Word, Apply, Regex } = require('./ast.js');
const { Json2AST } = require('../interpreter/registry.js');

Json2AST.json2node.apply = tree => {
    let obj = new Apply(tree);
    obj.operator = Json2AST.Json2AST(tree.operator);
    obj.args = tree.args.map(arg => Json2AST.Json2AST(arg));
    return obj;
};

Json2AST.json2node.word = tree => {
    let obj = new Word(tree);
    obj.name = tree.name;
    return obj;
};

Json2AST.json2node.value = tree => new Value(tree);

Json2AST.json2node.regex = tree => new Regex(tree);