const assert = require('assert');
const apply = require('../lib/Apply');

describe('apply 测试', function () {
    it('should return "a"', function () {
        const a = {
            name: 'a',
            fn: function afn(val) {

                return `${this.name} -- ${val}`;
            }
        };
        const b = {
            name: 'b',
            fn: function bfn(val) {
                return `${this.name} -- ${val}`;
            }
        };

        const fn = b.fn;
        let result = fn.apply(a, [1]);
        assert(result === 'a -- 1', 'should be return a');

        result = apply.call(fn, a, [1]);
        assert(result === 'a -- 1', 'should be return a');

    });
});
