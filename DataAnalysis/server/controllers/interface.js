/**
 * @author sunxiuguo
 * @description 接口地址管理及其相关逻辑
 */
const util = require('../utils/utilMethods')
const InterfaceService = require('../services/interface')


const InterfaceController = {
    async getInterfaceInfo(ctx,next){
        // const user = ctx.session.user;
        // if(!user)
        //     return ctx.error({msg : '用户未登陆'})
        try{
            let reponseBody = {
                status:"",
                code:"",
                msg:"",
                data:{
                    list:[],
                    pagination:{}
                }
            }
            const requestBody = ctx.request.query;
            const interfaceList = await InterfaceService.getInterfaceInfo(requestBody);
            reponseBody.status = "success";
            reponseBody.data.list = interfaceList;
            reponseBody.data.pagination.total = interfaceList.length;
            if(interfaceList){
                reponseBody.data.pagination.pageSize = 10; //每页显示的条数
                reponseBody.data.pagination.current = 1; //当前页码
            }
            ctx.body = reponseBody;
            await next();
        }catch(e){
            ctx.body = {
                status : "error",
                code : "",
                msg : "",
                data : {
                    list:[],
                    pagination:{
                        total:0
                    }
                }
            }
            
        }
        
    },
    async postInterfaceInfo(ctx,next){
        const requestBody = ctx.request.body;
        const reponseBody = await InterfaceService.postInterfaceInfo(requestBody);
        ctx.body = reponseBody;
        await next();
    },
    async deleteInterfaceInfo(ctx,next){
        //ctx.session = null;
        const requestBody = ctx.request.body;
        const reponseBody = await InterfaceService.deleteInterfaceInfo(requestBody);
        ctx.body = reponseBody;
        await next();
    },
    
}

module.exports = InterfaceController