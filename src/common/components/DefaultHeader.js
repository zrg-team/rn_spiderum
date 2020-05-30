import React, { memo } from 'react'
// import i18n from 'i18n-js'
import {
  Icon,
  withStyles,
  TopNavigation,
  TopNavigationAction
} from 'react-native-ui-kitten'
import LinearGradient from 'react-native-linear-gradient'
import { useNavigationState, useNavigation } from '@react-navigation/native'
// import * as Animatable from 'react-native-animatable'
import commonStyles, { HEADER_GRADIENT } from '../../styles/common'
import { navigationPop, navigationPopToTop } from '../utils/navigation'
import SearchPanel from '../components/Widgets/SearchPanel'

const DefaultHeader = memo((props) => {
  let navigation = null
  try {
    navigation = useNavigation()
  } catch (err) {
  }
  const handleSearch = () => {
    SearchPanel.show()
  }

  const handleBack = () => {
    try {
      const { backTopTop = false, onPressBack } = props
      if (onPressBack) {
        return onPressBack()
      }
      if (backTopTop) {
        return navigationPopToTop(navigation)
      }
      navigationPop(navigation)
    } catch (err) {

    }
  }

  const getStackLength = () => {
    try {
      const routesLength = useNavigationState(state => state.routes.length)
      return routesLength
    } catch (err) {
      return 0
    }
  }

  const renderLeftComponent = () => {
    const { leftComponent, noBack, onPressBack } = props
    if (leftComponent) {
      return leftComponent
    }
    if (onPressBack || (getStackLength() > 1 && !noBack)) {
      return (
        <TopNavigationAction
          onPress={handleBack}
          icon={(style) => {
            return (<Icon style={[style, {}]} name='arrow-left' />)
          }}
        />
      )
    }
    return null
  }

  const renderRightComponent = () => {
    const { search } = props
    if (search) {
      return [
        <TopNavigationAction
          key='search'
          onPress={handleSearch}
          icon={(style) => {
            return (<Icon style={[style, { fontSize: 30, width: 28 }]} name='search' />)
          }}
        />
      ]
    }
    return null
  }

  const {
    title = '',
    themedStyle,
    linearGradient,
    headerContainer = {},
    headerWrapperContainer = {}
    // leftTitle = ''
  } = props

  if (!linearGradient) {
    return (
      <TopNavigation
        title={title}
        alignment='center'
        titleStyle={{}}
        style={[themedStyle.header, commonStyles.shadow, headerContainer]}
        leftControl={renderLeftComponent()}
        rightControls={renderRightComponent()}
      />
    )
  }
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={HEADER_GRADIENT}
      // locations={[0.1, 0.6, 1]}
      style={[themedStyle.linearGradient, commonStyles.shadow, headerWrapperContainer]}
    >
      <TopNavigation
        title={title}
        alignment='center'
        titleStyle={{}}
        style={[themedStyle.header, commonStyles.shadow, headerContainer]}
        leftControl={renderLeftComponent()}
        rightControls={renderRightComponent()}
      />
    </LinearGradient>
  )
})

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
