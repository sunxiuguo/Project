/**
 * @author sunxiuguo
 * @description 接口地址管理及其相关逻辑
 */
const util = require('../utils/utilMethods')
const InterfaceService = require('../services/interface')


const InterfaceController = {
    async getInterfaceInfo(ctx,next){
        const requestBody = ctx.request.query;
        const data = await InterfaceService.getInterfaceInfo(requestBody);
        return ctx.success({data});       
    },
    async postInterfaceInfo(ctx,next){
        const requestBody = ctx.request.body;
        const result = await InterfaceService.postInterfaceInfo(requestBody);
        const data = await InterfaceService.getInterfaceInfo({});
        if(!result)
            return ctx.error({data});
        return ctx.success({data});
    },
    async deleteInterfaceInfo(ctx,next){
        const requestBody = ctx.request.body;
        const result = await InterfaceService.deleteInterfaceInfo(requestBody);
        const data = await InterfaceService.getInterfaceInfo({});
        if(!result)
            return ctx.error({data});
        return ctx.success({data});
    },
    async getDataByInterface(ctx,next){
        const requestBody = ctx.request.body;
        const result = await InterfaceService.getDataByInterface(requestBody);
        const data = await InterfaceService.getInterfaceInfo({});
        if(!result)
            return ctx.error({data});
        return ctx.success({data});
    }
    
}

module.exports = InterfaceController