import React, { Component } from 'react'
import { View, Animated, Dimensions, Easing, StyleSheet } from 'react-native'
const { width } = Dimensions.get('window')

let instance = null
class ProgressBarComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isShow: false,
      blocking: props.blocking || DEFAULT_BLOCKING_MODE
    }
    this.unMount = false
    this.progress = new Animated.Value(0)
  }

  asyncHide () {
    return new Promise((resolve, reject) => {
      Animated.timing(this.progress, {
        easing: Easing.inOut(Easing.ease),
        duration: FAST_ANIMATED_DURATION,
        toValue: 1,
        useNativeDriver: true
      }).start(() => {
        resolve({
          isShow: false,
          blocking: DEFAULT_BLOCKING_MODE
        })
      })
    })
  }

  UNSAFE_componentWillReceiveProps (nextProps) { // eslint-disable-line
    const { show: nextShow } = nextProps
    const { show, blocking } = this.props
    if (show !== nextShow) {
      if (!nextShow) {
        this.hide()
      } else if (nextShow) {
        Animated.timing(
          this.progress
        ).stop()
        this.progress = new Animated.Value(0)
        return this.show(blocking)
      }
    }
  }

  componentDidMount () {
    const { global } = this.props
    if (global) {
      instance = this
    }
  }

  componentWillUnmount () {
    this.unMount = true
    const { global } = this.props
    if (global) {
      instance = null
    }
    Animated.timing(
      this.progress
    ).stop()
  }

  show (blocking) {
    this.progress.setValue(0)
    !this.unMount && this.setState({
      isShow: true,
      blocking,
      onProcess: true
    })
    Animated.timing(this.progress, {
      easing: Easing.bezier(0.04, 0.9, 0.11, 0.9),
      duration: ANIMATED_DURATION,
      toValue: ANIMATION_TO_VALUE,
      useNativeDriver: true
    }).start()
  }

  onProcess () {
    const { isShow } = this.state
    return isShow
  }

  hide () {
    Animated.timing(this.progress, {
      easing: Easing.inOut(Easing.ease),
      duration: FAST_ANIMATED_DURATION,
      toValue: 1,
      useNativeDriver: true
    }).start(() => {
      !this.unMount && this.setState({
        isShow: false,
        blocking: DEFAULT_BLOCKING_MODE
      })
    })
  }

  render () {
    const { isShow, blocking } = this.state
    const fillWidth = this.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, 0]
    })
    if (!isShow) {
      return null
    }
    return (
      <View
        style={[
          componentStyles.background,
          {
            height: blocking
              ? '100%' : 2
          }
        ]}
      >
        {isShow && blocking && <View style={componentStyles.overlay} />}
        <View style={componentStyles.loadingBarContainer}>
          <Animated.View style={[componentStyles.fill, { transform: [{ translateX: fillWidth }] }]} />
        </View>
      </View>
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
  fill: {
    height: 2,
    backgroundColor: '#ff9024'
  },
  overlay: {
    zIndex: 999,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#000',
    opacity: 0.2
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
    width,
    height: 2,
    overflow: 'hidden'
  },
  textContainer: {
    flex: 1,
    width,
    justifyContent: 'center'
  }
})

const ANIMATED_DURATION = 12000
const FAST_ANIMATED_DURATION = 100
const ANIMATION_TO_VALUE = 0.98
const DEFAULT_BLOCKING_MODE = true

const ProgressBar = {
  Component: ProgressBarComponent,
  show (blocking = DEFAULT_BLOCKING_MODE) {
    instance && instance.show(blocking)
  },
  hide () {
    instance && instance.hide()
  },
  onProcess () {
    instance && instance.onProcess()
  }
}

export default ProgressBar
