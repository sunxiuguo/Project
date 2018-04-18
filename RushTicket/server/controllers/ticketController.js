/**
 * @author sunxiuguo
 * @description 车票及其相关接口逻辑
 */
const Ticket = require('../utils/ticketInfo')
const util = require('../utils/utilMethods')

const TicketController = {
    async getStationNames(ctx){
        // const user = ctx.session.user;
        // if(!user)
        //     return ctx.error({msg : '用户未登陆'})
        const requestBody = ctx.request.query;
        //todo 需要编写一个统一的code message映射文件
        if(!util.hasAllKey(requestBody,'date','fromStation','endStation','purposeCodes'))
            return ctx.error({msg : '缺少必要参数'})
        const responseData = await Ticket.getTicketInfo(requestBody)
        if(responseData.msg === 'error')
            return ctx.error({msg : responseData.des})
        return ctx.success({
            msg : 'success',
            data : responseData
        })
    }
}

module.exports = TicketController