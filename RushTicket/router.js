const TicketController = require('./server/controllers/ticketController')
const router = require('koa-router')();

// cors 处理跨域
// router.all('/api/*', async (ctx,next)=>{  
//   ctx.set("Access-Control-Allow-Origin", "*");  
//   await next();  
// });    


router 
// 车票相关api
.get('/api/ticket/getStationList',TicketController.getStationNames)                         // 获取文章详情
//.post('/api/article/create',ArticleController.create)                                // 发表文章


module.exports = router;