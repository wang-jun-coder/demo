function apply(target, args) {
    if (typeof this !== 'function') {
        throw new TypeError('apply must be called by function');
    }

    if (!target) target = this;
    if (!args) args = [];

    target = new Object(target);
    const key = Symbol('applyKey');
    target[key] = this;

    const result = target[key](...args);
    delete target[key];
    return result;
}

module.exports = apply;
