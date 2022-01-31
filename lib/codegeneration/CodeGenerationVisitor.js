module.exports = (Visitor) =>
    class CodeGenerationVisitor extends Visitor {
        generateWord(context) { return this.emitWord(this.getName(context)); }
        generateValue(context) { return this.emitValue(this.getValue(context)); }
        generateRegex(context) { return this.emitRegex(context.expr, context.flags); }
        generateLog(context) { return this.emitLog(...this.getChildren(context).map(child => this.visit(child))) }
        generateAssignment(context) {
            return this.emitAssignment(
                this.visit(this.getChildAt(context, 0)),
                this.visit(this.getChildAt(context, 1))
            );
        }
        generateApply(context) {
            return this.emitApply(
                this.visit(context.operator),
                ...this.getChildren(context).map(child => this.visit(child))
            );
        }
        generateDeclaration(context) {
            return this.emitDeclaration(
                this.visit(this.getChildAt(context, 0)),
                this.visit(this.getChildAt(context, 1))
            );
        }
        generateUnaryExpression(context) {
            const operator = this.visit(context.operator);
            const stmt = this.visit(this.getChildAt(context, 0));
            return this.emitUnaryExpression(operator, stmt);
        }
        generateBinaryExpression(context) {
            const operator = this.visit(context.operator);
            const lstmt = this.visit(this.getChildAt(context, 0));
            const rstmt = this.visit(this.getChildAt(context, 1));
            return this.emitBinaryExpression(operator, lstmt, rstmt);
        }
        generateFunction(context) {
            return this.emitFunction(...this.getChildren(context).map(child => this.visit(child)))
        }
        generateBlock(context) {
            const sentences = this.getChildren(context).map(child => this.visit(child));
            return this.emitBlock(...sentences);
        }
    };