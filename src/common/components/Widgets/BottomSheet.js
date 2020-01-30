import React, { PureComponent } from 'react'
import {
  View,
  BackHandler,
  findNodeHandle,
  StatusBar,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import { withStyles } from 'react-native-ui-kitten'
import { BlurView } from '@react-native-community/blur'
import SwipeablePanel from '../../../libraries/components/SwipeablePanel'
import commonStyles, { appHeight } from '../../../styles/common'
let instance = null
const SNAPPOINTS = [
  0,
  appHeight * 0.1,
  appHeight * 0.2,
  appHeight * 0.3,
  appHeight * 0.4,
  appHeight * 0.5,
  appHeight * 0.6,
  appHeight * 0.7,
  appHeight * 0.8,
  appHeight * 0.9,
  appHeight
]

class BottomSheetComponent extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      level: 0,
      component: null,
      onTouchOut: null,
      temporaryHide: false,
      prevertTouchOut: false
    }
    instance = this
    this.show = this.show.bind(this)
    this.onBack = this.onBack.bind(this)
    this.isShow = this.isShow.bind(this)
    this.handleHide = this.handleHide.bind(this)
    this.renderInner = this.renderInner.bind(this)
    this.temporaryShow = this.temporaryShow.bind(this)
    this.handleOnClose = this.handleOnClose.bind(this)
    this.renderBackground = this.renderBackground.bind(this)
    this.handleTemporaryHide = this.handleTemporaryHide.bind(this)
    this.handleTouchOutside = this.handleTouchOutside.bind(this)
  }

  handleOnClose () {
    const { onCloseCallback } = this.state
    this.setState({
      level: 0,
      show: false,
      callback: null,
      component: null,
      onTouchOut: null,
      temporaryHide: false,
      onCloseCallback: null,
      prevertTouchOut: false
    })
    this.blurNode = null
    onCloseCallback && onCloseCallback()
  }

  isShow () {
    return this.state.show
  }

  handleHide () {
    const { onCloseCallback } = this.state
    this.setState({
      level: 0,
      show: false,
      callback: null,
      onTouchOut: null,
      onCloseCallback: null,
      temporaryHide: false,
      prevertTouchOut: false
    }, () => {
      this.closeTimeout = setTimeout(() => {
        this.blurNode = null
        this.setState({
          component: null
        })
      }, 400)
    })
    onCloseCallback && onCloseCallback()
  }

  handleTemporaryHide () {
    this.setState({
      temporaryHide: true
    })
  }

  temporaryShow () {
    this.setState({
      temporaryHide: false
    })
  }

  onBack () {
    BackHandler.removeEventListener('hardwareBackPress', this.onBack)
    if (this.state.backButtonClose) {
      this.handleHide()
    }
    return true
  }

  show (component, {
    level = 6,
    onTouchOut,
    prevertTouchOut,
    onCloseCallback,
    backButtonClose = true
  }) {
    const { parentRef } = this.props
    clearTimeout(this.closeTimeout)
    if (parentRef) {
      this.blurNode = findNodeHandle(parentRef)
    }
    BackHandler.addEventListener('hardwareBackPress', this.onBack)
    this.setState({
      show: true,
      component,
      level,
      onTouchOut,
      temporaryHide: false,
      prevertTouchOut,
      backButtonClose,
      onCloseCallback
    })
  }

  handleTouchOutside () {
    const { onTouchOut, prevertTouchOut } = this.state
    if (onTouchOut && typeof onTouchOut === 'function') {
      return onTouchOut()
    } else if (!prevertTouchOut) {
      this.handleHide()
    }
  }

  renderInner () {
    const { component } = this.state
    return component
  }

  renderBackground () {
    const { appState, themedStyle } = this.props
    if (this.blurNode && appState === 'active') {
      return (
        <TouchableOpacity onPress={this.handleTouchOutside} style={themedStyle.overlay}>
          <BlurView
            viewRef={this.blurNode}
            blurType='light'
            blurAmount={6}
            downsampleFactor={2}
          />
        </TouchableOpacity>
      )
    }
    return <TouchableOpacity onPress={this.handleTouchOutside} style={themedStyle.overlay_background} />
  }

  render () {
    const { themedStyle } = this.props
    const { show, level, component, temporaryHide } = this.state
    const extraStyles = temporaryHide ? { height: 0, overflow: 'hidden' } : {}
    return (
      <View style={themedStyle.container}>
        {(show || component)
          ? this.renderBackground()
          : null}
        <SwipeablePanel
          fullWidth
          isActive={show}
          openLarge
          onlyLarge
          style={[themedStyle.panel, commonStyles.shadow, extraStyles || {}]}
          height={SNAPPOINTS[+level]}
          onClose={this.handleOnClose}
        >
          {this.renderInner()}
        </SwipeablePanel>
      </View>
    )
  }
}

const styles = (theme) => ({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  panel: {
    backgroundColor: theme['background-basic-color-1']
  },
  header: {
    backgroundColor: theme['background-basic-color-1'],
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  panelHeader: {
    alignItems: 'center'
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme['color-primary-focus'],
    marginBottom: 10
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  overlay_background: {
    position: 'absolute',
    backgroundColor: '#000',
    opacity: 0.5,
    width: '100%',
    top: StatusBar.currentHeight,
    height: '100%'
  }
})

function mapStateToProps (state) {
  return {
    appState: state.session.appState
  }
}

export default {
  Component:
    withStyles(
      connect(
        mapStateToProps,
        {}
      )(BottomSheetComponent),
      styles
    ),
  show (component, options = {}) {
    if (instance) {
      instance.show(component, options)
    }
  },
  hide () {
    instance && instance.handleHide()
  },
  temporaryShow () {
    if (instance) {
      instance.temporaryShow()
    }
  },
  temporaryHide () {
    instance && instance.handleTemporaryHide()
  },
  isShow () {
    return (instance && instance.isShow()) || false
  }
}
