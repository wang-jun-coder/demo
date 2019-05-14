const assert = require('assert');
const WJPromise = require('../lib/WJPromise');


describe('#WJPromise', function () {

    it('should success and return 1', function (done) {
        new WJPromise((resolve, reject) => {
            resolve(1);
        }).then(value => {
            assert(value===1, 'should be return 1');
            done();
        }).catch(reason => {
            done(reason);
        })
    });

    it('should fail and return fail', function () {
        new WJPromise((resolve, reject) => {
            reject('fail')
        }).then(value => {
            done(value);
        }).catch(reason => {
            assert(reason === 'fail', 'should be return fail');
            done();
        })
    });

    it('should success and async return 1', function () {
        new WJPromise((resolve, reject) => {
            setTimeout(() => resolve(1), 1000);
        }).then(value => {
            assert(value===1, 'should be return 1');
            done();
        }).catch(reason => {
            done(reason);
        })
    });

    it('should fail and async return fail', function () {
        new WJPromise((resolve, reject) => {
            setTimeout(() => reject('fail'), 1000);
        }).then(value => {
            done(value);
        }).catch(reason => {
            assert(reason === 'fail', 'should be return fail');
            done();
        })
    });

    it('should success and async return [1, 2, 3, 4, 5]', function (done) {

        const result = [];
        const tryEnd = () => {

            if (result.length !== 5) return;

            assert(result[0]===1, 'result[0] should be 1');
            assert(result[1]===2, 'result[1] should be 2');
            assert(result[2]===3, 'result[2] should be 3');
            assert(result[3]===4, 'result[3] should be 4');
            assert(result[4]===5, 'result[4] should be 5');
            done();
        };
        setTimeout(() =>{
            result.push(5);
            tryEnd();
        });

        result.push(1);
        new WJPromise((resolve, reject) => {
            result.push(2);
            resolve(1)
        }).then(value => {
            result.push(4);
            tryEnd()
        }).catch(reason => {
            done(reason);
        });
        result.push(3);
    });

    it('should all complete', function (done) {
        this.timeout(5*1000);

        const p1 = new WJPromise((resolve, reject) => {
            setTimeout(()=>resolve('p1'), 1000);
        });
        const p2 = new WJPromise((resolve, reject) => {
            setTimeout(()=>resolve('p2'), 500);
        });
        const p3 = new WJPromise((resolve, reject) => {
            setTimeout(()=>resolve('p3'), 1000);
        });
        const p4 = new WJPromise((resolve, reject) => {
            setTimeout(()=>resolve('p4'), 3000);
        });
        WJPromise.all([p1, p2, p3, p4])
            .then(value => {
                assert(value.length === 4, 'value should be array and length is 4');
                assert(value[0] === 'p1', 'value[0] should be p1');
                assert(value[1] === 'p2', 'value[1] should be p2');
                assert(value[2] === 'p3', 'value[2] should be p3');
                assert(value[3] === 'p4', 'value[3] should be p4');
                done();
            })
            .catch(e => done(e));
    });

    it('should all fail', function (done) {
        this.timeout(5*1000);

        const p1 = new WJPromise((resolve, reject) => {
            setTimeout(()=>resolve('p1'), 1000);
        });
        const p2 = new WJPromise((resolve, reject) => {
            setTimeout(()=>resolve('p2'), 500);
        });
        const p3 = new WJPromise((resolve, reject) => {
            setTimeout(()=>reject('p3'), 1000);
        });
        const p4 = new WJPromise((resolve, reject) => {
            setTimeout(()=>resolve('p4'), 3000);
        });
        WJPromise.all([p1, p2, p3, p4])
            .then(value => {
                done('should not done');
            })
            .catch(e => {
                assert(e === 'p3', 'e should be p3');
                done();
            });
    });


    it('should race success', function (done) {
        this.timeout(5*1000);

        const p1 = new WJPromise((resolve, reject) => {
            setTimeout(()=>resolve('p1'), 1000);
        });
        const p2 = new WJPromise((resolve, reject) => {
            setTimeout(()=>resolve('p2'), 500);
        });
        const p3 = new WJPromise((resolve, reject) => {
            setTimeout(()=>resolve('p3'), 1000);
        });
        const p4 = new WJPromise((resolve, reject) => {
            setTimeout(()=>resolve('p4'), 3000);
        });
        WJPromise.race([p1, p2, p3, p4])
            .then(value => {
                assert(value==='p2', 'value should be p2');
                done();
            })
            .catch(e => done(e));
    });

    it('should race fail', function (done) {
        this.timeout(5*1000);

        const p1 = new WJPromise((resolve, reject) => {
            setTimeout(()=>resolve('p1'), 1000);
        });
        const p2 = new WJPromise((resolve, reject) => {
            setTimeout(()=>reject('p2'), 500);
        });
        const p3 = new WJPromise((resolve, reject) => {
            setTimeout(()=>resolve('p3'), 1000);
        });
        const p4 = new WJPromise((resolve, reject) => {
            setTimeout(()=>reject('p4'), 3000);
        });
        WJPromise.race([p1, p2, p3, p4])
            .then(value => {
                done('should not success');
            })
            .catch(e => {
                assert(e === 'p2', 'e should be p2');
                done();
            });
    });


    it('should resolve', function (done) {
        WJPromise.resolve(1)
            .then(value => {
                assert(value===1, 'value should be 1');
                done();
            })
            .catch(e => done(e));
    });

    it('should reject', function (done) {
        WJPromise.reject(1)
            .then(value => {
                done('should not success');
            })
            .catch(e => {
                assert(e===1, 'e should be 1');
                done();
            })
    });

    it('should return Promise success', function (done) {
        WJPromise.resolve(1)
            .then(value => {
                return new WJPromise((resolve, reject) => {
                    setTimeout(()=> resolve(value+1));
                })
            })
            .then(value => {
                assert(value===2, 'value should be 2');
                done()
            })
            .catch(e => done(e));
    });
    it('should return Promise fail', function (done) {
        WJPromise.resolve(1)
            .then(value => {
                return new WJPromise((resolve, reject) => {
                    setTimeout(()=> reject(value+1));
                })
            })
            .then(value => {
                done('should not success')
            })
            .catch(e =>{
                assert(e===2, 'e should be 2');
                done();
            });
    });

    it('should return fulfilled promise success', function (done) {
        const p = WJPromise.resolve(2);
        WJPromise.resolve(1)
            .then(value => {
                return p;
            })
            .then(value => {
                assert(value===2, 'value should be 2');
                done();
            })
            .catch(e => done(e))
    });

    it('should return reject promise fail', function (done) {
        const p = WJPromise.reject(2);
        WJPromise.resolve(1)
            .then(value => {
                return p;
            })
            .then(value => {
                done('should be not success');
            })
            .catch(e => {
                assert(e === 2, 'e should be 2');
                done();
            })
    });

    it('should return promise like object success', function (done) {
        WJPromise.resolve(1)
            .then(value => {
                return {then: 'it is not a promise'}
            })
            .then(value => {
                assert(value.then === 'it is not a promise', 'value.then should be "it is not a promise"');
                done()
            })
            .catch(e => done(e));
    });

    it('should return promise like success', function (done) {
        WJPromise.resolve(1)
            .then(value => {
                return {
                    then: (onFulfilled, onRejected) => {
                        setTimeout(()=>{
                            onFulfilled(1);
                        })
                    }
                }
            })
            .then(value => {
                assert(value === 1, 'value should be 1');
                done()
            })
            .catch(e => done(e));
    });

    it('should return promise like fail', function (done) {
        WJPromise.resolve(1)
            .then(value => {
                return {
                    then: (onFulfilled, onRejected) => {
                        setTimeout(()=>{
                            onRejected(1);
                        })
                    }
                }
            })
            .then(value => {
                done('should not success');
            })
            .catch(e => {
                assert(e === 1, 'e should be 1');
                done();
            });
    });

});


