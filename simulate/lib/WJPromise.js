const STATUS = {
    PENDING : 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECT: 'REJECT'
};

class WJPromise {

    constructor(exector) {
        this.state = STATUS.PENDING;

        this.value = null;
        this.reason = null;

        this.onFulfilledCallbacks = [];
        this.onRejectCallbacks = [];

        const resolve = value => {
            // 微任务, 前端使用 setTimeout 宏任务模拟
            process.nextTick(() => {
                if (this.state === STATUS.PENDING) {
                    this.state = STATUS.FULFILLED;
                    this.value = value;
                    this.onFulfilledCallbacks.forEach(fn => fn(this.value));
                }
            })
        };

        const reject = reason => {
            process.nextTick(() => {
                if (this.state === STATUS.PENDING) {
                    this.state = STATUS.REJECT;
                    this.reason = reason;
                    this.onRejectCallbacks.forEach(fn => fn(this.reason));
                }
            })
        };

        try {
            exector(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    then(onFulfilled, onReject) {

        // 统一处理当前 promise 回调的返回值
        const resolvePromise = (promise, ret, resolve, reject) => {
            if (promise === ret) {
                // 如果将 promise 的返回值当做输入值, 会导无限致循环下去
                return reject(new TypeError('retain circular'));
            }

            // 如果是 promise 类型
            if (ret instanceof WJPromise) {
                ret.then(value => {
                    resolvePromise(promise, value, resolve, reject);

                }, reason => {
                    reject(reason);
                });
                return;
            }

            // 如果返回值类似 promise,
            if (ret && (ret instanceof Function || ret instanceof Object)) {
                let then = ret.then;
                let called = false;
                // then 不是函数类型, 非 promise 对象,直接返回
                if (!(then instanceof Function)) {
                    if (called)return;
                    called = true;
                    resolve(ret);
                }

                // 将返回值当做 promise 进行调用
                try {
                    then.call(ret, value => {
                        if (called) return;
                        called = true;
                        resolvePromise(promise, value, resolve, reject);
                    }, reason => {
                        if (called) return;
                        called = true;
                        reject(reason);
                    })


                } catch (e) {
                    if (called)return ;
                    called = true;
                    reject(e);
                }
                return;
            }

            resolve(ret);

        };

        let newPromise = null;
        let self = this;
        onFulfilled = onFulfilled instanceof Function ? onFulfilled : value => value;
        onReject = onReject instanceof Function ? onReject : reason => {throw reason};

        // 返回 Promise 供链式调用
        return (newPromise = new WJPromise((resolve, reject) => {

            // 已有结果, 直接处理
            if (self.state === STATUS.FULFILLED) {
                let ret = onFulfilled(self.value);
                resolvePromise(newPromise, ret, resolve, reject);
                return;
            }
            if (self.state === STATUS.REJECT) {
                let ret = onReject(self.reason);
                resolvePromise(newPromise, ret, resolve, reject);
                return;
            }

            // 还未有结果, 记录回调, 等待执行完成统一回复
            self.onFulfilledCallbacks.push(value => {
                try {
                    let ret = onFulfilled(value);
                    resolvePromise(newPromise, ret, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
            self.onRejectCallbacks.push(reason => {
                try {
                    let ret = onReject(reason);
                    resolvePromise(newPromise, ret, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        }))
    }

    catch(onReject) {
        return this.then(null, onReject);
    }

    static resolve(value) {
        return new WJPromise((resolve, reject) => {
            resolve(value);
        });
    }
    static reject(reason) {
        return new WJPromise((resolve, reject) => {
            reject(reason);
        });
    }

    static all(promises) {
        return new WJPromise((resolve, reject) => {
            let result = [];
            let resolveCnt = 0;
            promises.forEach((p, i) => {
                try {
                    p.then(value => {
                        result[i] = value;
                        resolveCnt ++;
                        if (resolveCnt === promises.length) {
                            return resolve(result);
                        }
                    }, reason => {
                        reject(reason);
                    })
                } catch (e) {
                    reject(e);
                }
            })
        });
    }

    static race(promises) {
        return new WJPromise((resolve, reject) => {
            promises.forEach(p => {
                p.then(resolve, reject);
            })
        })
    }

}
module.exports = WJPromise;
