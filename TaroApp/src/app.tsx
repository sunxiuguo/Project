import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await';
import Index from './pages/index'

import './app.less'

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/list/index',
      'pages/detail/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
