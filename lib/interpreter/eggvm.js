const fs = require("fs");

const topEnv = require('./topEnv.js');
const specialForms = require('./specialForms.js');

const { Json2AST } = require('./registry.js');
require('../parser/json2AST.js');

async function run(program) {
  let env = Object.create(topEnv);
  let tree = require('../parser/parse.js').parse(program);
  require("./monkey-patching.js");
  return await tree.evaluate(env);
}

async function runFromFile(fileName) {
  try {
    let program = fs.readFileSync(fileName, 'utf8');
    return await run(program);
  }
  catch (err) {
    console.log(err.stack);
  }
}

async function runFromEVM(fileName) {
  try {
    let json = fs.readFileSync(fileName, 'utf8');
    let tree = Json2AST.Json2AST(JSON.parse(json));
    let env = Object.create(topEnv);
    return await tree.evaluate(env);
  }
  catch (err) {
    console.log(err.stack);
  }
}

module.exports = {
  run,
  runFromFile,
  runFromEVM,
  topEnv,
  specialForms
};