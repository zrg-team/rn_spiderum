import React, { memo } from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import { withStyles } from 'react-native-ui-kitten'
import commonStyles, { DEFAULT_HEADER_COLOR } from '../../styles/common'

const DefaultPage = memo((props) => {
  const {
    children,
    containerStyle = {},
    header = true,
    headerColor = DEFAULT_HEADER_COLOR,
    themedStyle
  } = props

  return (
    <SafeAreaView
      style={[commonStyles.defaultPage, themedStyle.backgroundColor, containerStyle]}
    >
      {header && <StatusBar backgroundColor={headerColor} barStyle='light-content' />}
      {children}
    </SafeAreaView>
  )
})

export default withStyles(DefaultPage, (theme) => ({
  backgroundColor: {
    backgroundColor: theme['background-basic-color-2']
  }
}))
