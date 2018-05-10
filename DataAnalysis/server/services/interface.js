const InterfaceModel = require('../models/interface');
const DateTime = require('../utils/datetime');
const util = require('../utils/utilMethods');
const db = require('../utils/db-util');
const options = require('../../config');
const { database:{ MONGODB_DATABASE_NAME, COLLECTION_INTERFACE_NAME, COLLECTION_COLUMNS_NAME } } = options;

const interfaceInfo ={
    /**
     * 获取接口配置列表
     * @param {*} params 
     */
    async getInterfaceInfo( params ){
        let interfaceList = await InterfaceModel.getInterfaceInfo(MONGODB_DATABASE_NAME, COLLECTION_INTERFACE_NAME,params);
        //组织Html数据,转换成Json格式
        for(let obj of interfaceList){
            let jsonTable = await util.mapHtmlTableToJSON(obj.html);
            obj.html = jsonTable;
        }
        return interfaceList;
    },
    /**
     * 获取接口配置树
     * @param {*} params 
     */
    async getInterfaceTreeInfo( params ){
        let interfaceList = await this.getInterfaceInfo(MONGODB_DATABASE_NAME, COLLECTION_INTERFACE_NAME,params);
        // 获取树数据以及列名信息
        let interfaceTreeDataAndCol = await util.renderColumns(interfaceList);
        const { data,colsInfo } = interfaceTreeDataAndCol;
        // 保存列信息
        let cols = await InterfaceModel.postColInfo(MONGODB_DATABASE_NAME, COLLECTION_COLUMNS_NAME,colsInfo);
        return {data,cols};
    },
    /**
     * 新增接口
     * @param {any} params 
     * @returns 
     */
    async postInterfaceInfo( params ){
        let result = await InterfaceModel.postInterfaceInfo(MONGODB_DATABASE_NAME, COLLECTION_INTERFACE_NAME,params);
        return result;
    },
    /**
     * 删除一条接口记录
     * @param {any} params 
     * @returns 
     */
    async deleteInterfaceInfo( params ){
        let result = await InterfaceModel.deleteInterfaceInfo(MONGODB_DATABASE_NAME, COLLECTION_INTERFACE_NAME,params);
        return result;
    },
    /**
     * 删除多条接口记录
     * @param {any} params 
     * @returns 
     */
    async deleteManyInterfaceInfo( params ){
        //{"key":"6,7"}
        let resultAll = "success";
        let keyArr = params.key.split(',');
        for(let key of keyArr){
            let param = {key};
            let result = await InterfaceModel.deleteInterfaceInfo(MONGODB_DATABASE_NAME, COLLECTION_INTERFACE_NAME,param);
            if(!result){
                resultAll = "error";
                break;
            }
        }
        return resultAll;
    },
    /**
     * 爬取对应url的数据,并更新interface表的html、updatedAt字段
     * @param {any} params 
     */
    async getDataByInterface( params ){
        // 更新 updatedAt html字段
        let dateTimeNow = DateTime.getNowDatetime();
        let updateObj = {updatedAt:dateTimeNow,html:""};
        let htmlData = await util.getDataByUrl(params.url,params.date);
        updateObj.html = htmlData;
        let result = await InterfaceModel.patchInterfaceInfo(MONGODB_DATABASE_NAME, COLLECTION_INTERFACE_NAME,updateObj,{key:params.key});
        return result;
    },
    async patchColsInfo( params ){
        let resultAll = "success";
        const { key, ...updateData } = params;
        let keys = [];
        if(typeof key === "string")
            keys = [key];
        else
            keys = key;
        // 更新checked字段,需要批量更新为true,并且把不符合条件的checked置为false
        if(updateData.hasOwnProperty('checked'))
            await InterfaceModel.patchInterfaceInfo(MONGODB_DATABASE_NAME,COLLECTION_COLUMNS_NAME,{checked:false},{checked:true});
        for(let keyNode of keys){
            const [ head, first, second ] = keyNode.split('-');
            const filter = second ? {head,first,second} : {head,first};
            let result = await InterfaceModel.patchInterfaceInfo(MONGODB_DATABASE_NAME,COLLECTION_COLUMNS_NAME,updateData,filter);
            if(!result){
                resultAll = "error";
                break;
            }
        }
        return resultAll;
    },
    async getColsInfo( params ){
        let result = await InterfaceModel.getInterfaceInfo(MONGODB_DATABASE_NAME,COLLECTION_COLUMNS_NAME,params);
        return result;
    },

}

module.exports = interfaceInfo;