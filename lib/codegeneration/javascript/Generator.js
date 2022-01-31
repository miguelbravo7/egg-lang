module.exports = (Visitor) =>
    class Generator extends Visitor {
        emitWord(word) { return `${word}` }
        emitValue(value) { return typeof (value) === 'string' ? `\`${value}\`` : `${value}` }
        emitRegex(expr, flags) { return `new xRegExp(\`${expr}\`, ${flags})` }
        emitApply(name, ...parameters) { return `${name}(${parameters.join(',')})`; }
        emitUnaryExpression(op, rhs) { return `${op} ${rhs}`; }
        emitBinaryExpression(op, lhs, rhs) { return `${lhs} ${op} ${rhs}`; }
        emitDeclaration(name, value) { return `let ${name} = ${value}`; }
        emitAssignment(name, value) { return `${name} = ${value}`; }
        emitLog(...params) { return `console.log(${params.join(',')})`; }
        emitBlock(...sentences) { return `{${sentences.join(';\n')}}`; }
        emitFunction(...args) {
            const body = args.pop();
            return `function(${args.join(',')}) {${body}}`
        }
    }