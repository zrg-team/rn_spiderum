import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
  BackHandler
} from 'react-native'
import { appHeight } from '../../../styles/common'

let instance = null
const { width } = Dimensions.get('window')
class Modal extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      rotation: false,
      translateY: new Animated.Value(0.5),
      formComponent: null,
      touchOutSideToHide: true,
      enableAnimation: true,
      backButtonClose: false
    }
    instance = this
    this.show = this.show.bind(this)
    this.onBack = this.onBack.bind(this)
    this.handleTouchOutSide = this.handleTouchOutSide.bind(this)
    this.isShow = this.isShow.bind(this)
  }

  isShow () {
    return this.state.show
  }

  hide (callback) {
    this.setState({
      show: false,
      callback: null,
      formComponent: null
    })
    callback && callback()
  }

  onBack () {
    BackHandler.removeEventListener('hardwareBackPress', this.onBack)
    if (this.state.backButtonClose) {
      this.hide()
    }
    return true
  }

  show (formComponent, touchOutSideToHide, backButtonClose, enableAnimation) {
    BackHandler.addEventListener('hardwareBackPress', this.onBack)
    this.setState({
      show: true,
      fullscreen: false,
      formComponent,
      touchOutSideToHide,
      enableAnimation,
      backButtonClose
    })
  }

  showFullScreen (formComponent) {
    BackHandler.addEventListener('hardwareBackPress', this.onBack)
    this.setState({
      show: true,
      fullscreen: true,
      formComponent,
      touchOutSideToHide: false,
      enableAnimation: false,
      backButtonClose: false
    })
  }

  handleTouchOutSide () {
    const { touchOutSideToHide } = this.state
    if (touchOutSideToHide) {
      this.hide()
    }
  }

  render () {
    const { show, enableAnimation, fullscreen, formComponent } = this.state
    if (!show) {
      return null
    }

    if (fullscreen) {
      return (
        <View style={styles.fullscreenContainer}>
          {formComponent}
        </View>
      )
    }

    if (this.state.formComponent != null) {
      Animated.timing(this.state.translateY, {
        toValue: 1,
        easing: Easing.in(),
        duration: 300,
        useNativeDriver: true
      }).start()
    }

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.overlay,
            {
              backgroundColor: 'rgba(0,0,0,0.8)'
            }
          ]}
        />
        <Animated.View
          style={[
            styles.formContainer,
            enableAnimation
              ? {
                transform: [{ scale: this.state.translateY }]
              }
              : {}
          ]}
        >
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, width, height: appHeight }}
            activeOpacity={1}
            onPress={this.handleTouchOutSide}
          />
          {formComponent}
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 998,
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  fullscreenContainer: {
    zIndex: 998,
    position: 'absolute',
    width
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
    left: 0,
    top: 0
  }
})

const ModalPage = {
  Component: Modal,
  show (formComponent, touchOutSideToHide = false, backButtonClose = false, enableAnimation = true) {
    instance &&
      instance.show(formComponent, touchOutSideToHide, backButtonClose, enableAnimation)
  },
  showFullScreen (formComponent) {
    instance && instance.showFullScreen(formComponent)
  },
  hide (callback = () => {}) {
    instance && instance.isShow() && instance.hide(callback)
  },
  isShow () { return instance.isShow() }
}

export default ModalPage
