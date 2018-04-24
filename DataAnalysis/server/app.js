const Koa = require('koa')
const Router = require('koa-router')
const routerFe = require('../router')
const app = new Koa()
const HOST = '127.0.0.1'
const PORT = process.env.PORT || 3000

app.use(require('./utils/responseMiddle'))
app.use(routerFe.routes()).use(routerFe.allowedMethods())

app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`)
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

