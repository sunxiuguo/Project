import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { headbeat_detail,
  headbeat_detail1,
  headbeat_detail2,
  headbeat_detail3,
  headbeat_detail4,
  headbeat_detail5,
  headbeat_detail6 } from '../../resources/index';
import SwiperImage from '../../components/Swiper'
import './index.less'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }


  render () {
    const swiperImages = [
      {
        key: '1',
        name: 'detail',
        url: headbeat_detail,
        pathTo: ''
      },
      {
        key: '2',
        name: 'detail1',
        url: headbeat_detail1,
        pathTo: ''
      },
      {
        key: '3',
        name: 'detail2',
        url: headbeat_detail2,
        pathTo: ''
      },
      {
        key: '4',
        name: 'detail3',
        url: headbeat_detail3,
        pathTo: ''
      },
      {
        key: '5',
        name: 'detail4',
        url: headbeat_detail4,
        pathTo: ''
      },
      {
        key: '6',
        name: 'detail5',
        url: headbeat_detail5,
        pathTo: ''
      },
      {
        key: '7',
        name: 'detail6',
        url: headbeat_detail6,
        pathTo: ''
      },

    ];

    return (
      <View className='index'>
        <SwiperImage images={swiperImages} />
      </View>
    )
  }
}

