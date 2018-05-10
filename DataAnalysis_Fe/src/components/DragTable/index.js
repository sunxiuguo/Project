import { Table } from 'antd';
import React ,{ PureComponent } from 'react';
import { connect } from 'dva';
// import styles from './index.less';

@connect(({url}) => ({
  url,
}))
export default class DragTable extends PureComponent {

  render(){
    const { data: { list, pagination }, loading, columns, rowKey } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    return (
      <Table
        loading={loading}
        rowKey={rowKey || 'key'}
        // rowSelection={rowSelection}
        dataSource={list}
        columns={columns}
        pagination={paginationProps}
        // onChange={this.handleTableChange}
      />
    )
  }
}
