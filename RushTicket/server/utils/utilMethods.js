const superagent = require('superagent');
const url = require('../../config/urlConfig');
const user = require('../../config/userConfig');
const fs = require('fs')

const util = {
    /**
     * 创建并写入文件，如果存在文件则不操作
     * @param {string} fileName 文件路径及名称
     * @param {json} fileData 文件内容
     */
    async writeFile(fileName,fileData){
        fs.exists(fileName,function(exists){
            if(!exists){
                fs.writeFile(fileName, fileData,  function(err) {
                    if (err) 
                        console.error(err)
                    console.log(fileName+"数据写入成功！");
                });
            }
        })
    },

     /**
     * 登录，获取COOKIE
     */
    getCookie() {
        return new Promise((resolve,reject) =>{
            superagent.post(url.POST_LOGIN)
            .type('form')
            .send({
                username: user.name,
                password: user.password,
                appid: "otn",
            })
            .end(function(err, res) {
                if (err)
                    reject(err)
                let cookie = res.header['set-cookie']; //从response中得到cookie
                resolve(cookie)
                //emitter.emit("setCookie");
            })
        })
    },

    /**
     * 判断对象是否拥有参数传递的所有属性，如果拥有传入的所有属性，返回true，否则返回false
     * 比如要判断obj是否拥有a,b属性，则传入obj,a,b
     * @param {*} obj 
     * @param {*} keys 
     */
    hasAllKey(objQuery,...keys){
        let obj = JSON.parse(JSON.stringify(objQuery))
        for(let key of keys){
            if(!obj.hasOwnProperty(key))
                return false
        }
        return true
    }



}

module.exports = util