import React, { Component } from 'react'
import { Animated, StatusBar, Easing, Text, StyleSheet } from 'react-native'

let instance = null
const BAR_HEIGHT = +StatusBar.currentHeight + 28
class ToastComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      component: null,
      props: {},
      containerStyle: {},
      barHeight: BAR_HEIGHT
    }
    this.timeout = null
    this.queue = []
    this.progress = new Animated.Value(0)
  }

  show (component, props = {}) {
    const { force = false, ...rest } = props
    if (force) {
      this.queue = [{ component, props: rest }, ...this.queue]
    } else {
      this.queue.push({ component, props: rest })
    }
    this.process()
  }

  clear () {
    this.hide(() => {
      this.queue = []
    })
  }

  process () {
    const { show } = this.state
    const item = this.queue.shift()
    if (!item || typeof item !== 'object' || show) {
      return
    }
    const { component, props = {} } = item
    const { animationDuration, duration, height, containerStyle, ...containerProps } = props
    this.progress.setValue(0)
    this.setState({
      show: true,
      containerStyle,
      props: containerProps,
      barHeight: (+StatusBar.currentHeight + height) || BAR_HEIGHT,
      component: typeof component === 'string'
        ? <Text style={styles.textDefault}>{component}</Text>
        : component
    }, () => {
      Animated.timing(this.progress, {
        easing: Easing.bezier(0.04, 0.9, 0.11, 0.9),
        duration: animationDuration || ANIMATED_DURATION,
        toValue: ANIMATION_TO_VALUE,
        useNativeDriver: true
      }).start(() => {
        this.timeout = setTimeout(() => {
          this.hide()
        }, HIDE_DURATION || duration)
      })
    })
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  hide () {
    const { show } = this.state
    if (show) {
      clearTimeout(this.timeout)
      Animated.timing(this.progress, {
        easing: Easing.inOut(Easing.ease),
        duration: FAST_ANIMATED_DURATION,
        toValue: 0,
        useNativeDriver: true
      }).start(() => {
        !this.unMount && this.setState({
          show: false,
          props: {},
          barHeight: BAR_HEIGHT,
          containerStyle: {}
        }, () => {
          this.process()
        })
      })
    }
  }

  componentDidMount () {
    instance = this
  }

  getAnimationValue () {
    const { barHeight } = this.state
    const value = this.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-barHeight, 0]
    })
    return {
      transform: [{
        translateY: value
      }],
      height: barHeight
    }
  }

  render () {
    const { component, props, show, containerStyle } = this.state
    if (!component || !show) {
      return null
    }
    return (
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          { ...this.getAnimationValue() }
        ]}
        {...props}
      >
        {component}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: StatusBar.currentHeight,
    position: 'absolute',
    backgroundColor: '#1a936f',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textDefault: {
    color: '#FFFFFF'
  }
})

const ANIMATED_DURATION = 500
const HIDE_DURATION = 800
const FAST_ANIMATED_DURATION = 500
const ANIMATION_TO_VALUE = 1

export default {
  Component: ToastComponent,
  show (message, { ...props }) {
    instance && instance.show(message, props)
  },
  clearQueue () {
    instance && instance.clear()
  },
  hide () {
    instance && instance.hide()
  }
}
