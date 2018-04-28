/*
* @ use 统一响应请求中间件
* @ error-data 返回错误时，可携带的数据
* @ error-msg  自定义的错误提示信息
* @ error-status 错误返回码
* @ error-errdata 可返回服务器生成的错误
* @ success-data  请求成功时响应的数据
* @ success-msg  请求成功时响应的提示信息
* @ 调用ctx.error()   响应错误
* @ 调用ctx.success()  响应成功
*/ 

module.exports = async (ctx, next) => {
    let responseBody = {
        status:"success",
        code:"",
        msg:"",
        data:{
            list:[],
            pagination:{}
        }
    }
    ctx.error = ({ data,result }) => {
        responseBody.data.list = data;
        responseBody.data.pagination.total = data.length;
        responseBody.status = "error";
       ctx.body = responseBody;
    }
    ctx.success = ({ data, result }) => {
        responseBody.data.list = data;
        responseBody.data.pagination.total = data.length;
        if(data){
            responseBody.data.pagination.pageSize = 10; //每页显示的条数
            responseBody.data.pagination.current = 1; //当前页码
        }
        responseBody.status = "success";
        ctx.body = responseBody;
    }
    await next()
}