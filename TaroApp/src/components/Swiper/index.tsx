import Taro, { Component } from '@tarojs/taro'
import { Swiper, Image, SwiperItem, Navigator } from '@tarojs/components'
import './index.less'

export default class SwiperImage extends Component {
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }



  render () {
    const { images, ...restProps } = this.props;
    const swipers = images.map( item =>
      <SwiperItem key={item.key}>

          <Image src={item.url}>
          <Navigator url={item.pathTo} />
          </Image>

      </SwiperItem>
  );
    return (
        <Swiper
          class='swiperTop'
          indicatorDots // 是否显示面板指示点
          autoplay      // 是否自动播放
          interval={3000} // 自动切换时间间隔
          duration={500} // 滑动动画时长
          circular //采用衔接滑动
          // {...restProps} //暂时不支持在JSX中使用扩展运算符
        >
          {swipers}
        </Swiper>
    )
  }
}

