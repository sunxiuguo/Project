const InterfaceModel = require('../models/interface');
const DateTime = require('../utils/datetime');

const interfaceInfo ={
    async getInterfaceInfo( params ){
        let interfaceList = await InterfaceModel.getInterfaceInfo(params);
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

    async getDataByInterface( params ){
        // 更新 updatedAt 字段
        let dateTimeNow = DateTime.getNowDatetime();
        let updateObj = {updatedAt:dateTimeNow};
        let result = await InterfaceModel.patchInterfaceInfo(updateObj,params);
    },

}

module.exports = interfaceInfo;