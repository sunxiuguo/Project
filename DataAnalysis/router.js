const InterfaceController = require('./server/controllers/interface')
const UserController = require('./server/controllers/user')
const router = require('koa-router')();

// cors 处理跨域
// router.all('/api/*', async (ctx,next)=>{  
//   ctx.set("Access-Control-Allow-Origin", "*");  
//   await next();  
// });    


router 
// 接口地址相关api
.get('/api/url/query',InterfaceController.getInterfaceInfo)                         // 获取接口地址列表
.post('/api/url/add',InterfaceController.postInterfaceInfo)                         // 新增接口地址
.del('/api/url/remove',InterfaceController.deleteInterfaceInfo)                     //删除接口地址
//patch 修改内容
.get('/api/currentUser',UserController.getUserInfo)                             //获取用户信息
//.post('/api/article/create',ArticleController.create)                                // 发表文章


module.exports = router;
