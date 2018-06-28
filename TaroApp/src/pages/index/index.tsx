import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Navigator, ScrollView } from '@tarojs/components'
import { audio, theater, headset, bag, girldress } from '../../resources/index';
// import { Demo , Demo2 } from '../../components/index'
import SwiperImage from '../../components/Swiper'
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
    const swiperImages = [
      {
        key: '1',
        name: '耳机',
        url: headset,
        pathTo: '/pages/detail/index'
      },
      {
        key: '2',
        name: '家庭影院',
        url: theater,
        pathTo: '/pages/detail/index'
      },
      {
        key: '3',
        name: '蓝牙音响',
        url: audio,
        pathTo: '/pages/detail/index'
      },
    ];
    const topicImages = [
      {
        key: '1',
        name: '背包',
        price: 4598,
        desc: '德国精品,人工缝制上等牛皮',
        url: bag
      },
      {
        key: '2',
        name: '女士半身裙',
        price: 7868,
        desc: '德版女士半身裙,尽显高贵优雅',
        url: girldress
      },
    ];
    const wrapImages = [
      {
        key: '1',
        name: '背包',
        price: 4598,
        desc: '德国精品,人工缝制上等牛皮',
        url: bag
      },
      {
        key: '2',
        name: '女士半身裙',
        price: 7868,
        desc: '德版女士半身裙,尽显高贵优雅',
        url: girldress
      },
    ];
    const topicImagesRender = topicImages.map(item =>
      <View className='item' key={item.key}>
        <Image className='img'  src={item.url} />
        <View className='np'>
            <Text class='name'>{item.name}</Text>
            <Text class='price'>￥{item.price}元起</Text>
        </View>
        <Text class='desc'>{item.desc}</Text>
      </View>
    );
    const wrapImagesRender = wrapImages.map(item =>
      <View className='item-1' key={item.key}>
        <View className='wrap'>
          <Image className='img' src={item.url} mode='aspectFill' />
        </View>
      </View>
    );

    return (
      <View className='index'>
        <SwiperImage images={swiperImages} />

        <View className='section topic'>
          <View className='h'>
            <Navigator url='/pages/detail/index' open-type='switchTab'>
              <Text className='txt'>
                  专题精选
                </Text>
            </Navigator>
          </View>
          <View className='b'>
            <ScrollView className='list' scrollX>
              {topicImagesRender}
            </ScrollView>
          </View>
        </View>

        <View className='section brand'>
          <View className='h'>
            <Navigator url='/pages/detail/index' open-type='switchTab'>
              <Text className='txt'>
                  品牌制造商直供
                </Text>
            </Navigator>
          </View>
          <View className='b'>
            <ScrollView scrollY>
              {wrapImagesRender}
            </ScrollView >
          </View>
        </View>

      </View>
    )
  }
}

