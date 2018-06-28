/**
 * Demo
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './index.less'

export default class Demo extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onListButtonClick = (e) => {
    // 列表页按钮
    e.stopPropagation(); // 阻止事件冒泡
    Taro.navigateTo({
      url: '/pages/list/index'
    })
  }

  onDetailButtonClick = (e) => {
    // 详情页按钮
    e.stopPropagation();
    Taro.navigateTo({
      url: "/pages/detail/index"
    })
  }

  render () {
    return (
      <View className='index'>
        <Text>这是Demo1!</Text>
        <Button size='mini' type='primary' plain onClick={this.onListButtonClick}>列表页</Button>
        <Button size='mini' type='primary' onClick={this.onDetailButtonClick}>详情页</Button>
      </View>
    )
  }
}
