const assert = require('assert');
const bind = require('../lib/Bind');


describe('bind 测试', function () {

    it('should bind return 1', function () {
        function foo(a) {
            this.a = a;
        }
        const obj1 = {};
        bind.call(foo, obj1, 2)();
        assert(obj1.a === 2, 'obj1.a should be 2');

        const obj2 = {};
        bind.call(foo, obj2)(3);
        assert(obj2.a === 3, 'obj2.a should be 3');

    });

    it('should bind return 3', function () {
        function foo(a) {
            this.a = a;
        }

        const obj1 = {};
        bind.call(foo, obj1)(2);
        assert(obj1.a === 2, 'obj1.a should be 3');

        const bar = bind.call(foo, obj1);
        const newBar = new bar(3);
        assert(newBar.a === 3, 'new bar.a should be 3');
    });

    it('should throw error', function () {
        const a = {
            bind
        };

        const b = {
            name: 'b'
        };

        let error = null;
        try {
            a.bind(b);
        } catch (e) {
            error = e;
        } finally {
            assert(error instanceof TypeError, 'should get a TypeError');
        }
    });


});
