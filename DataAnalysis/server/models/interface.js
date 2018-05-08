const db = require('../utils/db-util');
const util = require('../utils/utilMethods');

const interfaceInfo = {
    /**
     * 获取接口列表
     * 
     * @param {any} params 
     * @returns 
     */
    async getInterfaceInfo(dbName,collectionName,params){
        let interfaceInfo = await db.select(dbName,collectionName,params);
        return interfaceInfo;
    },
    /**
     * 插入接口
     * 插入唯一标识自增key
     * @param {any} params 
     * @returns 
     */
    async postInterfaceInfo(dbName,collectionName,params){
        // 插入自增唯一标识key
        let count = await db.getColContentCount(dbName,collectionName);
        params.key = (count + 1).toString();
        let insertResult = await db.insertOne(dbName,collectionName,params)
        return insertResult;
    },
    /**
     * 插入列信息
     * 
     * @param {any} params 
     * @returns 
     */
    async postColInfo( dbName,collectionName,params ){
        // 判断传入的列的key与查数据库的key是否相同
        // 如果相同,则不执行insertMany,返回select数据库的结果
        // 如果不相同,insert不同的key
        // 如果存在表，则不插入
        let colsResult = [];
        let colsInfo = await db.select(dbName,collectionName,{});
        let colsKeyInfo = util.getKeyofListobj("key",colsInfo);
        let paramsKeyInfo = util.getKeyofListobj("key",params);
        if(!util.isArrSame(colsKeyInfo,paramsKeyInfo)){
            await db.insertMany(dbName,collectionName,params);
            colsResult = await db.select(dbName,collectionName,{});
        }else{
            colsResult = colsInfo;
        }
        return colsResult;
    },
    /**
     * 删除一条接口记录
     * 
     * @param {any} params 
     * @returns 
     */
    async deleteInterfaceInfo(dbName,collectionName,params){
        const deleteResult = await db.delete(dbName,collectionName,params);
        return deleteResult;
    },
    /**
     * 更新接口表
     * 
     * @param {any} updateData 
     * @param {any} filter 
     * @returns 
     */
    async patchInterfaceInfo(dbName,collectionName,updateData,filter){
        let formatData = {
            $set:{}
        };
        formatData["$set"] = updateData;
        const patchResult = await db.update(dbName,collectionName,formatData,filter);
        return patchResult;
    }
}

module.exports = interfaceInfo;