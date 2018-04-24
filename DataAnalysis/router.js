const InterfaceController = require('./server/controllers/interface')
const router = require('koa-router')();

// cors 处理跨域
// router.all('/api/*', async (ctx,next)=>{  
//   ctx.set("Access-Control-Allow-Origin", "*");  
//   await next();  
// });    


router 
// 接口地址相关api
.get('/api/url',InterfaceController.queryInterfaceConfig)                         // 获取接口地址列表
.post('/api/url',InterfaceController.postInterfaceConfig)                         // 获取接口地址列表

//.post('/api/article/create',ArticleController.create)                                // 发表文章


module.exports = router;