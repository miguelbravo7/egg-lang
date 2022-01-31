const fs = require("fs");
const Parser = require("./Parser.js");
const Lexer = require("./Lexer.js");

function parse(program) {
  return new Parser(program).parse();
}

function parseFromFile(fileName) {
  let tree, program;
  try {
    program = fs.readFileSync(fileName, 'utf8');
  } catch (err) {
    console.error('Current directory: ' + __dirname);
    throw err;
  }
  tree = parse(program);
  return tree;
}

function parBalance(line) {
  let stack = 0;
  let lexer = new Lexer(line);
  for (let token of lexer.tokens) {
    if (!token) break;
    if (token.type == 'LP') {
      stack++;
    }
    else if (token.type == 'RP') {
      stack--;
    }
  }
  return stack;
}

module.exports = {
  parse,
  parseFromFile,
  parBalance,
};