
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



@connect(({url,loading}) => ({
  url,
  loading:loading.models.url,
}))
@Form.create()
export default class SourceTree extends PureComponent {

  state={
    checkedKeys:[],
  }

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'url/fetchTree',
    })
  }

  onCheck = (checkedKeys) =>{
    this.setState({checkedKeys});
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
    const { dispatch } = this.props;
    dispatch({
      type:'url/patchTree',
      payload:this.state.checkedKeys,
    })
  }

  renderTree = data =>{
    const treeNameArr = Object.keys(data);
    return(
      treeNameArr.map(name =>(
        <Col key={name} span={4} >
          <Fragment>{name}</Fragment>
          <Tree
            checkable
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
          >
            {this.renderTreeNodes(data[name])}
          </Tree>
        </Col>)
      )
    )
  }

  renderTitle = (text) =>{
    const html = {__html:text};
    return (
      <Fragment>
        {/* <span dangerouslySetInnerHTML={html} /> */}
        <EditableTag
          html={html}
        />
      </Fragment>

    )
  }

  renderTreeNodes = data => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={this.renderTitle(item.title)} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={this.renderTitle(item.title)} key={item.key} dataRef={item} />;
    });
  }

  render(){
    const { url: { data } } = this.props;
    const TabPaneList = this.mapTabPane(data.list);
    const operations = <Button>保存</Button>;
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
