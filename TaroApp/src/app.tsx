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
      'pages/account/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      list: [
        {
          pagePath: "pages/index/index",
          text: "首页",
          iconPath: "./resources/nav/index_normal.png",
          selectedIconPath: "./resources/nav/index_pressed.png"
        },
        {
          pagePath: "pages/list/index",
          text: "分类",
          iconPath: "./resources/nav/categories_normal.png",
          selectedIconPath: "./resources/nav/categories_pressed.png"
        },
        {
          pagePath: "pages/detail/index",
          text: "购物车",
          iconPath: "./resources/nav/cart_normal.png",
          selectedIconPath: "./resources/nav/cart_pressed.png"
        },
        {
          pagePath: "pages/account/index",
          text: "我的",
          iconPath: "./resources/nav/account_normal.png",
          selectedIconPath: "./resources/nav/account_pressed.png"
        },
      ]
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
