const readline = require('readline');
const { topEnv, specialForms } = require('../interpreter/eggvm.js');
const { parse, parBalance } = require('../parser/parse.js');
const { eggExit, help } = require("./extensions.js");

const Lexer = require("../parser/Lexer.js");

const chalk = require("chalk");
const PROMPT = "> ";
const VERSION = require("../../package.json").version;

const tokens = require('../parser/tokens.js');
const ALLWHITE = new RegExp('^' + new tokens.Whites().exp.source + "$");

function run() {
  let program = "";
  let stack = 0;
  try {
    const rl_interface = readline.createInterface(process.stdin, process.stdout, completer);
    process.stdin.on("end", eggExit);
    rl_interface.prompt(PROMPT);
    console.log("Version " + VERSION);
    rl_interface.prompt();
    rl_interface.on('line', function (line) {
      stack += parBalance(line);

      line = line + '\n';
      program += line;
      if (stack <= 0 && !ALLWHITE.test(program)) {
        if ("end" == line.trim()) {
          rl_interface.close();
        }
        try {
          parse(program).evaluate(topEnv);
        } catch (e) {
          console.log(chalk.red(e.stack));
        }
        program = "";
        stack = 0;
      }
      rl_interface.setPrompt(PROMPT + "..".repeat(stack));
      rl_interface.prompt();
    });
    rl_interface.on('close', eggExit);

    rl_interface.on('SIGINT', () => {
      console.log(chalk.red("Expression discarded!"));
      program = "";
      stack = 0;
      rl_interface.setPrompt(PROMPT);
      rl_interface.prompt();
    });

  }
  catch (err) {
    console.log(chalk.red(err.stack));
    help();
  }

}

function completer(line) {
  var word = new Lexer(line).tokens.filter((t) => t && t.type === 'WORD').pop().value;
  var hits = Object.keys(specialForms).concat(Object.keys(topEnv)).filter((key) => key.startsWith(word));

  return [hits, word];
}

module.exports = run;