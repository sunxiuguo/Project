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
    
    async getStationName(){
        superagent.get(url.GET_STATION_NAME)
        .end(function(err,res){
            console.log(JSON.stringify(res))
        })
    },

    async getCookie() {
        superagent.post(url.POST_LOGIN)
            .type('form')
            .send({
                username: user.name,//todo set the username can config
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
                cookie = res.header['set-cookie']; //从response中得到cookie
                console.log('cookie = '+cookie)
                //emitter.emit("setCookeie");
            })
    }
}

