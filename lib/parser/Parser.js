const { Value, Word, Apply, Regex } = require("./ast.js");
const Lexer = require("./Lexer.js");

module.exports = class Parser {

    constructor(program) {
        this.lexer = new Lexer(program);
    }

    get lookahead() {
        return this.lexer.lookahead;
    }

    nextToken() {
        return this.lexer.nextToken();
    }

    parseExpression() {
        var expr;

        if (this.lookahead.type == "STRING" || this.lookahead.type == "NUMBER") {
            expr = new Value(this.lookahead);
        } else if (this.lookahead.type == "WORD") {
            expr = new Word(this.lookahead);
        } else if (this.lookahead.type == "REGEX") {
            expr = new Regex(this.lookahead);
        } else {
            throw new SyntaxError(`Unexpected syntax line ${this.lookahead.lineno}: 
            '${this.lexer.program.slice(this.lookahead.begin, this.lookahead.end)}'`);
        }
        this.nextToken();
        return this.parseApply(expr);
    }

    parseApply(tree) {

        if (!this.lookahead || this.lookahead.type !== "LP") { // no apply
            return tree;
        }

        this.nextToken();

        tree = new Apply(tree);

        while (this.lookahead && this.lookahead.type !== "RP") {
            let arg = this.parseExpression();
            tree.args.push(arg);

            if (this.lookahead && this.lookahead.type == "COMMA") {
                this.nextToken();
            } else if (!this.lookahead || this.lookahead.type !== "RP") {
                throw new SyntaxError(`Expected ',' or ')'  at line ${this.lookahead.lineno}:
                '${this.lexer.program.slice(this.lookahead.begin, this.lookahead.end)}'`);
            }
        }
        this.nextToken();

        if (!this.lookahead) {
            return tree;
        }
        return this.parseApply(tree);
    }

    parse() {
        this.nextToken();
        let result = this.parseExpression();
        if (this.lookahead !== null) {
            throw new SyntaxError(`Unexpected input after reached the end of parsing at line ${this.lookahead.lineno}:
            '${this.lexer.program.slice(this.lookahead.begin, this.lookahead.end)}'`);
        }
        this.lexer.updateAllTokenIndexes(0);

        return result;
    }

};