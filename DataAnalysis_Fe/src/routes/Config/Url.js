import React from 'react';
import WrappedDynamicFieldSet from 'components/WrappedDynamicFieldSet';

export default () => (
  <WrappedDynamicFieldSet
    okText="保存"
    plusText="添加新的接口地址"
    warningText="请填写接口地址或者删除此项"
    labelText="接口地址"
    placeholder="请填写接口地址"
  />
);
