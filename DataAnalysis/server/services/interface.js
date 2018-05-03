const InterfaceModel = require('../models/interface');
const DateTime = require('../utils/datetime');
const util = require('../utils/utilMethods');

const interfaceInfo ={
    async getInterfaceInfo( params ){
        let interfaceList = await InterfaceModel.getInterfaceInfo(params);
        //组织Html数据,转换成Json格式
        for(let obj of interfaceList){
            let jsonTable = await util.mapHtmlTableToJSON(obj.html);
            obj.html = jsonTable;
        }
        return interfaceList;
    },

    async postInterfaceInfo( params ){
        let result = await InterfaceModel.postInterfaceInfo(params);
        return result;
    },

    async deleteInterfaceInfo( params ){
        let result = await InterfaceModel.deleteInterfaceInfo(params);
        return result;
    },
    async deleteManyInterfaceInfo( params ){
        //{"key":"6,7"}
        let resultAll = "success";
        let keyArr = params.key.split(',');
        for(let key of keyArr){
            let param = {key};
            let result = await InterfaceModel.deleteInterfaceInfo(param);
            if(!result){
                resultAll = "error";
                break;
            }
        }
        return resultAll;
    },
    async getDataByInterface( params ){
        // 更新 updatedAt html字段
        let dateTimeNow = DateTime.getNowDatetime();
        let updateObj = {updatedAt:dateTimeNow,html:""};
        let htmlData = await util.getDataByUrl(params.url);
        updateObj.html = htmlData;
        let result = await InterfaceModel.patchInterfaceInfo(updateObj,{key:params.key});
    },

}

module.exports = interfaceInfo;