const topEnv = require('./topEnv.js');

const specialForms = Object.create(null);

specialForms.if = async function (args, env) {
    if (args.length != 3) {
        throw new SyntaxError('Bad number of args to if');
    }
    if (await args[0].evaluate(env) !== false) {
        return await args[1].evaluate(env);
    } else {
        return await args[2].evaluate(env);
    }
};

specialForms.while = async function (args, env) {
    if (args.length != 2) {
        throw new SyntaxError('Bad number of args to while');
    }
    while (await args[0].evaluate(env) !== false) {
        await args[1].evaluate(env);
    }
    return false;
};

specialForms.for = async function (args, env) {
    const forEnv = Object.create(env);
    await args[0].evaluate(forEnv);
    while (await args[1].evaluate(forEnv)) {
        await args[3].evaluate(forEnv);
        await args[2].evaluate(forEnv);
    }
    return false;
};

specialForms.foreach = async function (args, env) {
    const localEnv = Object.create(env);
    const iterable = await args[1].evaluate(localEnv);
    for (const val of iterable) {
        localEnv[args[0].name] = val;
        await args[2].evaluate(localEnv);
    }
    return false;
};

specialForms.arr = specialForms.array = async function (args, env) {
    return await Promise.all(args.map(async arg => await arg.evaluate(env)));
};

specialForms.object = async function (args, env) {
    const obj = {};
    const objEnv = Object.create(env);
    objEnv["this"] = obj;
    for (let i = 0; i < args.length; i += 2) {
        const name = await args[i].evaluate(objEnv);
        const value = await args[i + 1].evaluate(objEnv);
        obj[name] = value;
    }
    return obj;
};

specialForms.do = specialForms.block = async function (args, env) {
    let value = false;
    for (const arg of args) {
        value = await arg.evaluate(env);
    }
    return value;
};


specialForms.parallel = async function (args, env) {
    return await Promise.allSettled(args.map(async arg => await arg.evaluate(env))).catch(err => console.log(err.message));
};

specialForms.def = specialForms.define = specialForms[":="] = async function (args, env) {
    if (args.length != 2 || args[0].type != 'word') {
        throw new SyntaxError('Bad use of define');
    } else if (args[0].name in specialForms || args[0].name in topEnv) {
        throw new Error('Invalid identifier, conflict with environment specific id');
    }
    let value = await args[1].evaluate(env);
    env[args[0].name] = value;
    return value;
};

let parameterValidator = (acc, expr) => {
    if (expr.type == 'word') {
        acc[0].push(expr.name);
        return acc;
    } else if (expr.type == 'apply') {
        acc[1].push(expr);
        return acc;
    }
    throw new SyntaxError(`Argument error due to invalid expression caused by ${expr.type}`);
};

specialForms['->'] = specialForms.fun = async function (args, env) {
    if (!args.length) {
        throw new SyntaxError('Functions need a body.');
    }
    let [parameters, otherParameters] = args.slice(0, args.length - 1).reduce(parameterValidator, [[], []]);
    let body = args[args.length - 1];

    async function curryFunction() {
        let argLength = Math.min(arguments.length, parameters.length) + this.args_given;
        if (argLength > parameters.length && otherParameters.length == 0) {
            throw new TypeError('Arguments exceed the number of parameters.');
        }
        let temp_env = Object.create(this.localEnv);
        for (let i = 0; this.args_given + i < argLength; i++) {
            temp_env[parameters[this.args_given + i]] = arguments[i];
        }
        if (argLength >= parameters.length) {
            let extraArguments = [...arguments].slice(parameters.length - this.args_given);
            for (let i = 0; i < otherParameters.length; i++) {
                otherParameters[i].args.push(extraArguments);
                await otherParameters[i].evaluate(temp_env);
            }
            return await body.evaluate(temp_env);
        }
        else {
            return this.curryFunction.bind({
                localEnv: temp_env,
                args_given: argLength,
                'curryFunction': curryFunction
            });
        }
    }
    return curryFunction.bind({
        localEnv: Object.create(env),
        args_given: 0,
        'curryFunction': curryFunction
    });
};

specialForms.spread = specialForms['...'] = async function (args, env) {
    let identifier = args[0].name;
    let value = await args[1].evaluate(env);
    if (!env[identifier]) {
        env[identifier] = [...value];
        args[1].splice(0, args[1].length);
    } else {
        if (env[identifier] instanceof Array) {
            env[identifier] = env[identifier].concat(value);
        } else {
            Object.assign(env[identifier], value);
        }
    }
    args.splice(1, 1);
    return value;
};

specialForms.default = async function (args, env) {
    let identifier = args[0].name;
    let value = await (args[2][0] || args[1]).evaluate(env);
    env[identifier] = value;
    if (!!args[2][0]) {
        args[2].shift();
    }
    args.splice(2, 1);
    return value;
};

[
    '',
    '+',
    '-',
    '*',
    '/',
    '%',
    '<<',
    '>>',
    '>>>',
    '&',
    '^',
    '|',
    '&&',
    '||',
    // '??=' //Nullish coalescing operator - node version 14.0.0
].forEach(op => {
    specialForms[op + '='] = async function (args, env) {
        if (args[0].type != 'word') {
            throw new SyntaxError('Bad use of set');
        }
        let valName = args[0].name;
        let value = await args[args.length - 1].evaluate(env);
        let indices = await Promise.all(args.slice(1, -1).map(async arg => await arg.evaluate(env)));

        for (let scope = env; scope; scope = Object.getPrototypeOf(scope)) {
            if (Object.prototype.hasOwnProperty.call(scope, valName)) {
                if (indices.length === 0) {
                    scope[valName] = value;
                } else {  // Equivalent to: await scope[valName]['='](value, ...indices);
                    let tmp = scope[valName];
                    for (i = 0; i < indices.length - 1; i++) {
                        tmp = tmp[indices[i]];
                    }
                    if (!!op) {
                        value = new Function('a, b', `return a${op}b`)(value, tmp[indices[indices.length - 1]]);
                    }
                    tmp[indices[indices.length - 1]] = value;
                }
                return value;
            }
        }
        throw new ReferenceError(`Tried setting an undefined variable: ${valName}`);
    };
});

specialForms.set = specialForms["="];

[
    '++',
    '--'
].forEach(op => {
    specialForms[op] = async function (args, env) {
        let value = await args[0].evaluate(env);
        env[args[0].name] = new Function('a', `return ${op}a;`)(value);
    };
});

function unpatchObject(obj) {
    let deletedProperties = {};
    for (const key of Object.keys(Object.prototype)) {
        deletedProperties[key] = Object.prototype[key];
        delete Object.prototype[key];
    }
    return deletedProperties;
}

specialForms.use = async function (args, env) {
    const path = await args[0].evaluate(env);
    const disabledProperties = unpatchObject(Object);
    let pkg = require(path);
    Object.assign(env, pkg.topEnv);
    delete pkg.topEnv;
    Object.assign(specialForms, pkg.specialForms);
    delete pkg.specialForms;
    // Rearm Object prototype
    Object.assign(Object.prototype, disabledProperties);
    return pkg;
};

module.exports = specialForms;