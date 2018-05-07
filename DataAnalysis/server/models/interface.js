const db = require('../utils/db-util');
const options = require('../../config');
const { database:{ MONGODB_DATABASE_NAME, COLLECTION_INTERFACE_NAME, COLLECTION_COLUMNS_NAME } } = options;


const interfaceInfo = {
    /**
     * 获取接口列表
     * 
     * @param {any} params 
     * @returns 
     */
    async getInterfaceInfo(params){
        let interfaceInfo = await db.select(MONGODB_DATABASE_NAME,COLLECTION_INTERFACE_NAME,params);
        return interfaceInfo;
    },
    /**
     * 插入接口
     * 插入唯一标识自增key
     * @param {any} params 
     * @returns 
     */
    async postInterfaceInfo(params){
        // 插入自增唯一标识key
        let count = await db.getColContentCount(MONGODB_DATABASE_NAME,COLLECTION_INTERFACE_NAME);
        params.key = (count + 1).toString();
        let insertResult = await db.insertOne(MONGODB_DATABASE_NAME,COLLECTION_INTERFACE_NAME,params)
        return insertResult;
    },
    /**
     * 插入列信息
     * 
     * @param {any} params 
     * @returns 
     */
    async postColInfo( params ){
        // 如果存在表，则不插入
        if(await db.collectionIfExist(MONGODB_DATABASE_NAME,COLLECTION_COLUMNS_NAME))
            return;
        let insertResult = await db.insertMany(MONGODB_DATABASE_NAME,COLLECTION_COLUMNS_NAME,params);
        return insertResult;
    },
    /**
     * 删除一条接口记录
     * 
     * @param {any} params 
     * @returns 
     */
    async deleteInterfaceInfo(params){
        const deleteResult = await db.delete(MONGODB_DATABASE_NAME,COLLECTION_INTERFACE_NAME,params);
        return deleteResult;
    },
    /**
     * 更新接口表
     * 
     * @param {any} updateData 
     * @param {any} filter 
     * @returns 
     */
    async patchInterfaceInfo(updateData,filter){
        let formatData = {
            $set:{}
        };
        formatData["$set"] = updateData;
        const patchResult = await db.update(MONGODB_DATABASE_NAME,COLLECTION_INTERFACE_NAME,formatData,filter);
        return patchResult;
    }
}

module.exports = interfaceInfo;