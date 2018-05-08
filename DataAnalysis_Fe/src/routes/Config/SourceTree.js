
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

const { TabPane } = Tabs;
const { TreeNode } = Tree;



@connect(({url}) => ({
  url,
}))
@Form.create()
export default class SourceTree extends PureComponent {
  state={
    checkedKeys:[],
    activeTab:"砸金蛋_ [总量]",
  }

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'url/fetchTree',
    })
  }

  onCheck = (checkedKeys) =>{
    // 每个表的checkedKeys需要单独存储,因为tree控件上有这样的属性checkedKeys={this.state.checkedKeys},所以会报错,某节点不存在与某tree
    console.log(`${checkedKeys}`)
    this.setState({checkedKeys});
  }

  onTabChange = (key) =>{
    this.setState({
      activeTab:key,
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

  saveCheckedKeys = () =>{
    console.log(`activeTab ${this.state.activeTab}`)
    console.log(JSON.stringify(this.state.checkedKeys))
    // const { dispatch } = this.props;
    // // 修改数据:是否勾选
    // dispatch({
    //   type:'url/patchTree',
    //   payload:this.state.checkedKeys,
    // })
  }

  renderTree = data =>{
    const treeNameArr = Object.keys(data);
    return(
      treeNameArr.map(name =>(
        <Col key={name} span={8} >
          <Fragment>{name}</Fragment>
          <Tree
            checkable
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
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
        onChange={this.onTabChange}
      >
        {TabPaneList}
      </Tabs>
    );
  }
}
