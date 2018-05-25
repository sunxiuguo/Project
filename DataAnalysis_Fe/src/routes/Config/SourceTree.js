
import React, { PureComponent,Fragment } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import {
  Tabs,
  Form,
  Tree,
  Row,
  Col,
  Button,
} from 'antd';
// import styles from './SourceTree.less';
import EditableTag from '../../components/EditableTag';
import DragList from '../../components/DragList';
import { unionSet,arrayTranspose } from '../../utils/utils';

const { TabPane } = Tabs;
const { TreeNode } = Tree;



@connect(({url,loading}) => ({
  url,
  loading: loading.models.url,
}))
@Form.create()
export default class SourceTree extends PureComponent {
  state={
    // checkedKeys:["砸金蛋_ [总量]-&#x65E5;&#x671F;-&#x65E5;&#x671F;"], // 默认勾选此日期节点
    checkedKeys:[],
    checkedHead:"",
  }

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'url/fetchTree',
    })
  }

  componentDidUpdate(){
    // model里获取到的数据需要经过一次render才能更新在组件里,需要在didUpdate里取model里的数据

  }

  onCheck = (checkedKeys,head) =>{
    // 记录不同tree勾选以及取消勾选的TreeNode
    const { url:{colsInfo} } = this.props;
    const stateCheckedKeys = colsInfo.filter(col => col.checked).map(col => `${col.head}-${col.first}-${col.second}`);;
    const currentCheckedKeys = checkedKeys.checked;
    let checkedAllKeys = [];
    if(head === this.state.checkedHead){
      checkedAllKeys = checkedKeys.checked;
    }else{
      const unionArr = unionSet(currentCheckedKeys,stateCheckedKeys);
      checkedAllKeys = unionArr.filter(item => {
        const itemHead = item.split('-')[0];
        return itemHead!==head || new Set(currentCheckedKeys).has(item)
      })
    }
    this.setState({
      checkedKeys:checkedAllKeys,
      checkedHead:head,
    });
  }

  saveCheckedKeys = () =>{
    // 集合内的key,checked更改为true;其他的全部更改为false
    const { dispatch } = this.props;
    const { checkedKeys } = this.state;
    dispatch({
      type:'url/patchTree',
      payload:{
        key:checkedKeys,
        checked:true,
      },
    })

  }

  mapTabPane = (data) =>{
    return (
      data.map(item => (
        <TabPane tab={item.description} key={item.description}>
          <Row gutter={4}>
            {this.renderTree(item.html)}
          </Row>
        </TabPane>)
      )
    )
  }

  renderTree = (data) =>{
    const { url:{colsInfo} } = this.props;
    const treeNameArr = Object.keys(data);
    return(
      treeNameArr.map(name =>{
        // 筛选出勾选的节点,默认勾选第一个日期节点
        const defaultCheckedKeys = colsInfo.filter(col =>
          col.head === name && col.checked
        ).map(col => `${col.head}-${col.first}-${col.second}`);

        return (
          <Col key={name} span={8} >
            <Fragment>{name}</Fragment>
            <Tree
              checkable
              checkStrictly
              defaultCheckedKeys={defaultCheckedKeys}
              onCheck={(checkedKeys)=>{this.onCheck(checkedKeys,name)}}
              // checkedKeys={this.state.checkedKeys}
            >
              {this.renderTreeNodes(data[name],name)}
            </Tree>
          </Col>
        )
      })
    )
  }

  renderTreeNodes = (data,head) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={this.renderTitle(item,head)} key={`${head}-${item.key}`} dataRef={item}>
            {this.renderTreeNodes(item.children,head)}
          </TreeNode>
        );
      }
      // 禁用第一个日期节点
      return (
        <TreeNode
          title={this.renderTitle(item,head)}
          key={`${head}-${item.key}`}
          dataRef={item}
          // disableCheckbox={`${head}-${item.key}` === `砸金蛋_ [总量]-&#x65E5;&#x671F;-&#x65E5;&#x671F;`}
        />
      )
    });
  }

  renderTitle = (item,head) =>{
    const html = {__html:item.title};
    return (
      <Fragment>
        {/* <span dangerouslySetInnerHTML={html} /> */}
        <EditableTag
          html={html}
          head={head}
          item={item}
        />
      </Fragment>
    )
  }

  render(){
    const { url: { treeInfo ,data:{ list } ,colsInfo,colsOrder },loading } = this.props;
    // console.log(JSON.stringify(list))
    const TabPaneList = this.mapTabPane(treeInfo.list);
    const checkedCols = colsInfo.filter(col => col.checked); // 勾选的列的所有信息
    const mapKeyTag = {};
    for(const item of checkedCols){
      const key = `${item.head}-${item.first}-${item.second}`;
      mapKeyTag[key]=item.text ? item.text:key ;
    }
    const checkedKeys = Object.keys(mapKeyTag); // 勾选列的key
    const dataWithHead = {}; // 带有head first second的所有数据
    for(const item of list){
      Object.assign(dataWithHead,item.html);
    }
    // console.log(`dataWithHead = ${JSON.stringify(dataWithHead)}`)
    let DragListData = [];
    let eggMoneyArr = ["砸蛋收入",0,0,0,0,0,0,0,0];
    for(const head in dataWithHead){
      if(Object.prototype.hasOwnProperty.call(dataWithHead,head)){
        const listData = dataWithHead[head];
        const checkedData = listData.filter(data => {
          const key = `${head}-${data[0]}-${data[1]}`;
          return checkedKeys.indexOf(key) > -1 ;
        }).map((item,index) =>{
          if(head === "砸金蛋(组)_ [总量]" && item[0]!== "ALL"){
            let price = parseInt(item[0].split('&')[0]);
            // console.log(`price = ${price}  item = ${item} result = ${price * parseInt(item[2])}`);
            eggMoneyArr[1] = eggMoneyArr[1] + price * parseInt(item[2]?item[2]:0);
            eggMoneyArr[2] = eggMoneyArr[2] + price * parseInt(item[3]?item[3]:0);
            eggMoneyArr[3] = eggMoneyArr[3] + price * parseInt(item[4]?item[4]:0);
            eggMoneyArr[4] = eggMoneyArr[4] + price * parseInt(item[5]?item[5]:0);
            eggMoneyArr[5] = eggMoneyArr[5] + price * parseInt(item[6]?item[6]:0);
            eggMoneyArr[6] = eggMoneyArr[6] + price * parseInt(item[7]?item[7]:0);
            eggMoneyArr[7] = eggMoneyArr[7] + price * parseInt(item[8]?item[8]:0);
            eggMoneyArr[8] = eggMoneyArr[8] + price * parseInt(item[9]?item[9]:0);
            // console.log(`eggMoneyArr = ${eggMoneyArr}`)
            return ;
          }
          const [first,second,...data] = item;
          const key = `${head}-${first}-${second}`;
          const tag = mapKeyTag[key];
          // return [tag,...data];
          return {id:key,content:[tag,...data]}
        })
        if(checkedData.length >0){
          const checkedResultData = checkedData.filter(item => item)
          DragListData.push(...checkedResultData);
        }
      }
    }
    DragListData.push({
      id:"砸金蛋(组)_ [总量]-砸蛋总收入",
      content:eggMoneyArr,
    })
    // console.log(JSON.stringify(DragListData))
    const orderResult = [];
    const colsOrderItem = colsOrder[0];
    if(colsOrderItem)
      colsOrderItem["extra"] = "砸金蛋(组)_ [总量]-砸蛋总收入"
    // DragListData 根据colsOrderItem 排序
    for(let key in colsOrderItem){
      let found = false;
      DragListData = DragListData.filter(function(item) {
          if(!found && item.id == colsOrderItem[key]) {
              orderResult.push(item);
              found = true;
              return false;
          } else
              return true;
      })
    }
    const csvRowsOrigin = [];
    for(let item of orderResult){
      csvRowsOrigin.push(item.content);
    }
    // console.log(`csvRowsOrigin = ${JSON.stringify(csvRowsOrigin)}`)
    // 数组转置
    const csvRows = arrayTranspose(csvRowsOrigin);
    // console.log(`csvRowsOrigin = ${JSON.stringify(csvRows)}`)
    let csvString = "";
    if(csvRows)
      csvString = '\uFEFF' + csvRows.join('\n');
    const downLoadButton = (
      <Button
          icon="download"
          size="large"
          type="primary"
          style={{marginLeft:"45%"}}
      >
          <a
              href={'data:attachment/csv,' + encodeURI(csvString)}
              target={"_blank"}
              download={"周报.csv"}
              style={{color:"white"}}
          >
              导出周报数据
          </a>
      </Button>);

    const operations = <Button onClick={this.saveCheckedKeys}>保存</Button>;
    return(
      <div>
        <Tabs
          tabPosition="top"
          tabBarExtraContent={operations}
        >
          <TabPane tab="周报表格" key="tablePane">
            <DragList
              loading={loading}
              data={orderResult}
            />
          </TabPane>
          {TabPaneList}
        </Tabs>
        {csvString ? downLoadButton :null}
      </div>
    );
  }
}
