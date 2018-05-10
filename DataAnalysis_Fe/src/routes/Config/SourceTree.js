
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
import DragTable from '../../components/DragTable';
import { unionSet } from '../../utils/utils';

const { TabPane } = Tabs;
const { TreeNode } = Tree;



@connect(({url,loading}) => ({
  url,
  loading: loading.models.url,
}))
@Form.create()
export default class SourceTree extends PureComponent {
  state={
    checkedKeys:["砸金蛋_ [总量]-&#x65E5;&#x671F;-&#x65E5;&#x671F;"], // 默认勾选此日期节点
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
    const stateCheckedKeys = this.state.checkedKeys;
    const currentCheckedKeys = checkedKeys.checked;
    let checkedAllKeys = [];
    if(head === this.state.checkedHead){
      checkedAllKeys = checkedKeys.checked;
    }else{
      const unionArr = unionSet(currentCheckedKeys,stateCheckedKeys);
      checkedAllKeys = unionArr.filter(item => {
        return item.indexOf(head) === -1 || new Set(currentCheckedKeys).has(item)
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
          (col.head === name && col.checked)
          ||
          (col.head === "砸金蛋_ [总量]"  && col.first === "&#x65E5;&#x671F;" && col.second === "&#x65E5;&#x671F;")
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
      return <TreeNode title={this.renderTitle(item,head)} key={`${head}-${item.key}`} dataRef={item} disableCheckbox={`${head}-${item.key}` === `砸金蛋_ [总量]-&#x65E5;&#x671F;-&#x65E5;&#x671F;`} />;
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
    const { url: { treeInfo ,data ,colsInfo },loading } = this.props;
    const TabPaneList = this.mapTabPane(treeInfo.list);
    const checkedCols = colsInfo.filter(col => col.checked);
    const columns = checkedCols.map(colObj =>{
      return {
        title:colObj.text ? colObj.text : `${colObj.head}-${colObj.first}-${colObj.second}`,
        dataIndex:`${colObj.head}-${colObj.first}-${colObj.second}`,
        key:`${colObj.head}-${colObj.first}-${colObj.second}`,
      }
    });
    const operations = <Button onClick={this.saveCheckedKeys}>保存</Button>;
    return(
      <Tabs
        tabPosition="top"
        tabBarExtraContent={operations}
      >
        <TabPane tab="周报表格" key="tablePane">
          <DragTable
            loading={loading}
            data={data}
            columns={columns}
          />
        </TabPane>
        {TabPaneList}
      </Tabs>
    );
  }
}
