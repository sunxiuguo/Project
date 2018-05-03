const db = require('../utils/db-util');
const dbName = "DataAnalysisBB";
const colName = "interface";


const interfaceInfo = {
    async getInterfaceInfo(params){
        let interfaceInfo = await db.select(dbName,colName,params);
        return interfaceInfo;
    },
    async postInterfaceInfo(params){
        // 插入自增唯一标识key
        let count = await db.getColContentCount(dbName,colName);
        params.key = (count + 1).toString();
        let insertResult = await db.insertOne(dbName,colName,params)
        return insertResult;
    },
    async deleteInterfaceInfo(params){
        const deleteResult = await db.delete(dbName,colName,params);
        return deleteResult;
    },
    async patchInterfaceInfo(updateData,filter){
        let formatData = {
            $set:{}
        };
        formatData["$set"] = updateData;
        const patchResult = await db.update(dbName,colName,formatData,filter);
        return patchResult;
    }
}

module.exports = interfaceInfo;