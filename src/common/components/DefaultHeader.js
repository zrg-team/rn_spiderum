import React, { PureComponent } from 'react'
// import i18n from 'i18n-js'
import {
  Icon,
  withStyles,
  TopNavigation,
  TopNavigationAction
} from 'react-native-ui-kitten'
import LinearGradient from 'react-native-linear-gradient'
// import * as Animatable from 'react-native-animatable'
import commonStyles, { HEADER_GRADIENT } from '../../styles/common'
import { navigationPop, navigationPopToTop } from '../utils/navigation'
import SearchPanel from '../components/Widgets/SearchPanel'

class DefaultHeader extends PureComponent {
  constructor (props) {
    super(props)
    this.handleBack = this.handleBack.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.renderRightComponent = this.renderRightComponent.bind(this)
  }

  handleSearch () {
    SearchPanel.show()
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
    const { search } = this.props
    if (search) {
      return [
        <TopNavigationAction
          key='search'
          onPress={this.handleSearch}
          icon={(style) => {
            return (<Icon style={[style, { fontSize: 30, width: 28 }]} name='search' />)
          }}
        />
      ]
    }
    return null
  }

  render () {
    const {
      title = '',
      themedStyle
      // leftTitle = ''
    } = this.props
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={HEADER_GRADIENT}
        // locations={[0.1, 0.6, 1]}
        style={[themedStyle.linearGradient, commonStyles.shadow]}
      >
        <TopNavigation
          title={title}
          alignment='center'
          titleStyle={{}}
          style={[themedStyle.header, commonStyles.shadow]}
          leftControl={this.renderLeftComponent()}
          rightControls={this.renderRightComponent()}
        />
      </LinearGradient>
    )
  }
}

export default withStyles(DefaultHeader, (theme) => ({
  header: {
    backgroundColor: theme['background-basic-color-4']
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
}))
