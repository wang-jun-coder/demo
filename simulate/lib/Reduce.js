function Reduce(callback, initValue) {
    if (!(this instanceof Array)) throw new TypeError('this type is not Array');
    const arr = this;

    let value = typeof initValue === 'undefined' ? arr[0]:initValue;
    const start = typeof initValue === 'undefined' ? 1 : 0;

    for (let i = start; i < arr.length; i++) {
        value = callback(value, arr[i], i, arr);
    }
    return value;
}

module.exports = Reduce;
