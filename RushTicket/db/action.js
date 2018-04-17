const DBOptions = require('../config/dbConfig');
const MongoClient = require('mongodb').MongoClient;
let mongoConnect = DBOptions.MONGODB_CONNECT; //数据库连接地址
//todo  已有数据库的日志记录，待添加node日志
let action = {
    /**
     * 插入一条数据
     * @param {string} dbName 数据库名称
     * @param {string} collectionName 集合名称
     * @param {Object} data 插入的数据 格式为{"name":'菜鸟教程'}
     * @param {string} remark 可选：数据操作备注
     */
    async insertOne(dbName,collectionName,data,remark){
        MongoClient.connect(mongoConnect, function(err, db) {
            if (err) 
                throw err;
            let dbo = db.db(dbName);
            dbo.collection(collectionName).insertOne(data, function(err, res) {
                if (err) 
                    throw err;
                console.log(`
                    数据库：${dbName}
                    集合：${collectionName}
                    成功插入${res.insertedCount}条数据
                    ${remark ? remark : ""}
                `);
                db.close();
            });
        });
    },

    /**
     * 插入多条数据
     * @param {string} dbName 数据库名称
     * @param {string} collectionName 集合名称
     * @param {Array} data 车站信息数组 格式为[{"name":'菜鸟教程1'},{"name1":'菜鸟教程2'}]
     * @param {string} remark 可选：数据操作备注
     */
    async insertMany(dbName,collectionName,data,remark){
        MongoClient.connect(mongoConnect, function(err, db) {
            if (err) 
                throw err;
            let dbo = db.db(dbName);
            dbo.collection(collectionName).insertMany(data, function(err, res) {
                if (err) 
                    throw err;
                console.log(`
                    数据库：${dbName}
                    集合：${collectionName}
                    成功插入${res.insertedCount}条数据
                    ${remark ? remark : ""}
                `);
                db.close();
            });
        });
    },

    /**
     * 查询数据
     * @param {string} dbName 数据库名称
     * @param {string} collectionName 集合名称
     * @param {Object} filter 查询条件 如果为{}，则返回集合中的所有数据;如果不为{},格式为 {"name":'菜鸟教程'}
     * @param {string} remark 可选：数据操作备注
     */
    async select(dbName,collectionName,filter,remark){
        MongoClient.connect(mongoConnect, function(err, db) {
            //todo  根据传入参数不同，进行分页查询，排序等操作
            if (err) 
                throw err;
            let dbo = db.db(dbName);
            dbo.collection(collectionName). find(filter).toArray(function(err, result) {
                if (err) 
                    throw err;
                console.log(`${remark ? remark : ""}`)
                console.log(result)
                db.close();
            });
        }); 
    },

    /**
     * 更新数据
     * @param {string} dbName 数据库名称
     * @param {string} collectionName 集合名称
     * @param {Object} updateData 更新后的数据 格式为 {$set: { "url" : "https://www.runoob.com" }}
     * @param {Object} filter 查询条件 格式为 {"type":'en'}
     * @param {string} remark 可选：数据操作备注
     */
    async update(dbName,collectionName,updateData,filter,remark){
        MongoClient.connect(mongoConnect, function(err, db) {
            if (err) 
                throw err;
            var dbo = db.db(dbName);
            dbo.collection(collectionName).updateMany(filter, updateData, function(err, res) {
                if (err) 
                    throw err;
                console.log(`
                    数据库：${dbName}
                    集合：${collectionName}
                    ${res.result.nModified}条文档被更新,更新条件为${JSON.stringify(filter)},更新后的数据为${JSON.stringify(updateData)}
                    ${remark ? remark : ""}
                `);
                db.close();
            });
        })
    },
    /**
     * 删除数据
     * @param {string} dbName 数据库名称
     * @param {string} collectionName 集合名称
     * @param {Object} filter 查询条件 格式为 { type: "en" }
     * @param {string} remark 可选：数据操作备注
     */
    async delete(dbName,collectionName,filter,remark){
        MongoClient.connect(mongoConnect, function(err, db) {
            if (err) 
                throw err;
            var dbo = db.db(dbName);
            dbo.collection(collectionName).deleteMany(filter, function(err, obj) {
                if (err) 
                    throw err;
                console.log(`
                    数据库：${dbName}
                    集合：${collectionName}
                    ${obj.result.n}条文档被删除,删除条件为${JSON.stringify(filter)}
                    ${remark ? remark : ""}
                `);
                db.close();
            });
        })
    },

    /**
     * 删除集合
     * @param {string} dbName 数据库名称
     * @param {string} collectionName 集合名称
     * @param {string} remark 可选：数据操作备注
     */
    async drop(dbName,collectionName,remark){
        MongoClient.connect(mongoConnect, function(err, db) {
            if (err) 
                throw err;
            var dbo = db.db(dbName);
            dbo.collection(collectionName).drop(function(err, delOK) {  // 执行成功 delOK 返回 true，否则返回 false
                if (err) 
                    throw err;
                if (delOK) 
                    console.log(`
                        数据库：${dbName}
                        ${collectionName}已成功删除
                        ${remark ? remark : ""}
                    `);
                db.close();
            });
        })
    }
}

module.exports = action;
























// // 插入数据，插入到数据库 runoob 的 site 集合中
// let insertData = (db, callback) => {
//     // 自动创建集合 site
//     let collection = db.collection('site');
//     // 插入档
//     let data = [{
//         "name": "菜鸟教程",
//         "url": "www.runoob.com"
//     }, {
//         "name": "菜鸟工具",
//         "url": "c.runoob.com"
//     }];
//     collection.insert(data, function(err, result) {
//         if (err) {
//             console.log('Error:' + err);
//             return;
//         }
//         callback(result);
//     });
// };
// // 删除数据，删除所有 name 为 "菜鸟工具" 的文档
// let deleteData = (db, callback) => {
//     let collection = db.collection('site');
//     let whereStr = {
//         "name": "菜鸟工具"
//     };
//     collection.remove(whereStr, function(err, result) {
//         if (err) {
//             console.log('Error:' + err);
//             return;
//         }
//         callback(result);
//     });
// };
// // 修改数据，将所以 name 为 "菜鸟教程" 的 url 改为 https://www.runoob.com
// let updateData = (db, callback) => {
//     let collection = db.collection('site');
//     let whereStr = {
//         "name": "菜鸟教程"
//     };
//     let updateStr = {
//         $set: {
//             "url": "https://www.runoob.com"
//         }
//     };
//     collection.update(whereStr, updateStr, {
//         multi: true
//     }, function(err, result) {
//         if (err) {
//             console.log('Error:' + err);
//             return;
//         }
//         callback(result);
//     });
// };
// // 查询数据，查询 name 为 "菜鸟教程" 的数据
// let selectData = (db, callback) => {
//     let collection = db.collection('site');
//     let whereStr = {
//         "name": '菜鸟教程'
//     };
//     collection.find(whereStr).toArray(function(err, result) {
//         if (err) {
//             console.log('Error:' + err);
//             return;
//         }
//         callback(result)
//     });
// };

// MongoClient.connect(DBOptions.MONGODB_CONNECT, function(err, db) {
//     let dbo = db.db('test');
//     console.log("连接成功！");
//     insertData(dbo, function(result) {
//         console.log("插入数据成功！");
//         console.log(result);
//         db.close();
//     });
//     deleteData(dbo, function(result) {
//         console.log("删除数据成功！");
//         console.log(result);
//         db.close();
//     });
//     updateData(dbo, function(result) {
//         console.log("修改数据成功！");
//         console.log(result);
//         db.close();
//     });
//     selectData(dbo, function(result) {
//         console.log("查询数据成功！");
//         console.log(result);
//         db.close();
//     });
// });
