const ticketService = require('./ticketSpider/util')
const db = require('./db/action')
const dbName = "sunxiuguo";
const collectionName = "stations";

ticketService.getStationName(function(err,data){
    db.collectionIfExist(dbName,collectionName,function(result){
        //如果不存在名为collectionName的集合，则插入全国车站数据
        if(!result)
            db.insertMany(dbName,collectionName,data);
    })
        
});
ticketService.getTicketInfo({"date":"2018-04-18","fromStation":"VNP","endStation":"SHH","purposeCodes":"ADULT"});


//db.drop(dbName,collectionName)

//db.delete(dbName,collectionName,{})

//db.update(dbName,collectionName,{$set:{"name":"哈哈哈哈哈哈哈"}},{"code":"VAP"})