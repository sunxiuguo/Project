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
    async getInterfaceTreeInfo(ctx,next){
        const requestBody = ctx.request.query;
        const dataAll = await InterfaceService.getInterfaceTreeInfo(requestBody);
        return ctx.success(dataAll);       
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
        const result = await InterfaceService.deleteManyInterfaceInfo(requestBody);
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
    },
    async patchColsInfo(ctx,next){
        const requestBody = ctx.request.body;
        const result = await InterfaceService.patchColsInfo(requestBody);
        const cols = await InterfaceService.getColsInfo({});
        if(!result)
            return ctx.error({cols});
        return ctx.success({cols});
    },
    async patchColsOrder(ctx,next){
        const requestBody = ctx.request.body;
        const result = await InterfaceService.patchColsOrder(requestBody);
        const colsOrder = await InterfaceService.getColsOrder({});
        if(!result)
            return ctx.error({colsOrder});
        return ctx.success({colsOrder});
    }
    
    
}

module.exports = InterfaceController