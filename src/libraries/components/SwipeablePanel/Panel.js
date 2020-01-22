import React, { Component } from 'react'
import { StyleSheet, TouchableHighlight, Animated, Dimensions, PanResponder, Easing } from 'react-native'
import Bar from './Bar'
import Close from './Close'
import PropTypes from 'prop-types'
import { appHeight } from '../../../styles/common'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const FULL_HEIGHT = appHeight
const FULL_WIDTH = Dimensions.get('window').width
const CONTAINER_HEIGHT = appHeight

const STATUS = {
  CLOSED: 0,
  SMALL: 1,
  LARGE: 2
}

class SwipeablePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showComponent: false,
      canScroll: false,
      status: STATUS.CLOSED
    }
    const { height } = props

    this._animateTimingPan = this._animateTimingPan.bind(this)
    this._animateSpringPan = this._animateSpringPan.bind(this)
    this.handlePressCloseButton = this.handlePressCloseButton.bind(this)
    this.closeDetails = this.closeDetails.bind(this)
    this.openDetails = this.openDetails.bind(this)
    this.openLarge = this.openLarge.bind(this)
    this._animateToSmallPanel = this._animateToSmallPanel.bind(this)
    this._animateToLargePanel = this._animateToLargePanel.bind(this)
    this._animateClosingAndOnCloseProp = this._animateClosingAndOnCloseProp.bind(this)
    this.pan = new Animated.ValueXY({ x: 0, y: height })
    this.oldPan = { x: 0, y: 0 }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        const { status } = this.state

        if (status === STATUS.SMALL) {
          this.pan.setOffset({ x: this.pan.x._value, y: FULL_HEIGHT - 400 })
        } else if (status === STATUS.LARGE) {
          this.pan.setOffset({ x: this.pan.x._value, y: 0 })
        }

        this.pan.setValue({ x: 0, y: 0 })
      },
      onPanResponderMove: (evt, gestureState) => {
        const currentTop = this.pan.y._offset + gestureState.dy
        if (currentTop > 0) {
          this.pan.setValue({ x: 0, y: gestureState.dy })
        }
      },
      onPanResponderRelease: (evt, { vx, vy }) => {
        this.pan.flattenOffset()

        const distance = this.oldPan.y - this.pan.y._value
        const absDistance = Math.abs(distance)
        const { status } = this.state
        const { onlyLarge } = this.props

        if (status === STATUS.LARGE) {
          if (absDistance > 0 && absDistance < 100) {
            this._animateToLargePanel()
          } else if (absDistance > 100 && absDistance < CONTAINER_HEIGHT - 200) {
            if (onlyLarge) {
              this._animateClosingAndOnCloseProp(true)
            } else {
              this._animateToSmallPanel()
            }
          } else if (CONTAINER_HEIGHT - 200 < absDistance) {
            this._animateClosingAndOnCloseProp()
          }
        } else {
          if (distance < -100) {
            this._animateClosingAndOnCloseProp(false)
          } else if (distance > 0 && distance > 50) {
            this._animateToLargePanel()
          } else {
            this._animateToSmallPanel()
          }
        }
      }
    })
  }

  componentDidUpdate (prevProps, prevState) {
    const { isActive, openLarge, onlyLarge, height } = this.props

    setTimeout(() => {
      if (prevProps.isActive !== isActive) {
        if (isActive) {
          if (prevProps.height !== height) {
            this.pan = new Animated.ValueXY({ x: 0, y: height })
          }
          if (openLarge || onlyLarge) {
            this.openLarge(height)
          } else {
            this.openDetails()
          }
        } else {
          this.closeDetails(true)
        }
      }
    }, 0)
  }

  _animateClosingAndOnCloseProp (isCloseButtonPress) {
    this.closeDetails(isCloseButtonPress)
  }

  _animateToLargePanel () {
    this._animateSpringPan(0, 0, 200)
    this.setState({ canScroll: true, status: STATUS.LARGE })
    this.oldPan = { x: 0, y: 0 }
  }

  _animateToSmallPanel () {
    this._animateSpringPan(0, FULL_HEIGHT - 400, 300)
    this.setState({ status: STATUS.SMALL })
    this.oldPan = { x: 0, y: FULL_HEIGHT - 400 }
  }

  openLarge (height) {
    this.setState({ height, showComponent: true, status: STATUS.LARGE, canScroll: true })
    Animated.parallel([
      this._animateTimingPan(0, 0)
    ])
    this.oldPan = { x: 0, y: 0 }
  }

  openDetails () {
    this.setState({ showComponent: true, status: STATUS.SMALL })
    Animated.parallel([
      this._animateTimingPan(0, FULL_HEIGHT - 400)
    ])
    this.oldPan = { x: 0, y: FULL_HEIGHT - 400 }
  }

  closeDetails (isCloseButtonPress) {
    const { status } = this.state
    const duration = status === STATUS.LARGE ? 500 : 300
    const easing = isCloseButtonPress ? Easing.bezier(0.98, -0.11, 0.44, 0.59) : Easing.linear

    Animated.parallel([
      this._animateTimingPan(0, FULL_HEIGHT, duration, easing)
    ])

    setTimeout(() => {
      this.setState({ showComponent: false, canScroll: false, status: STATUS.CLOSED })
      this.props.onClose()
    }, status === STATUS.LARGE ? 450 : 250)
  }

  handlePressCloseButton () {
    this._animateClosingAndOnCloseProp(true)
  }

  _animateSpringPan (x, y, duration) {
    return Animated.spring(this.pan, {
      toValue: { x, y },
      easing: Easing.bezier(0.05, 1.35, 0.2, 0.95),
      duration: duration,
      useNativeDriver: true
    }).start()
  }

  _animateTimingPan (x = 0, y = 0, duration = 500, easing = Easing.bezier(0.05, 1.35, 0.2, 0.95)) {
    return Animated.timing(this.pan, {
      toValue: { x, y },
      easing,
      duration,
      useNativeDriver: true
    }).start()
  }

  render () {
    const { showComponent, height } = this.state
    const { style, closeRootStyle, closeIconStyle, zIndex } = this.props
    return showComponent ? (
      <Animated.View
        style={[
          SwipeablePanelStyles.container,
          { height, zIndex },
          { transform: this.pan.getTranslateTransform() },
          style
        ]}
        {...this._panResponder.panHandlers}
      >
        <Bar />
        {this.props.handlePressCloseButton && <Close rootStyle={closeRootStyle} iconStyle={closeIconStyle} onPress={this.handlePressCloseButton} />}
        <KeyboardAwareScrollView
          enableAutomaticScroll
          enableOnAndroid
          contentContainerStyle={SwipeablePanelStyles.scrollViewContentContainerStyle}
        >
          {this.state.canScroll ? (
            <TouchableHighlight>
              <>{this.props.children}</>
            </TouchableHighlight>
          ) : (
            this.props.children
          )}
        </KeyboardAwareScrollView>
      </Animated.View>
    ) : null
  }
}

SwipeablePanel.propTypes = {
  height: PropTypes.number,
  isActive: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  handlePressCloseButton: PropTypes.func,
  style: PropTypes.any,
  closeRootStyle: PropTypes.object,
  closeIconStyle: PropTypes.object,
  openLarge: PropTypes.bool,
  onlyLarge: PropTypes.bool
}

SwipeablePanel.defaultProps = {
  style: {},
  onClose: () => {},
  closeRootStyle: {},
  closeIconStyle: {},
  openLarge: false,
  onlyLarge: false
}

const SwipeablePanelStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: FULL_WIDTH,
    display: 'flex',
    flexDirection: 'column',
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1
  },
  scrollViewContentContainerStyle: {
    width: '100%'
  }
})

export default SwipeablePanel
