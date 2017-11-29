function Promise(fn) {
    this.state = 'pending';
    this._callbackList = [];
    fn(this.resolve.bind(this), this.reject.bind(this));
}

Promise.prototype = {
    then: function (done, fail) {
        switch (this.state) {
            case 'pending':
                this._callbackList.push({
                    'done': done,
                    'fail': fail || null
                });
                return this;
                break;
            case 'fulfilled':
                done();
                break
            case 'rejected':
                fail();
                break
        }
        return this;

    },
    resolve: function (val) {
        this.state = 'fulfilled';
        setTimeout(() => {
            var tempRes = val;
            for (var i = 0; i < this._callbackList.length; i++) {
                tempRes = this._callbackList[i]['done'](tempRes);
            }
        }, 0)
    },
    reject: function (val) {
        this.state = 'fulfilled';
        setTimeout(() => {
            var tempRes = this._callbackList[0]['fail'](val);
            this._callbackList.shift();
            this.resolve(tempRes);
        }, 0)
    }
}

new Promise(function (resolve, reject) {
    setTimeout(function () {
        reject();
    }, 100)
}).then(function () {
    console.log(1)
}, function () {
    console.log('fail1')
}).then(function () {
    console.log(2);
})