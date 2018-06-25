const db = require('../utils/db-util');
const util = require('../utils/utilMethods');
const log4js = require('koa-log4')
const logger = log4js.getLogger('Model/interface.js')

const interfaceInfo = {
    /**
     * 获取接口列表
     * 
     * @param {any} params 
     * @returns 
     */
    async getInterfaceInfo(dbName,collectionName,params){
        logger.info(`Enter getInterfaceInfo ->${dbName} ${collectionName} ${JSON.stringify(params)}`)
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
        logger.info(`Enter postInterfaceInfo ->${dbName} ${collectionName} `)
        // 插入自增唯一标识key
        let count = await db.getColContentCount(dbName,collectionName);
        params.key = (count + 1).toString();
        logger.info(`In postInterfaceInfo ->key=${params.key}`)
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
        logger.info(`Enter postColInfo ->${dbName} ${collectionName} `)
        // 判断传入的列的key与查数据库的key是否相同
        // 如果相同,则不执行insertMany,返回select数据库的结果
        // 如果不相同,insert不同的key
        // 如果存在表，则不插入
        let colsResult = [];
        let colsInfo = await db.select(dbName,collectionName,{});
        let colsKeyInfo = util.getKeyofListobj("key",colsInfo);
        let paramsKeyInfo = util.getKeyofListobj("key",params);
        if(!util.isArrSame(colsKeyInfo,paramsKeyInfo)){ //todo !
            logger.info(`In postColInfo -> exec insertMany`)
            // util.writeFile('params',params)
            await db.insertMany(dbName,collectionName,params);
            colsResult = await db.select(dbName,collectionName,{});
        }else{
            logger.info(`In postColInfo -> no insertMany`)
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
        logger.info(`Enter deleteInterfaceInfo ->${dbName} ${collectionName} ${JSON.stringify(params)}`)
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
        logger.info(`Enter patchInterfaceInfo ->${dbName} ${collectionName} `)
        let formatData = {
            $set:{}
        };
        formatData["$set"] = updateData;
        const patchResult = await db.update(dbName,collectionName,formatData,filter);
        return patchResult;
    }
}

module.exports = interfaceInfo;