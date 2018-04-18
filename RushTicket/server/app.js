const Koa = require('koa')
const Router = require('koa-router')
const routerFe = require('../router')
const app = new Koa()
const HOST = '127.0.0.1'
const PORT = process.env.PORT || 3000


// app.use( async ( ctx ) => {
//   ctx.body = 'hello koa2'
// })


app.use(require('./utils/responseMiddle'))
app.use(routerFe.routes()).use(routerFe.allowedMethods())

app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`)
})
