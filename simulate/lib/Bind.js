function Bind(ctx) {
    if (!(this instanceof Function)) {
        throw new TypeError('bind must be called by function');
    }
    const self = this;
    const args = Array.prototype.slice.call(arguments, 1);

    function F() {}
    F.prototype = this.prototype;

    function bound() {
        const innerArgs = Array.prototype.slice.call(arguments);
        const finalArgs = args.concat(innerArgs);
        self.apply(this instanceof F ? this : ctx || this, finalArgs);
    }

    bound.prototype = new F();
    return bound;
}


module.exports = Bind;
