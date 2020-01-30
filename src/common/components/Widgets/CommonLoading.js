import React, { Component } from 'react'
import {
  View,
  Easing,
  Animated,
  Dimensions,
  StyleSheet,
  Image
} from 'react-native'
import { images } from '../../../assets/elements'

const { width } = Dimensions.get('window')

let instanceLoadingComponent = null
const DEFAULT_BLOCKING_MODE = true
const DEFAULT_STATES = {
  isShow: false,
  iconProps: {},
  overlayProps: {},
  overlayStyles: {},
  showLoadingIcon: true,
  animationIconOnly: false,
  blocking: DEFAULT_BLOCKING_MODE
}
class CommonLoadingComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ...DEFAULT_STATES
    }
    this.animation = new Animated.Value(0)
    this.runAnimation = this.runAnimation.bind(this)
    this.unMount = false
  }

  runAnimation ({ duration, fromValue, toValue }, callback) {
    this.animation.setValue(fromValue || 0)
    return Animated.timing(this.animation, {
      toValue: toValue || 1,
      useNativeDriver: true,
      duration: duration || 150,
      easing: Easing.in()
    }).start(callback)
  }

  getAnimationStyle () {
    const value = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 1]
    })
    const valueFade = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
    return {
      opacity: valueFade,
      transform: [{
        scale: value
      }]
    }
  }

  static getDerivedStateFromProps (nextProps, state) {
    const { show: nextShow } = nextProps
    const { show } = state
    if (show !== nextShow) {
      if (!nextShow) {
        return {
          ...DEFAULT_STATES
        }
      } else if (nextShow) {
        return {
          isShow: true
        }
      }
    }
    return null
  }

  componentDidMount () {
    const { global } = this.props
    if (global) {
      instanceLoadingComponent = this
    }
  }

  componentWillUnmount () {
    this.unMount = true
    const { global } = this.props
    if (global) {
      instanceLoadingComponent = null
    }
  }

  show (blocking, {
    showLoadingIcon = true,
    iconProps = {},
    overlayProps = {},
    overlayStyles = {},
    animation = true,
    animations = {},
    animationIconOnly = true
  }) {
    this.setState({
      isShow: true,
      iconProps,
      overlayProps,
      overlayStyles,
      showLoadingIcon,
      animationIconOnly,
      blocking
    }, () => {
      if (animation) {
        this.runAnimation(animations, () => {
        })
      }
    })
  }

  onProcess () {
    const { isShow } = this.state
    return isShow
  }

  hide () {
    this.animation.setValue(0)
    this.setState({
      ...DEFAULT_STATES
    })
  }

  render () {
    const {
      isShow,
      blocking,
      showLoadingIcon,
      overlayStyles,
      overlayProps,
      animationIconOnly
    } = this.state
    if (!isShow) {
      return null
    }
    return (
      <Animated.View
        style={[
          componentStyles.background,
          !animationIconOnly ? this.getAnimationStyle() : {}
        ]}
      >
        {isShow && blocking
          ? (
            <View
              style={[componentStyles.overlay, overlayStyles]}
              {...overlayProps}
            />
          ) : null}
        <View style={componentStyles.loadingBarContainer}>
          {showLoadingIcon
            ? (
              <Animated.View
                style={[
                  componentStyles.image,
                  animationIconOnly ? this.getAnimationStyle() : {}
                ]}
              >
                <Image style={componentStyles.image} source={images.splash} />
              </Animated.View>
            ) : null}
        </View>
      </Animated.View>
    )
  }
}

const componentStyles = StyleSheet.create({
  background: {
    top: 0,
    left: 0,
    zIndex: 9999,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    position: 'absolute',
    flexDirection: 'column'
  },
  image: {
    width: 120,
    height: 120,
    alignSelf: 'center'
  },
  fill: {
    height: 5,
    backgroundColor: '#ff9024'
  },
  overlay: {
    zIndex: 111,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#000',
    opacity: 0.6
  },
  container: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    flex: 1
  },
  loading: {
    color: '#FFFFFF'
  },
  loadingBarContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  textContainer: {
    flex: 1,
    width,
    justifyContent: 'center'
  }
})

const CommonLoading = {
  Component: CommonLoadingComponent,
  show (blocking = DEFAULT_BLOCKING_MODE, options = {}) {
    instanceLoadingComponent && instanceLoadingComponent.show(blocking, options)
  },
  hide () {
    instanceLoadingComponent && instanceLoadingComponent.hide()
  },
  onProcess () {
    instanceLoadingComponent && instanceLoadingComponent.onProcess()
  }
}

export default CommonLoading
