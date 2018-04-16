//获取验证码
let url = "https://kyfw.12306.cn/passport/captcha/captcha-image?login_site=E&module=login&rand=sjrand&0.3975278673075131";//get
let queryParmters = {
    login_site: E,
    module: login,
    rand: sjrand,
    //0.19030063072895786: 应该是0-1之间的随机数，同一个数字返回的验证码也是不同的，用postman测试过。
}
//验证码check
let url = "https://kyfw.12306.cn/passport/captcha/captcha-check";//post
let queryParmters = "answer=194%2C129&login_site=E&rand=sjrand";

let response = {"result_message":"验证码已经过期","result_code":"7"}; //验证码过期的返回
response = {"result_message":"验证码校验失败","result_code":"5"}; //验证码错误的返回