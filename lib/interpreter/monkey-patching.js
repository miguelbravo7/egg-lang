const checkIterable = (object, length) => {
    if (length === 0) {
        throw new SyntaxError("At least one index must be passed to sub");
    }

    if (object instanceof Number || object instanceof String) {
        throw new TypeError(`The object '${object}'' is not indexable!`);
    }
};

const getValidIndex = (length, index) => {
    if (index < 0) {
        index = length + index;
    }

    if (index > length) {
        throw new RangeError(`Index ${index} is out of bounds. Array size: ${length}`);
    }

    return index;
};

Object.prototype.sub = function (...indices) {
    checkIterable(this, indices.length);
    let index = indices[0];
    if (this instanceof Array) {
        index = getValidIndex(this.length, indices[0]);
    }
    let value;
    if (this instanceof Map) {
        value = this.get(index) || this[index];
    } else {
        value = this[index];
    }

    if (indices.length == 1) {
        return value;
    } else {
        return value.sub(...indices.slice(1));
    }
};

Object.prototype["="] = function (value, ...indices) {
    if (indices.length < 1) {
        throw new SyntaxError('Bad use of set');
    }
    checkIterable(this, indices.length);
    let index = indices[0];
    if (this instanceof Array) {
        index = getValidIndex(this.length, indices[0]);
    }
    if (indices.length === 1) {
        if (this instanceof Map) {
            this.set(index, value);
        } else {
            this[index] = value;
        }
        return value;
    }

    const obj = this.sub(index);
    return obj["="](value, ...indices.slice(1));
};

Object.prototype.evaluate = function(_) {
    return this.valueOf();
};