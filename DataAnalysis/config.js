const options = {
    database:{
        //数据库连接地址
        MONGODB_CONNECT:'mongodb://127.0.0.1:27017/'
    },
    user:{
        name : "zhujia@myhug.cn",
        password : "jongsuk0914@"
    },
    url:{
        //登录,获取COOKIE
        POST_LOGIN: 'https://auth.myhug.cn/user/login',
    }
    
  }
  
  module.exports = options