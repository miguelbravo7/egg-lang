const estraverse = require("estraverse");

module.exports = class Visitor {
    constructor() {
        this.context = {};
    }
    visit(tree) {
        this.context = estraverse.replace(tree, {
            enter: function (_) {
                this.break();
            },
            keys: {
                apply: ["operator", "args"],
                word: [],
                value: [],
                regex: []
            }
        });
        return this.visitSymbol(this.context);
    }
    getChildAt(ctx, idx) { return ctx.args[idx]; }
    getChildren(ctx) { return ctx.args; }
    getName(ctx) { return ctx.name; }
    getValue(ctx) { return ctx.value; }
}