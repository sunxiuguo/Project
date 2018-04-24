/**
 * @author sunxiuguo
 * @description 车票及其相关接口逻辑
 */
const util = require('../utils/utilMethods')


const InterfaceController = {
    async queryInterfaceConfig(ctx){
        // const user = ctx.session.user;
        // if(!user)
        //     return ctx.error({msg : '用户未登陆'})
        
        const requestBody = ctx.request.query;
        console.log("GET "+JSON.stringify(requestBody))
        const responseData = await Ticket.getTicketInfo(requestBody)
        if(responseData.msg === 'error')
            return ctx.error({msg : responseData.des})
        return ctx.success({
            msg : 'success',
            data : responseData
        })
    },
    async postInterfaceConfig(ctx){
        console.log("POST "+ctx.request.body)
    }
}

module.exports = InterfaceController