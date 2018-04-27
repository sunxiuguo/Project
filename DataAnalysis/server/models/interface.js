const db = require('../utils/db-util');
const dbName = "DataAnalysisBB";
const colName = "interface";


const interfaceInfo = {
    async getInterfaceInfo(params){
        let interfaceInfo = await db.select(dbName,colName,params);
        return interfaceInfo;
    },
    async postInterfaceInfo(params){
        let responseBody = {
            status:"success",
            code:"",
            msg:"",
            data:{
                list:[],
                pagination:{}
            }
        }
        // 插入自增唯一标识key
        let count = await db.getColContentCount(dbName,colName);
        params.key = (count + 1).toString();
        let insertResult = await db.insertOne(dbName,colName,params)
        if(!insertResult)
            responseBody.status = "error";
        //返回新增后 集合中的所有数据
        let data = await db.select(dbName,colName,{});
        responseBody.data.list = data;
        responseBody.data.pagination.total = data.length;
        if(data){
            responseBody.data.pagination.pageSize = 10; //每页显示的条数
            responseBody.data.pagination.current = 1; //当前页码
        }
        return responseBody;
    },
    async deleteInterfaceInfo(params){
        let responseBody = {
            status:"success",
            code:"",
            msg:"",
            data:{
                list:[],
                pagination:{}
            }
        }
        const deleteResult = await db.delete(dbName,colName,params);
        if(!deleteResult)
            responseBody.status = "error";
        //返回删除后 集合中的所有数据
        let data = await db.select(dbName,colName,{});
        responseBody.data.list = data;
        responseBody.data.pagination.total = data.length;
        if(data){
            responseBody.data.pagination.pageSize = 10; //每页显示的条数
            responseBody.data.pagination.current = 1; //当前页码
        }
        return responseBody;
    }
}

module.exports = interfaceInfo;