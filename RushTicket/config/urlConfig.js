const url = {
  //登录,获取COOKIE
  POST_LOGIN: 'https://kyfw.12306.cn/passport/web/login',
  //根据日期，始发站，终点站获取车次信息
  GET_TICKET_INFO: 'https://kyfw.12306.cn/otn/leftTicket/query',
  //获取全国车站信息
  GET_STATION_NAME: 'https://kyfw.12306.cn/otn/resources/js/framework/station_name.js?station_version=1.9051',
  //获取验证码图片
  GET_CAPCHA_PNG: 'https://kyfw.12306.cn/passport/captcha/captcha-image?login_site=E&module=login&rand=sjrand&0.3975278673075131',
  //检查验证码是否通过
  POST_CHECK_CAPCHA: 'https://kyfw.12306.cn/passport/captcha/captcha-check',
}

module.exports = url