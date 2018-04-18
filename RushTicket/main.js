const ticketService = require('./server/utils/ticketInfo')
const db = require('./db/action')
const dbName = "sunxiuguo";
const collectionName = "stations";


// async function main(){
//     let stationNameData = await ticketService.getStationName();
//     let ifColExist = await db.collectionIfExist(dbName,collectionName);
//     if(!ifColExist)
//         db.insertMany(dbName,collectionName,stationNameData)
// }


// main();





ticketService.getTicketInfo({"date":"2018-05-09","fromStation":"VNP","endStation":"AOH","purposeCodes":"ADULT"});

//db.drop(dbName,collectionName)

//db.delete(dbName,collectionName,{})

//db.update(dbName,collectionName,{$set:{"name":"哈哈哈哈哈哈哈"}},{"code":"VAP"})