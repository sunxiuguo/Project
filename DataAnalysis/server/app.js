const Koa = require('koa')
const router = require('../router')
const bodyParser = require('koa-bodyparser')
const log4js = require('koa-log4')
const app = new Koa()
const HOST = 'http://127.0.0.1'
const PORT = process.env.PORT || 3000


require('../log')  //引入（运行）日志配置文件， 生产日志目录及相应文件
const logger = log4js.getLogger('app') //将当前文件日志命名为 app 
logger.info('--------step into koa-------------')

// 记录所有http请求 必须放在其他app.use的前面
app.use(log4js.koaLogger(log4js.getLogger('http'), { level: 'auto' }))

// 统一请求响应中间件
app.use(require('./utils/responseMiddle'))

// 解析Post body请求数据中间件
app.use(bodyParser())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT,()=>{
    logger.info(`App listening on port ${PORT}`)
})



// const path = require('path')
// const Koa = require('koa')
// const convert = require('koa-convert')
// const views = require('koa-views')
// const koaStatic = require('koa-static')
// const bodyParser = require('koa-bodyparser')
// const koaLogger = require('koa-logger')
// const session = require('koa-session-minimal')
// const MysqlStore = require('koa-mysql-session')

// const config = require('./../config')
// const routers = require('./routers/index')

// const app = new Koa()

// // session存储配置
// const sessionMysqlConfig= {
//   user: config.database.USERNAME,
//   password: config.database.PASSWORD,
//   database: config.database.DATABASE,
//   host: config.database.HOST,
// }

// // 配置session中间件
// app.use(session({
//   key: 'USER_SID',
//   store: new MysqlStore(sessionMysqlConfig)
// }))

// // 配置控制台日志中间件
// app.use(koaLogger())

// // 配置ctx.body解析中间件
// app.use(bodyParser())

// // 配置静态资源加载中间件
// app.use(koaStatic(
//   path.join(__dirname , './../static')
// ))

// // 配置服务端模板渲染引擎中间件
// app.use(views(path.join(__dirname, './views'), {
//   extension: 'ejs'
// }))

// // 初始化路由中间件
// app.use(routers.routes()).use(routers.allowedMethods())

// // 监听启动端口
// app.listen( config.port )
// console.log(`the server is start at port ${config.port}`)

