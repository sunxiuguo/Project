import { List } from 'antd';
import React ,{ PureComponent } from 'react';
import { connect } from 'dva';
// import styles from './index.less';

@connect(({url}) => ({
  url,
}))
export default class DragList extends PureComponent {

  componentDidMount(){
    // const { data } = this.props;
  }

  render(){
    const { data } = this.props;
    const count = data.length;
    return (
      <List
        grid={{column: count }}
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List
              dataSource={item}
              renderItem={itemData => (<List.Item>{itemData}</List.Item>)}
            />
          </List.Item>
        )}
      />
    );
  }
}
