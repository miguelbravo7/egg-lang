const chalk = require('chalk');
const { specialForms } = require("../interpreter/eggvm.js");

const eggExit = specialForms.exit = function() {
  console.log(chalk.blue('goodbye'));
  process.exit(0);
};

const HELP = [
  (chalk.blue('help()') + " muestra esta ayuda"),
  (chalk.blue('exit()') + " sale del bucle repl"),
  (chalk.blue('CTRL-D') + " sale del bucle repl"),
];

const help = specialForms.help = () => {
  for (let h of HELP) {
    console.log(h);
  }
  return "-".repeat(HELP[0].length - 10);
};


module.exports = { HELP, help, eggExit };