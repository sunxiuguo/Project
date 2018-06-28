import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

export default class PageView extends Component {
  config = {
    navigationBarTitleText: '个人中心'
  }

  constructor () {
    super(...arguments)

    this.state = {
        contents: []
    }
  }

  add = () => {
    const cot = this.state.contents;
    cot.push({text: 'hello world'})

    this.setState({
      contents: cot,
    })
  }

  remove = () => {
    const cot = this.state.contents
    cot.pop()
    this.setState({
      contents: cot,
    })
  }

  render () {
    return (
      <View className='container'>
              {this.state.contents.map(item => {
                return (
                  <Text key={item.text}>{item.text}</Text>
                )
              })}
              <Button className='btn-max-w button_style' plain type='default' onClick={this.add}>add line</Button>
              <Button className='btn-max-w button_style' plain type='default' disabled={this.state.contents.length ? false:true} onClick={this.remove}>remove line</Button>
      </View>
    )
  }
}
