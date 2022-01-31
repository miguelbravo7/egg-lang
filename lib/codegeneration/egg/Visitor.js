module.exports = (CodeGenerationVisitor) =>
    class Visitor extends CodeGenerationVisitor {
        constructor() {
            super();
            this.symbolTable = {
                apply: this.visitApply,
                word: this.visitWord,
                value: this.visitValue,
                regex: this.visitRegex
            }
            this.applyTypes = {
                generateFunction: new Set(['fun', '->']),
                generateDeclaration: new Set(['def', 'define', ':=']),
                generateLog: new Set(['print']),
                generateAssignment: new Set(['set']),
                generateUnaryExpression: new Set(['++', '--']),
                generateBinaryExpression: new Set(['+', '-', '*', '/', '%', '<<', '>>', '>>>', '<', '<=', '>', '>=', 'in', 'instanceof', '=', '==', '!=', '===', '!==', '&', '^', '|', '&&', '||']),
                generateBlock: new Set(['do', 'block'])
            }
        }
        visitApply(context) {
            for (const entry of Object.entries(this.applyTypes)) {
                if (entry[1].has(context.operator.name))
                    return this[entry[0]](context)
            }
            return this.generateApply(context);
        }
        visitValue(context) { return this.generateValue(context); }
        visitWord(context) { return this.generateWord(context); }
        visitRegex(context) { return this.generateRegex(context); }
        visitUnaryExpression(context) { return this.generateUnaryExpression(context); }
        visitBinaryExpression(context) { return this.generateBinaryExpression(context); }

        visitSymbol(node) {
            const type = this.symbolTable[node.type];
            if (type === undefined) {
                throw new ReferenceError(`Symbol ${type} is undefined.`)
            }
            return this.symbolTable[node.type].bind(this)(node);
        }
    }