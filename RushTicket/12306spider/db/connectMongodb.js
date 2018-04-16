const MongoClient = require('mongodb').MongoClient;
// 自动创建数据库 runoob
let mongoConnect = 'mongodb://127.0.0.1:27017/';
// 插入数据，插入到数据库 runoob 的 site 集合中
let insertData = (db, callback) => {
    // 自动创建集合 site
    let collection = db.collection('site');
    // 插入档
    let data = [{
        "name": "菜鸟教程",
        "url": "www.runoob.com"
    }, {
        "name": "菜鸟工具",
        "url": "c.runoob.com"
    }];
    collection.insert(data, function(err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
};
// 删除数据，删除所有 name 为 "菜鸟工具" 的文档
let deleteData = (db, callback) => {
    let collection = db.collection('site');
    let whereStr = {
        "name": "菜鸟工具"
    };
    collection.remove(whereStr, function(err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
};
// 修改数据，将所以 name 为 "菜鸟教程" 的 url 改为 https://www.runoob.com
let updateData = (db, callback) => {
    let collection = db.collection('site');
    let whereStr = {
        "name": "菜鸟教程"
    };
    let updateStr = {
        $set: {
            "url": "https://www.runoob.com"
        }
    };
    collection.update(whereStr, updateStr, {
        multi: true
    }, function(err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
};
// 查询数据，查询 name 为 "菜鸟教程" 的数据
let selectData = (db, callback) => {
    let collection = db.collection('site');
    let whereStr = {
        "name": '菜鸟教程'
    };
    collection.find(whereStr).toArray(function(err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
};

MongoClient.connect(mongoConnect, function(err, db) {
    let dbo = db.db('test');
    console.log("连接成功！");
    insertData(dbo, function(result) {
        console.log("插入数据成功！");
        console.log(result);
        db.close();
    });
    deleteData(dbo, function(result) {
        console.log("删除数据成功！");
        console.log(result);
        db.close();
    });
    updateData(dbo, function(result) {
        console.log("修改数据成功！");
        console.log(result);
        db.close();
    });
    selectData(dbo, function(result) {
        console.log("查询数据成功！");
        console.log(result);
        db.close();
    });
});
