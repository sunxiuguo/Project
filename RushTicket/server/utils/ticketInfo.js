/**
 * 此文件内容或许应该放到ticketController.js中
 */
const superagent = require('superagent');
const url = require('../../config/urlConfig');
const user = require('../../config/userConfig');
const util = require('./utilMethods')
const fs = require('fs')


const ticketService =  {
    /**
     * 获取车票信息
     * @param {object} ticketInfo 车票信息对象
     * @param {string} ticketInfo.date 车票日期 yyyy-mm-dd
     * @param {string} ticketInfo.fromStation 出发站代码
     * @param {string} ticketInfo.endStation 到达站代码
     * @param {string} ticketInfo.purposeCodes 乘车人类型 
     */
    getTicketInfo(ticketInfo) {
        return new Promise((resolve , reject ) =>{
            superagent.get(url.GET_TICKET_INFO)
            .query({
                "leftTicketDTO.train_date": ticketInfo.date,//车票日期
                "leftTicketDTO.from_station": ticketInfo.fromStation,//出发站代码
                "leftTicketDTO.to_station": ticketInfo.endStation,//到达站代码
                "purpose_codes":ticketInfo.purposeCodes//乘车人类型，成人票
            })
            .end(function(err, res) {
                try{
                    let resData = JSON.parse(res.text);
                    let Tickects = [];
                    let data = resData.data
                    if(!data)
                        resolve({
                            msg : 'error',
                            des : resData.messages
                        })
                    let result = data.result
                    let flag = data.flag
                    let map = data.map
                    let trainnum = result.length;

                    for(let i=0; i<trainnum; i++) 
                    {
                        let tickect = {};
                        let temp = result[i].split("|");

                        tickect.status = temp[1];	// 状态（预订 / 列车运行图调整,暂停发售 / ...）
                        tickect.train_no = temp[2];	// 火车编号
                        tickect.tId = temp[3];	    // Train ID

                        tickect.fSation = ticketService.mapStationsCodeName(temp[6], map);	// From Station Name
                        tickect.tSation = ticketService.mapStationsCodeName(temp[7], map);	// To Station Name

                        tickect.sTime = temp[8];	// Start Time
                        tickect.eTime = temp[9];	// End Time
                        tickect.tTime = temp[10];	// Total Time
                        tickect.date = temp[13];

                        tickect.from_station_no = temp[16];	// 出发地车序
                        tickect.to_station_no = temp[17];	// 目的地车序

                        tickect.ruanwo = temp[23];	// 软卧
                        tickect.ruanzuo = temp[24]; // 软座
                        tickect.wuzuo = temp[26];	// 无座
                        tickect.yingwo = temp[28];  // 硬卧
                        tickect.yingzuo = temp[29]; // 硬座

                        tickect.scSeat = temp[30];	// 二等座
                        tickect.fcSeat = temp[31];	// 一等座
                        tickect.bcSeat = temp[32];	// 商务座 / 特等座

                        tickect.dongwo = temp[33];	// 动卧

                        tickect.seat_types = temp[35];
                        
                        Tickects.push(tickect)
                    }
                    resolve(Tickects)
                    //ticketService.PrintTickects(ticketInfo, Tickects) //打印车票信息
                }catch(err){
                    reject(err)
                }
            })
        })
    },
    /**
     * 获取全国车站信息
     */
    getStationName(){
        return new Promise(( resolve ,reject ) =>{
            superagent.get(url.GET_STATION_NAME)
            .end(async function(err,res){
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
                    //数据的写入需要异步处理
                    await util.writeFile('./data/stations.json',JSON.stringify(allInfoArr));
                    resolve(allInfoArr)
                }catch(err){
                    reject(err)
                }
            })
        })
    },
    

    /**
     * 打印车票信息
     * @param {object} config 车次信息配置
     * @param {object} tickects 车次信息
     */
    PrintTickects(config, tickects) {
        if(!tickects) {
            return;
        }
        if(tickects.length <= 0) {
            return;
        }
        var stations = tickects[0].fSation+"-"+tickects[0].tSation+" ";
        while(stations.length < 10) {
            stations = "  "+stations
        }
        console.log("|------------------------------------------------------------------------------------|")
        console.log("| ["+config.date+"] "+stations+" 车票情况                                             |")
        console.log("|------------------------------------------------------------------------------------|")
        console.log("| 车次 |      起止站    |  发车 |  到达 |商务|一等|二等|动卧|软卧|硬卧|软座|硬座|无座|")
        console.log("|------------------------------------------------------------------------------------|")
        for(var i=0; i<tickects.length; i++) {
            //console.log(tickects[0])
            var tId = tickects[i].tId+" ";
            while(tId.length < 6) {
                tId = " "+tId
            }
    
            var stations = tickects[i].fSation+"-"+tickects[i].tSation+" ";
            while(stations.length < 10) {
                stations = "  "+stations
            }
    
            var sTime = " "+tickects[i].sTime+" ";
            var eTime = " "+tickects[i].eTime+" ";
    
            var info = "|"+tId
                      +"|"+stations
                      +"|"+sTime
                      +"|"+eTime
                      +"|"+ticketService._padding_str(tickects[i].bcSeat, 4)
                      +"|"+ticketService._padding_str(tickects[i].fcSeat, 4)
                      +"|"+ticketService._padding_str(tickects[i].scSeat, 4)
                      +"|"+ticketService._padding_str(tickects[i].dongwo, 4)
                      +"|"+ticketService._padding_str(tickects[i].ruanwo, 4)
                      +"|"+ticketService._padding_str(tickects[i].yingwo, 4)
                      +"|"+ticketService._padding_str(tickects[i].ruanzuo, 4)
                      +"|"+ticketService._padding_str(tickects[i].yingzuo, 4)
                      +"|"+ticketService._padding_str(tickects[i].wuzuo, 4)
                      +"|"
    
            console.log(info)
        }
        console.log("|------------------------------------------------------------------------------------|")
    },
    
    _padding_str(str,len){
        if("有"==str || "无"==str) {
            len = len - 1;
        }
        if(!str) {
            str = "- "
        }
        else {
            str = str+" "
        }
        while(str.length < len) {
            str = " "+str
        }
        return str;
    },

    /**
     * 车站编号和名称映射
     * @param {string} code 
     * @param {map} map 
     */
    mapStationsCodeName(code,map){
        if(map){
            let name = map[code];
            if(name)
                return name;
        }
        return code;
    },

   
    
    
}

module.exports = ticketService;