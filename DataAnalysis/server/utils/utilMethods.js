const superagent = require('superagent');
const options = require('../../config');
const fs = require('fs');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const moment = require('./datetime');
const log4js = require('koa-log4')
const logger = log4js.getLogger('util')

let count = 0;
const util = {
    /**
     * 创建并写入文件，如果存在文件则追加写入
     * @param {string} fileName 文件路径及名称
     * @param {json} fileData 文件内容
     */
    async writeFile(fileName,fileData){
        logger.info(`Enter writeFile `)
        fileName = moment.getNowDatetime() +'_'+ fileName ;
        fs.exists(fileName,function(exists){
            if(!exists){
                fs.writeFile(fileName, JSON.stringify(fileData),  function(err) {
                    if (err) 
                        logger.error(err)
                    logger.info(fileName+"数据写入成功！");
                });
            }else{
                fs.appendFile(fileName, JSON.stringify(fileData), function (err) {
                    if (err) 
                        logger.error(err)
                     //数据被添加到文件的尾部
                     logger.info(fileName+"数据追加写入成功！"); 
                 });
            }
        })
    },

     /**
     * 登录，获取COOKIE
     */
    getCookie() {
        logger.info(`Enter getCookie`)
        return new Promise((resolve,reject) =>{
            superagent.post(options.url.POST_LOGIN)
            .type('form')
            .send({
                account: options.user.name,
                password: options.user.password,
            })
            .end(function(err, res) {
                if (err){
                    logger.error(`In getCookie ->${err}`)
                    reject(err)
                }
                let cookie = res.header['set-cookie']; //从response中得到cookie
                logger.info(`In getCookie ->cookie=${cookie}`)
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
        logger.info(`Enter hasAllKey ->obj=${JSON.stringify(objQuery)} keys=${keys}`)
        let obj = JSON.parse(JSON.stringify(objQuery))
        for(let key of keys){
            if(!obj.hasOwnProperty(key)){
                logger.info(`In hasAllKey ->result=${false}`)
                return false
            }
                
        }
        logger.info(`In hasAllKey ->result=${true}`)
        return true
    },
    /**
     * 根据Url获取网页数据
     * @param {*} url 
     * @returns {html} 返回Html格式text
     */
    async getDataByUrl( url,date ){
        let urlExpand = url;
        if(date)
            urlExpand = `${url}&sday=${date.split(',')[0]}&eday=${date.split(',')[1]}&app=0&sys=000000&filter_id=0`;
        logger.info(`Enter getDataByUrl ->url=${urlExpand}`)
        let cookie = await this.getCookie();
        return new Promise((resolve,reject) =>{
            superagent.get(urlExpand)
            .set('Cookie', cookie)
            //.query({order:'desc'}) 查询字符串
            .end(function(err, res) {
                if (err){
                    logger.error(`In getDataByUrl ->${err}`)
                    reject(err)
                }

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
        logger.info(`Enter mapHtmlTableToJSON`)
        if(!html)
            return [];
        const $ = cheerio.load(html);
        // 周统计html中的列表元素是table_title table_body
        // 其他html中的列表元素是dtable_title dtable_body
        // const titleSelect = $('.dtable_title').length>0 ? '.dtable_title' : '.table_title';
        // const bodySelect = $('.dtable_body').length>0 ? '.dtable_body' : '.table_body';
        const titleSelect = '.dtable_title';
        const bodySelect = '.dtable_body';
        let resultJson = {};
        // $('.dtable_title')  $("div[class$='table_title']")  
        // 使用模糊匹配 耗时太长
        $(titleSelect).each(function(indexTitle){
            let title = $(this).text();
            // $('.dtable_body')  $("div[class$='table_body']")
            $(bodySelect).each(function(indexBody){
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
    /**
     * 将原有的查询结果去掉数据，只留下列名
     * @param {*} listData 
     */
    async renderColumns( listData ){
        logger.info(`Enter renderColumns`)
        let listDataTemp = JSON.parse(JSON.stringify(listData));
        let tableCols = [];
        let colData = listDataTemp.map(function(interfaceItem){
            for(let key in interfaceItem.html){
                interfaceItem.html[key] = util.renderTreeData(
                    interfaceItem.html[key].map(function(htmlItem){
                        let cols = htmlItem.filter((value,index) => index<2);
                        let colObj = {
                            head:key,
                            first:cols[0],
                            second:cols[1],
                            text:"",
                            checked:false,
                        };
                        tableCols.push(colObj);
                        return cols;
                    })
                );
            }
            return interfaceItem;
        });
        return {treeInfo:colData,colsInfo:tableCols};
    },
    /**
     * 将列的二维数组转换为树结构
     * @param {*} list 
     */
    renderTreeData(list){
        logger.info(`Enter renderTreeData`)        
        let tree = [];
        let treeObj = {};
        let firstKey = "";
        list.map(function(item){
            if(item[0] !== firstKey ){
                if(JSON.stringify(treeObj)!== "{}")
                    tree.push(treeObj);
                treeObj = {};
                treeObj.title = item[0]; // ALL
                treeObj.key = item[0]; // ALL
                treeObj.children = [];
                treeObj.children.push({
                    title:item[1],
                    key:`${item[0]}-${item[1]}`,
                })
                firstKey = item[0];
            }else{
                treeObj.children.push({
                    title:item[1],
                    key:`${item[0]}-${item[1]}`,
                })
            }   
        })
        return tree;
    },
    /**
     * 判断两个数组的元素是否相同
     * 
     * @param {any} arr1 
     * @param {any} arr2 
     * @returns true 代表两个数组元素相同;false 代表两个数组元素不同
     */
    isArrSame(arr1 , arr2){
        logger.info(`Enter isArrSame ->arr1=${JSON.stringify(arr1)} arr2=${JSON.stringify(arr2)}`)        
        
        if(arr1.length !== arr2.length){
            logger.info(`In isArrSame ->result=${false}`)
            return false;
        }
            
        for(let item of arr1){
            if(!arr2.includes(item)){
                logger.info(`In isArrSame ->result=${false}`)
                return false;
            }
        }    
        logger.info(`In isArrSame ->result=${true}`)
        return true;
    },
    /**
     * 获取[{id:"123",name:"12313"},{id:"1234",name:"12313"}]这种格式的数组中的某一个key
     * 比如获取id,返回["123","1234"]
     * 
     * @param {any} key 
     * @param {any} list 
     * @returns ["a","b",...]
     */
    getKeyofListobj(key,list){
        logger.info(`Enter getKeyofListobj `)
        let resultArr = [];
        for(let obj of list){
            resultArr.push(obj[key]);
        }
        return resultArr;
    }




}

module.exports = util