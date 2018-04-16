var superagent = require('superagent');
function getCookie() {
    superagent.post('https://kyfw.12306.cn/passport/web/login')
        .type('form')
        .send({
            username: "SSSsunxiuguo",//todo set the username can config
            password: "Q4Oq1T29Xx",
            appid: "otn",
        })
        .end(function(err, res) {
            console.log("1"+JSON.stringify(res))
            if (err) {
                console.log("2"+JSON.stringify(err))
                handleErr(err.message);
                return;
            }
            cookie = res.header['set-cookie']; //从response中得到cookie
            console.log('cookie = '+cookie)
            //emitter.emit("setCookeie");
        })
}

getCookie();