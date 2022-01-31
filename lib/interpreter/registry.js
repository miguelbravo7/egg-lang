class Json2AST {    
    static unknownNode(tree) {
        throw new SyntaxError(`Unrecognized token ${tree}`);
    }
    
    static Json2AST(tree) {
        if (tree && tree.type && this.json2node[tree.type](tree)){
            return this.json2node[tree.type](tree);
        }else {
            this.unknownNode(tree);
        }
    }
}

Json2AST.json2node = Object.create(null);

module.exports = {
    Json2AST
};