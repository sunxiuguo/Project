const superagent = require('superagent');
const url = require('../config/urlConfig');
const user = require('../config/userConfig');

module.exports =  {
    /**
     * 获取车票信息
     * @param {object} ticketInfo 车票信息对象
     * @param {string} ticketInfo.date 车票日期 yyyy-mm-dd
     * @param {string} ticketInfo.fromStation 出发站
     * @param {string} ticketInfo.endStation 到达站
     * @param {string} ticketInfo.purposeCodes 乘车人类型 
     */
    async getTicketInfo(ticketInfo) {
        superagent.get(url.GET_TICKET_INFO)
            .query({
                "leftTicketDTO.train_date": ticketInfo.date,//车票日期
                "leftTicketDTO.from_station": ticketInfo.fromStation,//出发站
                "leftTicketDTO.to_station": ticketInfo.endStation,//到达站
                "purpose_codes":ticketInfo.purposeCodes//乘车人类型，成人票
            })
            .end(function(err, res) {
                console.log(JSON.stringify(res))
                if (err) {
                    console.log("2"+JSON.stringify(err))
                    handleErr(err.message);
                    return;
                }
            })
    },
    /**
     * 获取全国车站信息
     * @param {function} callback 回调函数
     */
    async getStationName(callback){
        superagent.get(url.GET_STATION_NAME)
        .end(function(err,res){
            try{
				let re = /\|[\u4e00-\u9fa5]+\|[A-Z]{3}\|\w+\|\w+\|\w+@\w+/g;
                let allInfoArr = [];
				let temp = JSON.stringify(res).match(re);
				[].forEach.call(temp, function(item,i) {
					let t = item.split("|");
                    allInfoArr.push({
                        name   : t[1],
						code   : t[2],
						pinyin : t[3],
						short  : t[4],
						other  : t[5]
                    })
				});
                //todo 添加回调函数
                if(callback) {
                    callback(null, allInfoArr);
				}
			}catch(err){
				console.log("In util.js getStationName error : "+err);
			}
        })
    },
    /**
     * 登录，获取COOKIE
     */
    async getCookie() {
        superagent.post(url.POST_LOGIN)
            .type('form')
            .send({
                username: user.name,
                password: user.password,
                appid: "otn",
            })
            .end(function(err, res) {
                console.log("1"+JSON.stringify(res))
                if (err) {
                    console.log("2"+JSON.stringify(err))
                    handleErr(err.message);
                    return;
                }
                let cookie = res.header['set-cookie']; //从response中得到cookie
                console.log('cookie = '+cookie)
                return cookie;
                //emitter.emit("setCookeie");
            })
    }
}

