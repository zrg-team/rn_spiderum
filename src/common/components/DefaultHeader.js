import React, { PureComponent } from 'react'
// import i18n from 'i18n-js'
import {
  Platform,
  StyleSheet
} from 'react-native'
import {
  Icon,
  TopNavigation,
  TopNavigationAction
} from 'react-native-ui-kitten'
import LinearGradient from 'react-native-linear-gradient'
// import * as Animatable from 'react-native-animatable'
import commonStyles, { HEADER_GRADIENT } from '../../styles/common'
import { navigationPop, navigationPopToTop } from '../utils/navigation'
import { isIphoneX } from '../../libraries/iphonex'
import NotificationPanel from '../components/Widgets/NotificationPanel'

export default class DefaultHeader extends PureComponent {
  constructor (props) {
    super(props)
    this.handleBack = this.handleBack.bind(this)
    this.handleNotification = this.handleNotification.bind(this)
    this.renderRightComponent = this.renderRightComponent.bind(this)
  }

  handleNotification () {
    NotificationPanel.show()
  }

  handleBack () {
    const { navigation, backTopTop = false, onPressBack } = this.props
    if (onPressBack) {
      return onPressBack()
    }
    if (backTopTop) {
      return navigationPopToTop(navigation)
    }
    navigationPop(navigation)
  }

  getStackLength () {
    const { navigation } = this.props
    try {
      const parent = navigation.dangerouslyGetParent()
      if (
        parent &&
        parent.state &&
        parent.state.routes
      ) {
        return parent.state.routes.length
      }
      return 0
    } catch (err) {
      return 0
    }
  }

  renderLeftComponent (props) {
    const { leftComponent, noBack, onPressBack } = this.props
    if (leftComponent) {
      return leftComponent
    }
    if (onPressBack || (this.getStackLength() > 1 && !noBack)) {
      return (
        <TopNavigationAction
          onPress={this.handleBack}
          icon={(style) => {
            return (<Icon style={[style, {}]} name='arrow-left' />)
          }}
        />
      )
    }
    return null
  }

  renderRightComponent () {
    const { notification } = this.props
    if (notification) {
      return [
        <TopNavigationAction
          key='notification'
          onPress={this.handleNotification}
          icon={(style) => {
            return (<Icon style={[style, { fontSize: 30, width: 28 }]} name='book-open-variant' />)
          }}
        />
      ]
    }
    return null
  }

  render () {
    const {
      title = ''
      // leftTitle = ''
    } = this.props
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={HEADER_GRADIENT}
        // locations={[0.1, 0.6, 1]}
        style={[styles.linearGradient, commonStyles.shadow]}
      >
        <TopNavigation
          title={title}
          alignment='center'
          titleStyle={{}}
          style={[commonStyles.shadow]}
          leftControl={this.renderLeftComponent()}
          rightControls={this.renderRightComponent()}
        />
      </LinearGradient>
    )
  }
}

const checkHeaderPaddingTop = () => {
  if (isIphoneX()) {
    return 20
  }
  if (Platform.OS === 'ios') {
    return 0
  }
  return 0
}

const styles = StyleSheet.create({
  wrapperContainer: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingTop: checkHeaderPaddingTop()
  },
  rowInLine: {
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  txtHeader: {
    position: 'absolute',
    zIndex: 1,
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%'
  },
  posArrow: {
    left: 0,
    paddingLeft: 10
  },
  iconArrowLeft: {
    color: '#fff',
    fontSize: 30,
    paddingRight: 32
  },
  txtMore: {
    color: '#fff',
    fontSize: 17
  },
  notification: {
    zIndex: 99,
    position: 'absolute',
    right: 0,
    width: 60,
    paddingRight: 23,
    display: 'flex',
    // justifyContent: 'flex-end',
    alignItems: 'flex-end'
  }
})
