const ticketService = require('./ticketSpider/util')
const db = require('./db/action')
const dbName = "sunxiuguo";
const collectionName = "stations";

// ticketService.getStationName(function(err,data){
//     db.insertMany(dbName,collectionName,data);
// });

//db.select(dbName,collectionName,{})

//db.drop(dbName,collectionName)

//db.delete(dbName,collectionName,{"name":"1"})

db.update(dbName,collectionName,{$set:{"name":"哈哈哈哈哈哈哈"}},{"code":"VAP"})