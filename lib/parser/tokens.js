class Token {
    constructor(type, exp) {
        this.type = type;
        this.exp = exp;
    }

    compute(match) {
        return { type: this.type, value: match[0] };
    }
}

class Word extends Token {
    constructor() {
        super("WORD", /[^\s(){}\[\],"\.]+(?<!:)|\.\.\./y);
    }
}

class Regex extends Token {
    constructor() {
        super("REGEX", /r\/([^]+?(?<!\\|\/))\/([nsxAgimuy]*)/y);
    }
    compute(match) {
        return { type: this.type, expr: match[1], flags: match[2] };
    }
}
class String extends Token {
    constructor() {
        super("STRING", /"((?:[^"\\]|\\.)*)"/y);
    }
    compute(match) {
        return { type: this.type, value: match[1] };
    }
}
class Number extends Token {
    constructor() {
        super("NUMBER", /([-+]?\d*\.?\d+([eE][-+]?\d+)?)/y);
    }
    compute(match) {
        return { type: this.type, value: parseInt(match[1]) };
    }
}
class LP extends Token {
    constructor() {
        super("LP", /[\[({\.](?!\.)/y);
    }
}
class RP extends Token {
    constructor() {
        super("RP", /[\])}]/y);
    }
}
class Comma extends Token {
    constructor() {
        super("COMMA", /,|:(?!=)/y);
    }
}
class Newline extends Token {
    constructor() {
        super("NEWLINE", /\r\n|\r|\n/);
    }
}
class Whites extends Token {
    constructor() {
        super("WHITE", /\s+/y);
    }
}
class Comment extends Token {
    constructor() {
        super("COMMENT", /[#;][^\r\n]*|\/\*.*?\*\//y);
    }
}

module.exports = {
    Word,
    Regex,
    String,
    Number,
    LP,
    RP,
    Comma,
    Whites,
    Comment,
    Newline,
};