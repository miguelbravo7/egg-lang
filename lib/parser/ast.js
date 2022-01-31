const xRegExp = require("xregexp");

class Value {
    constructor(token) {
        this.type = 'value';
        this.value = token.value;
    }
    evaluate() {
        return this.value;
    }
}

class Word {
    constructor(token) {
        this.type = 'word';
        this.name = token.value;
    }
    evaluate(env) {
        if (this.name in env) {
            return env[this.name];
        } else {
            throw new ReferenceError(`Undefined variable: ${this.name}`);
        }
    }
}

class Apply {
    constructor(tree) {
        this.type = 'apply';
        this.operator = tree;
        this.args = [];
        this.specialforms = require("../interpreter/eggvm.js").specialForms;
    }
    async evaluate(env) {
        if (this.operator.type == 'word' && this.operator.name in this.specialforms) {
            return await this.specialforms[this.operator.name](this.args, env);
        } else try {
            let op = await this.operator.evaluate(env);
            let argsProcessed = await Promise.all(this.args.map((arg) => arg.evaluate(env)));
            if (typeof op === "function") {
                return await op(...argsProcessed);
            } else if (typeof op !== "undefined") {
                let methodName = argsProcessed[0];
                if (typeof op[methodName] !== "undefined") {
                    if (typeof op[methodName] === "function") {
                        return async (...args) => await op[methodName].call(op, ...args);
                    } else {
                        return op[methodName];
                    }
                } else {
                    if (op instanceof Map) {
                        if (typeof op.get(methodName) === "function") {
                            return (...args) => op.get(methodName).call(op, ...args);
                        } else {
                            return op.get(methodName) || op[methodName];
                        }
                    } else
                        throw new SyntaxError(`The method '${methodName}' was not found on the object '${op}'`);
                }
            }
        } catch (err) {
            throw err;
        }
    }
}

class Regex {
    constructor(tree) {
        this.type = 'regex';
        this.expr = tree.expr;
        this.flags = tree.flags;
    }
    evaluate() {
        return new xRegExp(this.expr, this.flags);
    }
}

module.exports = { Value, Word, Apply, Regex };