
import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import {
  Tabs,
  Form,
} from 'antd';
// import styles from './SourceTree.less';

const {TabPane} = Tabs;


@connect(({url,loading}) => ({
  url,
  loading:loading.models.url,
}))
@Form.create()
export default class SourceTree extends PureComponent {

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'url/fetch',
    })
  }

  mapTabPane = data =>{
    return data.map(item => <TabPane tab={item.description} key={item.description}>{JSON.stringify(item.html)}</TabPane>)
  }

  render(){
    const { url: { data } } = this.props;
    const TabPaneList = this.mapTabPane(data.list);
    return(
      <Tabs
        tabPosition="top"
      >
        {TabPaneList}
      </Tabs>
    );
  }
}
