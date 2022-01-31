const EggVisitor = require('./egg/Visitor');
const JavascriptGenerator = require('./javascript/Generator');
const codeGenerationVisitor = require('./CodeGenerationVisitor');
const Visitor = require("./Visitor");

const Transpiler = JavascriptGenerator(
    EggVisitor(
        codeGenerationVisitor(
            Visitor
        )
    )
)

module.exports = {
    egg: {
        javascript: new Transpiler()
    }
}