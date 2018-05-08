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
        let htmlData = await util.getDataByUrl(params.url);
        updateObj.html = htmlData;
        let result = await InterfaceModel.patchInterfaceInfo(MONGODB_DATABASE_NAME, COLLECTION_INTERFACE_NAME,updateObj,{key:params.key});
        return result;
    },
    async patchColsInfo( params ){
        const { key, ...updateData } = params;
        const [ head, first, second ] = key.split('-');
        console.log(`In patchColsInfo 
                     key=${key}
                     updateData=${JSON.stringify(updateData)}
        `)
        const filter = second ? {head,first,second} : {head,first};
        let result = await InterfaceModel.patchInterfaceInfo(MONGODB_DATABASE_NAME,COLLECTION_COLUMNS_NAME,updateData,filter);
        return result;
    },
    async getColsInfo( params ){
        let result = await InterfaceModel.getInterfaceInfo(MONGODB_DATABASE_NAME,COLLECTION_COLUMNS_NAME,params);
        return result;
    },

}

module.exports = interfaceInfo;