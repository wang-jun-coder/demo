const assert = require('assert');
const Reduce = require('../lib/Reduce');

describe('reduce 测试', function () {

    it('should return 10', function () {
        const testArr = [1, 2, 3, 4];
        const result = Reduce.call(testArr, (totoal, current) => {
            return totoal + current;
        });

        assert(result === 10, 'should be return 10');

    });

    it('should return 15', function () {
        const testArr = [1, 2, 3, 4];
        const result = Reduce.call(testArr, (totoal, current) => {
            return totoal + current;
        }, 5);
        assert(result === 15, 'should be return 10');
    });

    it('should promise return 3', function (done) {

        const promiseChain = (array, value) => {
            Reduce.call(array, (p, current) => p.then(current), Promise.resolve(value));
        };

        const f1 = val => {
            val ++;
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(val), 100);
            })
        };

        const f2 = val => {
            val ++;
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(val), 100);
            })
        };

        const f3 = val => {
            assert(val === 3, 'vale should be 3');
            done();
        };

        promiseChain([f1, f2, f3], 1);
    });

    it('should pie func return 3', function () {
        // const pipe = (...functions) => input => functions.reduce((acc, func) => func(acc), input);

        const pipe = (...functions) => {
            return  input => {
                return Reduce.call(functions, (ret, func) => {
                    return func(ret);
                }, input)
            };
        };

        const func1 = val => val++;

        const func2 = val => val+=2;

        const ret = pipe(func1, func2)(1);

        assert(ret === 3, 'pipe func should be return 3');
    });

    it('should compose func return 3', function () {
        const func1 = val => {
            return `func1: ${val}`;
        };
        const func2 = val => {
            return `func2: ${val}`;
        };
        const func3 = val => {
            return `func3: ${val}`;
        };
        const func4 = val => {
            return `func4: ${val}`;
        };

        // const compose = (...args) => {
        //     const len = args.length;
        //     let cnt = len-1;
        //     let result = null;
        //     return function f1(...arg1) {
        //         result = args[cnt].apply(this, arg1);
        //         if (cnt <= 0) {
        //             cnt = len-1;
        //             return result;
        //         }
        //         cnt--;
        //         return f1.call(null, result);
        //     }
        //
        // };

        const reduceFunc = (f, g) => {
            return (...arg) => {
                return g.call(this, f.apply(this, arg));
            }
        };
        const compose = (...args) => {
            return args.reverse().reduce(reduceFunc, args.shift())
        };

        const funcs = [func1, func2, func3, func4];
        const composeFunc = compose(...funcs);
        const ret = composeFunc(1);
        assert(ret === `func1: func2: func3: func4: 1`, 'compose func should success');

        const a = m => m*m;
        const result = compose(a, a, a)(2);
        assert(result===256, 'should be 256');

    });

});
