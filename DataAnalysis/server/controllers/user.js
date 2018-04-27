/**
 * @author sunxiuguo
 * @description 用户管理及其相关逻辑
 */
const util = require('../utils/utilMethods')
const UserService = require('../services/user')


const user = {
    async getUserInfo( ctx,next ){
        let responseData = {
            "name":"祝佳",
            "avatar":"https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
            "userid":"00000001",
            "notifyCount":0
        }
        ctx.body = responseData;
        await next()
    },

}

module.exports = user;