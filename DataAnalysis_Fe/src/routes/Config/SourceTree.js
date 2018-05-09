
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
import { unionSet } from '../../utils/utils';

const { TabPane } = Tabs;
const { TreeNode } = Tree;



@connect(({url}) => ({
  url,
}))
@Form.create()
export default class SourceTree extends PureComponent {
  state={
    checkedKeys:[],
    checkedHead:"",
  }

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'url/fetchTree',
    })
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
        type:"patchTag",
      },
    })

  }

  mapTabPane = data =>{
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

  renderTree = data =>{
    const treeNameArr = Object.keys(data);
    return(
      treeNameArr.map(name =>(
        <Col key={name} span={8} >
          <Fragment>{name}</Fragment>
          <Tree
            checkable
            checkStrictly
            onCheck={(checkedKeys)=>{this.onCheck(checkedKeys,name)}}
            // checkedKeys={this.state.checkedKeys}
          >
            {this.renderTreeNodes(data[name],name)}
          </Tree>
        </Col>)
      )
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
      return <TreeNode title={this.renderTitle(item,head)} key={`${head}-${item.key}`} dataRef={item} />;
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
    const { url: { data } } = this.props;
    const TabPaneList = this.mapTabPane(data.list);
    const operations = <Button onClick={this.saveCheckedKeys}>保存</Button>;
    return(
      <Tabs
        tabPosition="top"
        tabBarExtraContent={operations}
      >
        {TabPaneList}
      </Tabs>
    );
  }
}
