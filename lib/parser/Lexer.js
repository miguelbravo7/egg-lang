const tokens = require("./tokens.js");

module.exports = class Lexer {

    constructor(program) {
        this.program = program;
        this.lineno = 1;
        this.last_index = 0;
        this.token_arr_index = 0;
        this.relevant_tokens = [tokens.String, tokens.Number, tokens.Regex, tokens.LP, tokens.Comma, tokens.RP, tokens.Word].map(token => new token());
        this.other_tokens = [tokens.Whites, tokens.Comment].map(token => new token());
        this.newline_token = new tokens.Newline();
        this.token_arr = this.tokens;
        this.updateAllTokenIndexes(0);
    }

    get tokens() {
        if (this.token_arr === undefined) {
            let token = null;
            this.token_arr = [];
            this.updateAllTokenIndexes(0);
            do {
                token = this.lex();
                this.token_arr.push(token);
            } while (token);
            this.token_arr.pop();
            this.updateAllTokenIndexes(0);
            this.tokenFixation();
        }
        return this.token_arr;
    }

    lex() {
        let match;

        this.skipSpace(this.program);

        if (this.program.length != this.last_index) {
            let flag = true;
            for (const item of this.relevant_tokens) {
                match = item.exp.exec(this.program);
                if (match) {
                    this.lookahead = item.compute(match);
                    this.lookahead.begin = this.last_index;
                    this.lookahead.end = item.exp.lastIndex;
                    this.lookahead.lineno = this.lineno;
                    this.updateAllTokenIndexes(item.exp.lastIndex);
                    flag = false;
                    break;
                }
            }
            if (flag) {
                throw new SyntaxError(`Unexpect syntax line ${this.lineno}: 
                '${this.program.slice(this.last_index, this.last_index + 10)}'`);
            }
        }
        else {
            this.lookahead = null;
        }
        return this.lookahead;
    }

    skipSpace(string) {
        var previous_length;
        do {
            previous_length = this.last_index;

            for (const re of this.other_tokens) {
                let match = re.exp.exec(string);
                if (re.exp.lastIndex !== 0) {
                    this.updateAllTokenIndexes(re.exp.lastIndex);
                    if (this.newline_token.exp.test(match[0])) {
                        this.lineno += match[0].split(this.newline_token.exp).length - 1;
                    }
                } else {
                    re.exp.lastIndex = this.last_index;
                }
            }
        } while (previous_length != this.last_index);
    }

    updateAllTokenIndexes(index) {
        this.last_index = index;
        let tokens = [...this.relevant_tokens, ...this.other_tokens, this.newline_token];
        tokens.forEach((token) => { token.exp.lastIndex = index; });
    }

    tokenFixation() {
        this.token_arr.forEach((token, index) => {
            if (this.token_arr[index + 1] && (this.token_arr[index + 1].value == ":") && (token.type == 'WORD')) {
                this.token_arr[index + 1].value = ",";
                token.type = 'STRING';
            } else if (token.type === "LP" && token.value === ".") {
                token.value = "(";
                if (this.token_arr[index + 1] && this.token_arr[index + 1].type === "WORD") {
                    this.token_arr[index + 1].type = "STRING";
                }
                this.token_arr.splice(index + 2, 0, { type: "RP", value: ")" });
            }
        });
    }

    nextToken() {
        if (this.lookahead !== null) {
            this.token_arr_index++;
        }
        this.lookahead = this.token_arr[this.token_arr_index] || null;
        return this.lookahead;
    }
};
