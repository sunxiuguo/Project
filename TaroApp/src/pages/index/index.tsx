import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './index.less'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onListButtonClick = (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    Taro.navigateTo({
      url: '/pages/list/index'
    })
  }

  onDetailButtonClick = (e) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: "/pages/detail/index"
    })
  }

  render () {
    return (
      <View className='index'>
        <Text>这是首页!</Text>
        <Button size='mini' type='primary' plain onClick={this.onListButtonClick}>列表页</Button>
        <Button size='mini' type='primary' onClick={this.onDetailButtonClick}>详情页</Button>
      </View>
    )
  }
}

