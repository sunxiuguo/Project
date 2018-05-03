const superagent = require('superagent');
const options = require('../../config');
const fs = require('fs');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');;

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
            superagent.post(options.url.POST_LOGIN)
            .type('form')
            .send({
                account: options.user.name,
                password: options.user.password,
            })
            .end(function(err, res) {
                if (err)
                    reject(err)
                let cookie = res.header['set-cookie']; //从response中得到cookie
                resolve(cookie)
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
    },
    /**
     * 根据Url获取网页数据
     * @param {*} url 
     * @returns {html} 返回Html格式text
     */
    async getDataByUrl( url ){
        let cookie = await this.getCookie();
        return new Promise((resolve,reject) =>{
            superagent.get(url)
            .set('Cookie', cookie)
            //.query({order:'desc'}) 查询字符串
            .end(function(err, res) {
                if (err)
                    reject(err)
                resolve(res.text)
            })
        })
    },
    /**
     * 将Html table转换为Json格式数据
     * @param {*} htmlTable 
     * @return json数据
     */
    async mapHtmlTableToJSON( html ){
        const $ = cheerio.load(html);
        let resultJson = {};
        $('.dtable_title').each(function(indexTitle){
            let title = $(this).text();
            $('.dtable_body').each(function(indexBody){
                // htmlTable转换为json
                let tableHtml = cheerio.load($(this).html());
                cheerioTableparser(tableHtml);
                let data = tableHtml("table").parsetable(true,true,false);
                // 去掉a标签
                data = data.map(function(arr){
                    return arr.map(function(item){
                        if(item.indexOf('<a') > -1)
                            item = cheerio.load(item).text();
                        return item;
                    })
                })
                // 将title和Body匹配
                if(indexTitle === indexBody)
                    resultJson[title] = data;
            })
        });
        return resultJson; 
        
    },




}

module.exports = util