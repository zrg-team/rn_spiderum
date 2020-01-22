import React, { Component } from 'react'
import {
  View,
  Easing,
  Animated,
  AppState,
  Dimensions,
  findNodeHandle,
  Platform
} from 'react-native'
import LottieView from 'lottie-react-native'
import { BlurView } from '@react-native-community/blur'
import {
  Text,
  withStyles
} from 'react-native-ui-kitten'
import { animations } from '../../../assets/elements'
const { width } = Dimensions.get('window')

let instanceLoadingComponent = null
const DEFAULT_BLOCKING_MODE = true
const DEFAULT_STATES = {
  title: null,
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
      appActive: true,
      ...DEFAULT_STATES
    }
    this.animation = new Animated.Value(0)
    this.runAnimation = this.runAnimation.bind(this)
    this.unMount = false
    AppState.addEventListener('change', this.onAppStateChange.bind(this))
  }

  onAppStateChange (currentAppState) {
    switch (currentAppState) {
      case 'inactive':
      case 'background':
        this.setState({
          appActive: false
        })
        break
      case 'active': {
        this.setState({
          appActive: true
        })
      }
    }
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
    AppState.removeEventListener('change', this.onAppStateChange)
    const { global } = this.props
    if (global) {
      instanceLoadingComponent = null
    }
  }

  show (blocking, {
    title,
    showLoadingIcon = true,
    iconProps = {},
    overlayProps = {},
    overlayStyles = {},
    animation = true,
    animations = {},
    animationIconOnly = true
  }) {
    const { parentRef } = this.props
    if (parentRef) {
      this.blurNode = findNodeHandle(parentRef)
    }
    this.setState({
      title,
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

  renderBackground () {
    const { themedStyle } = this.props
    const {
      isShow,
      blocking,
      appActive,
      overlayStyles,
      overlayProps
    } = this.state

    return isShow && blocking && this.blurNode && Platform.OS === 'android' && appActive
      ? (
        <View
          style={[themedStyle.overlay, overlayStyles]}
          {...overlayProps}
        >
          <BlurView
            viewRef={this.blurNode}
            blurType='light'
            blurAmount={10}
            downsampleFactor={4}
          />
        </View>
      ) : null
  }

  render () {
    const { themedStyle } = this.props
    const {
      title,
      isShow,
      showLoadingIcon,
      iconProps,
      animationIconOnly
    } = this.state
    if (!isShow) {
      return null
    }
    return (
      <Animated.View
        style={[
          themedStyle.background,
          !animationIconOnly ? this.getAnimationStyle() : {}
        ]}
      >
        {this.renderBackground()}
        <View style={themedStyle.loading_bar_container}>
          {showLoadingIcon
            ? (
              <Animated.View
                style={[
                  themedStyle.image_container,
                  animationIconOnly ? this.getAnimationStyle() : {}
                ]}
              >
                <LottieView
                  style={themedStyle.image}
                  source={animations.loading}
                  autoPlay
                  loop
                  {...iconProps}
                />
                {title
                  ? (<Text style={themedStyle.title}>{title}</Text>) : null}
              </Animated.View>
            ) : null}
        </View>
      </Animated.View>
    )
  }
}

const componentStyles = (theme) => ({
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
  title: {
    textAlign: 'center',
    marginTop: 20
  },
  image_container: {
    width: 220
  },
  image: {
    width: 160,
    height: 160,
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
    position: 'absolute'
    // backgroundColor: '#000',
    // opacity: 0.6
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
  loading_bar_container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  text_container: {
    flex: 1,
    width,
    justifyContent: 'center'
  }
})

const CommonLoading = {
  Component: withStyles(CommonLoadingComponent, componentStyles),
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
