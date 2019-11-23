import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text,
  ScrollView,
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
      formComponent,
      touchOutSideToHide,
      enableAnimation,
      backButtonClose
    })
  }

  handleTouchOutSide () {
    const { touchOutSideToHide } = this.state
    if (touchOutSideToHide) {
      this.hide()
    }
  }

  render () {
    const { show, enableAnimation } = this.state
    if (!show) {
      return null
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
          {this.state.formComponent}
        </Animated.View>
      </View>
    )
  }
}
const Content = (props, context) => {
  return [
    <View
      key='main'
      style={[
        styles.modalWrapper,
        props.modalWrapper,
        { backgroundColor: '#FFFFFF' }
      ]}
    >
      <View style={[styles.modalHeader]}>{props.modalHeader}</View>
      <ScrollView bounces={false}>
        <View style={[styles.modalBody, props.modalBodyStyle]}>{props.modalBody}</View>
      </ScrollView>
      <View style={[styles.modalFooter, props.modalFooter || {}]}>
        {props.primaryAction && <View style={[{ marginBottom: 24 }, props.primaryStyle || {}]}>{props.primaryAction}</View>}
        {props.handleCancelAction ? (
          <View style={styles.buttonCancelWrapper}>
            <TouchableOpacity onPress={props.handleCancelAction}>
              <Text align='center' weight='500'>
                {props.titleSecondary ? props.titleSecondary : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>,
    props.outComponent || null
  ]
}

const styles = StyleSheet.create({
  container: {
    zIndex: 998,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)'
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
  },
  modalWrapper: {
    borderRadius: 8,
    marginHorizontal: 24,
    height: '70%'
  },
  modalBody: {
    paddingVertical: 24
  },
  buttonCancelWrapper: {
    paddingBottom: 24
  },
  modalFooter: {
    marginTop: 10
  },
  modalHeader: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden'
  }
})

const ModalPage = {
  Component: Modal,
  show (formComponent, touchOutSideToHide = false, backButtonClose = false, enableAnimation = true) {
    instance &&
      instance.show(formComponent, touchOutSideToHide, backButtonClose, enableAnimation)
  },
  hide (callback = () => {}) {
    instance && instance.isShow() && instance.hide(callback)
  },
  Content: props => <Content {...props} />,
  isShow () { return instance.isShow() }
}

export default ModalPage
