#!/usr/bin/env node

const commander = require("commander");
const process = require("process");
const { runFromFile, runFromEVM } = require('../lib/interpreter/eggvm.js');
const run = require('../lib/repl/egg_repl.js')

commander
    .version(require("../package.json").version)
    .option("-r --run <file_path>", "Run an egg program")
    .option("-c --compile <file_path>", "Generate AST of egg program")
    .parse(process.argv);

const fileName = process.argv.slice(2).shift();
if (commander.run) {
    if (commander.run.split('.').pop() === 'evm') {
        runFromEVM(commander.run);
    } else {
        runFromFile(commander.run);
    }
} else if (commander.compile) {
    let json = JSON.stringify(parseFromFile(commander.compile), null, 2); // Pretty stringify
    console.log(json); 
} else {
    run();
}