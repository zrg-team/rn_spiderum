import React from 'react'
import {
  View,
  TouchableOpacity
} from 'react-native'
import {
  Text,
  withStyles
} from 'react-native-ui-kitten'
import FastImage from 'react-native-fast-image'
import * as Animatable from 'react-native-animatable'
import { textStyle } from '../../../styles/common'

class CategoryItemComponent extends React.Component {
  render () {
    const {
      item,
      style,
      image,
      onPress,
      themedStyle,
      animationDeplay,
      shouldHaveAnimation,
      ...restProps
    } = this.props
    let Wrapper = View
    let wrapperProps = {}
    if (shouldHaveAnimation) {
      Wrapper = Animatable.View
      wrapperProps = { delay: animationDeplay, duration: 420, useNativeDriver: true, animation: 'zoomIn', easing: 'ease-in-out-sine' }
    }
    return (
      <Wrapper {...wrapperProps}>
        <TouchableOpacity
          activeOpacity={0.9}
          {...restProps}
          onPress={() => onPress(item)}
          style={[themedStyle.container, style]}
        >
          <FastImage
            style={themedStyle.image}
            resizeMode={FastImage.resizeMode.cover}
            source={image}
          />
          <Text
            style={themedStyle.titleLabel}
            category='h2'
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      </Wrapper>
    )
  }
}

export default withStyles(CategoryItemComponent, (theme) => ({
  container: {
    minHeight: 190,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 5,
    marginTop: 10
  },
  tipsContainer: {
    marginTop: 16
  },
  activityContainer: {
    marginTop: 48
  },
  image: {
    flex: 1,
    width: '100%'
  },
  titleLabel: {
    position: 'absolute',
    top: 10,
    left: 10,
    maxWidth: '80%',
    color: 'white',
    ...textStyle.headline
  },
  activityBarLabel: {
    color: 'white'
  }
}))
