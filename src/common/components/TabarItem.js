import React, { memo } from 'react'
import * as Animatable from 'react-native-animatable'
import Icon from 'react-native-vector-icons/AntDesign'
import commonStyles from '../../styles/common'

const pageFlowMapper = {
  Home: 'Home',
  HotList: 'Home',
  News: 'News',
  NewsList: 'News',
  Option: 'Option',
  OptionList: 'Option',
  Top: 'Top',
  TopList: 'Top',
  Category: 'Category',
  Categories: 'Category'
}
export default memo(({ style, currentPage, route }) => {
  const { name: routeName } = route

  const focused = pageFlowMapper[routeName] === pageFlowMapper[currentPage]
  let source
  const render = []
  if (routeName === 'Home') {
    source = 'home'
  } else if (routeName === 'News') {
    source = 'rocket1'
  } else if (routeName === 'Top') {
    source = 'hearto'
  } else if (routeName === 'Option') {
    source = 'setting'
  } else if (routeName === 'Category') {
    source = 'appstore-o'
  }
  // You can return any component that you like here!
  if (focused) {
    const animation = 'zoomIn'
    render.push(
      <Animatable.View
        key='bar'
        animation={animation}
        delay={0}
        duration={240}
        useNativeDriver
        style={[
          commonStyles.bottom_bar_active_item,
          commonStyles.bottom_bar_item_bar
        ]}
      />
    )
    render.push(
      <Animatable.View
        key='icon'
        useNativeDriver
        delay={0}
        animation='bounceIn'
      >
        <Icon
          name={source}
          color='#ff9024'
          size={22}
        />
      </Animatable.View>
    )
  } else {
    render.push(
      <Icon
        key='icon'
        style={style}
        name={source}
        size={22}
      />
    )
  }
  return render
})
