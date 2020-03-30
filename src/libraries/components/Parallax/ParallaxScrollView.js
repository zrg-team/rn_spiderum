import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  Platform
} from 'react-native'
import { Transition } from 'react-navigation-fluid-transitions'
import { SCREEN_HEIGHT, DEFAULT_WINDOW_MULTIPLIER } from './constants'
import styles from './styles'

const { width } = Dimensions.get('window')

const ScrollViewPropTypes = ScrollView.propTypes

const IPHONE_HEADER_HEIGHT = 30

export default class ParallaxScrollView extends Component {
  constructor () {
    super()

    this.state = {
      scrollY: new Animated.Value(0)
    }
  }

  scrollTo (where) {
    if (!this._scrollView) return
    this._scrollView.scrollTo(where)
  }

  renderBackground () {
    var { noTransition, imageUrl, windowHeight, backgroundSource, onBackgroundLoadEnd, onBackgroundLoadError } = this.props
    var { scrollY } = this.state
    if (!windowHeight || !backgroundSource) {
      return null
    }
    const transform = [
      {
        translateY: scrollY.interpolate({
          inputRange: [-windowHeight, 0, windowHeight],
          outputRange: [windowHeight / 2, 0, -windowHeight / 3]
        })
      },
      {
        scale: scrollY.interpolate({
          inputRange: [-windowHeight, 0, windowHeight],
          outputRange: [2, 1, 1]
        })
      }
    ]
    let RenderComponent = null
    if (noTransition) {
      RenderComponent = (
        <Animated.Image
          style={[
            styles.background,
            {
              height: windowHeight,
              transform
            }
          ]}
          source={backgroundSource}
          onLoadEnd={onBackgroundLoadEnd}
          onError={onBackgroundLoadError}
        >
        </Animated.Image>
      )
    } else {
      RenderComponent = (
        <Transition shared={imageUrl}>
          <Animated.Image
            style={[
              styles.background,
              {
                height: windowHeight,
                transform
              }
            ]}
            source={backgroundSource}
            onLoadEnd={onBackgroundLoadEnd}
            onError={onBackgroundLoadError}
          >
          </Animated.Image>
        </Transition>
      )
    }

    return RenderComponent
  }

  renderHeaderView () {
    const { windowHeight, backgroundSource, navBarHeight } = this.props
    const { scrollY } = this.state
    if (!windowHeight || !backgroundSource) {
      return null
    }

    const transform = [
      {
        translateX: scrollY.interpolate({
          inputRange: [-windowHeight, 0, windowHeight],
          outputRange: [windowHeight / 2, 0, -windowHeight / 3],
          extrapolate: 'clamp'
        })
      }
    ]

    const newNavBarHeight = navBarHeight || 60
    const newWindowHeight = windowHeight - newNavBarHeight

    return (
      <Animated.View
        style={{
          zIndex: 2,
          height: newWindowHeight,
          justifyContent: 'center',
          alignItems: 'center',
          transform
        }}
      />
    )
  }

  renderScrollHeader () {
    const { windowHeight, backgroundSource, headerView, scrollHeaderHeight } = this.props
    const { scrollY } = this.state
    if (!windowHeight || !backgroundSource || !headerView) {
      return null
    }

    let transform = []

    if (Platform.OS === 'ios') {
      transform = [
        {
          translateY: scrollY.interpolate({
            inputRange: [-windowHeight, 0, windowHeight],
            outputRange: [windowHeight / 2, 0, -windowHeight + IPHONE_HEADER_HEIGHT],
            extrapolate: 'clamp'
          })
        }
      ]
    } else {
      transform = [
        {
          translateY: scrollY.interpolate({
            inputRange: [-windowHeight, 0, windowHeight],
            outputRange: [windowHeight / 2, 0, -windowHeight + scrollHeaderHeight - StatusBar.currentHeight],
            extrapolate: 'clamp'
          })
        }
      ]
    }

    const scale = scrollY.interpolate({
      inputRange: [-windowHeight, 0, windowHeight],
      outputRange: [1, 1, 0.8],
      extrapolate: 'clamp'
    })

    const translateY = scrollY.interpolate({
      inputRange: [0, windowHeight / 3, windowHeight * 0.8, windowHeight],
      outputRange: [0, 0, 0, StatusBar.currentHeight],
      extrapolate: 'clamp'
    })

    const smTranslateY = scrollY.interpolate({
      inputRange: [0, windowHeight / 3, windowHeight * 0.8, windowHeight],
      outputRange: [0, 0, 0, -15],
      extrapolate: 'clamp'
    })

    const opacity = scrollY.interpolate({
      inputRange: [-windowHeight, 0, windowHeight],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp'
    })

    return (
      <Animated.View
        style={[{
          zIndex: 999,
          height: windowHeight,
          position: 'absolute',
          transform
        }]}
      >
        {headerView({
          scale: { transform: [{ scale }] },
          translateY: { transform: [{ translateY }] },
          opacity: { opacity },
          smTranslateY: { transform: [{ translateY: smTranslateY }] }
        })}
      </Animated.View>
    )
  }

  rendernavBar () {
    const {
      navBarView,
      windowHeight,
      backgroundSource,
      navBarHeight
    } = this.props
    if (!windowHeight || !backgroundSource) {
      return null
    }

    const newNavBarHeight = navBarHeight || 65

    if (!navBarView) {
      return null
    }
    return (
      <Animated.View
        style={{
          height: newNavBarHeight,
          width
        }}
      >
        {navBarView({})}
      </Animated.View>
    )
  }

  render () {
    const { style, ...props } = this.props

    return (
      <View style={[styles.container, style]}>
        {this.renderBackground()}
        {this.renderScrollHeader()}
        <Animated.ScrollView
          ref={component => {
            this._scrollView = component
          }}
          {...props}
          style={styles.scrollView}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ], { useNativeDriver: true })}
          scrollEventThrottle={16}
        >
          {this.rendernavBar()}
          {this.renderHeaderView()}
          <View style={[styles.content, props.scrollableViewStyle]}>
            {this.props.children}
          </View>
        </Animated.ScrollView>
      </View>
    )
  }
}

ParallaxScrollView.defaultProps = {
  backgroundSource: { uri: 'http://i.imgur.com/6Iej2c3.png' },
  windowHeight: SCREEN_HEIGHT * DEFAULT_WINDOW_MULTIPLIER,
  leftIconOnPress: () => console.debug('Left icon pressed'),
  rightIconOnPress: () => console.debug('Right icon pressed')
}

ParallaxScrollView.propTypes = {
  ...ScrollViewPropTypes,
  backgroundSource: PropTypes.object,
  windowHeight: PropTypes.number,
  navBarTitle: PropTypes.string,
  navBarTitleColor: PropTypes.string,
  navBarTitleComponent: PropTypes.node,
  navBarColor: PropTypes.string,
  userImage: PropTypes.string,
  userName: PropTypes.string,
  userTitle: PropTypes.string,
  headerView: PropTypes.func,
  leftIcon: PropTypes.object,
  rightIcon: PropTypes.object
}
