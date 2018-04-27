const InterfaceModel = require('../models/interface')

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
    }

}

module.exports = interfaceInfo;