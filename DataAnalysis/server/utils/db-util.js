const Options = require('../../config');
const MongoClient = require('mongodb').MongoClient;
const mongoConnect = Options.database.MONGODB_CONNECT; //数据库连接地址
//todo  已有数据库的日志记录，待添加node日志
const action = {
    /**
     * 插入一条数据
     * @param {string} dbName 数据库名称
     * @param {string} collectionName 集合名称
     * @param {Object} data 插入的数据 格式为{"name":'菜鸟教程'}
     * @param {string} remark 可选：数据操作备注
     */
    insertOne(dbName,collectionName,data,remark){
        return new Promise(( resolve, reject ) =>{
            MongoClient.connect(mongoConnect, function(err, db) {
                if (err) 
                    resolve(err)
                let dbo = db.db(dbName);
                dbo.collection(collectionName).insertOne(data, function(err, res) {
                    if (err) 
                        reject(err)
                    console.log(`
                        数据库：${dbName}
                        集合：${collectionName}
                        成功插入${res.insertedCount}条数据
                        ${remark ? remark : ""}
                    `);
                    resolve(res)
                    db.close()
                });
            });
        })
        
    },

    /**
     * 插入多条数据
     * @param {string} dbName 数据库名称
     * @param {string} collectionName 集合名称
     * @param {Array} data 车站信息数组 格式为[{"name":'菜鸟教程1'},{"name1":'菜鸟教程2'}]
     * @param {string} remark 可选：数据操作备注
     */
    insertMany(dbName,collectionName,data,remark){
        return new Promise(( resolve, reject ) =>{
            MongoClient.connect(mongoConnect, function(err, db) {
                if (err) 
                    resolve(err)
                let dbo = db.db(dbName);
                dbo.collection(collectionName).insertMany(data, function(err, res) {
                    if (err) 
                        reject(err)
                    console.log(`
                        数据库：${dbName}
                        集合：${collectionName}
                        成功插入${res.insertedCount}条数据
                        ${remark ? remark : ""}
                    `);
                    resolve(res)
                    db.close()
                });
            });
        })
    },

    /**
     * 查询数据
     * @param {string} dbName 数据库名称
     * @param {string} collectionName 集合名称
     * @param {Object} filter 查询条件 如果为{}，则返回集合中的所有数据;如果不为{},格式为 {"name":'菜鸟教程'}
     * @param {string} remark 可选：数据操作备注
     */
    select(dbName,collectionName,filter,remark){
        return new Promise(( resolve, reject ) =>{
            MongoClient.connect(mongoConnect, function(err, db) {
                //todo  根据传入参数不同，进行分页查询，排序等操作
                if (err) 
                    resolve(err)
                let dbo = db.db(dbName);
                dbo.collection(collectionName). find(filter).toArray(function(err, result) {
                    if (err) 
                        reject(err)
                    //console.log(`${remark ? remark : ""}`)
                    //console.log(result)
                    resolve(result)
                    db.close();
                });
            }); 
        })
        
    },

    /**
     * 更新数据
     * @param {string} dbName 数据库名称
     * @param {string} collectionName 集合名称
     * @param {Object} updateData 更新后的数据 格式为 {$set: { "url" : "https://www.runoob.com" }}
     * @param {Object} filter 查询条件 格式为 {"type":'en'}
     * @param {string} remark 可选：数据操作备注
     */
    update(dbName,collectionName,updateData,filter,remark){
        return new Promise(( resolve ,reject )=>{
            MongoClient.connect(mongoConnect, function(err, db) {
                if (err) 
                    resolve(err)
                var dbo = db.db(dbName);
                dbo.collection(collectionName).updateMany(filter, updateData, function(err, res) {
                    if (err) 
                        reject(err)
                    if(res)
                        console.log(`
                            数据库：${dbName}
                            集合：${collectionName}
                            ${res.result.nModified}条文档被更新,更新条件为${JSON.stringify(filter)},更新后的数据为${JSON.stringify(updateData)}
                            ${remark ? remark : ""}
                        `);
                    resolve(res)
                    db.close();
                });
            })
        })
        
    },
    /**
     * 删除数据
     * @param {string} dbName 数据库名称
     * @param {string} collectionName 集合名称
     * @param {Object} filter 查询条件 格式为 { type: "en" }
     * @param {string} remark 可选：数据操作备注
     * @returns {number} 返回删除的条数
     */
    delete(dbName,collectionName,filter,remark){
        return new Promise((resolve , reject ) =>{
            MongoClient.connect(mongoConnect, function(err, db) {
                if (err) 
                    resolve(err)
                var dbo = db.db(dbName);
                dbo.collection(collectionName).deleteMany(filter, function(err, obj) {
                    if (err) 
                        reject(err)
                    console.log(`
                        数据库：${dbName}
                        集合：${collectionName}
                        ${obj.result.n}条文档被删除,删除条件为${JSON.stringify(filter)}
                        ${remark ? remark : ""}
                    `);
                    resolve(obj.result.n)
                    db.close();
                });
            })
        })
    },

    /**
     * 删除集合
     * @param {string} dbName 数据库名称
     * @param {string} collectionName 集合名称
     * @param {string} remark 可选：数据操作备注
     */
    drop(dbName,collectionName,remark){
        return new Promise((resolve , reject ) =>{
            MongoClient.connect(mongoConnect, function(err, db) {
                if (err) 
                    resolve(err)
                var dbo = db.db(dbName);
                dbo.collection(collectionName).drop(function(err, delOK) {  // 执行成功 delOK 返回 true，否则返回 false
                    if (err) 
                        reject(err)
                    if (delOK) 
                        console.log(`
                            数据库：${dbName}
                            ${collectionName}已成功删除
                            ${remark ? remark : ""}
                        `);
                    resolve(delOK)
                    db.close();
                });
            })
        })
    },

    /**
     * 判断集合是否存在/是否为空
     * @param {string} dbName 数据库名称
     * @param {string} collectionName 集合名称
     * @param {function} callback 回调函数 返回true，存在集合/集合不为空;返回false，不存在集合/集合为空
     */
    collectionIfExist(dbName,collectionName,callback){
        return new Promise((resolve ,reject ) =>{
            MongoClient.connect(mongoConnect, function(err, db) {
                if (err) 
                    resolve(err)
                let dbo = db.db(dbName);
                dbo.collection(collectionName). find({}).toArray(function(err, result) {
                    if (err) 
                        reject(err)
                    if(result.length == 0)
                        result = false
                    else
                        result = true
                    resolve(result)
                    db.close();
                });
            });
        })
    },
    /**
     * 获取表中的记录总数
     * @param {string} dbName 数据库名称
     * @param {string} collectionName 表名
     */
    async getColContentCount(dbName,collectionName){
        const resultList = await this.select(dbName,collectionName,{});
        const count = resultList.length;
        return count;
    },


    
}

module.exports = action;