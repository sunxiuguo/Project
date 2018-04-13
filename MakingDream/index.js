const koa =  require('koa');
const app = new koa();
const host = '127.0.0.1';
const port = 3000;
app.use(async(ctx)=>{
    ctx.body = 'hello koa2';
})
app.listen(port,host,()=>{
    console.log(`app running at${host}:${port}`)
})
