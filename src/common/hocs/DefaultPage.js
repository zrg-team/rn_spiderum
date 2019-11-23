import React, { PureComponent } from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import commonStyles, { DEFAULT_HEADER_COLOR } from '../../styles/common'

export default class DefaultPage extends PureComponent {
  render () {
    const { children, containerStyle = {}, header = true, headerColor = DEFAULT_HEADER_COLOR } = this.props
    const bgColor = (this.props.type === 'secondary') ? commonStyles.bgSecondary : commonStyles.bgPrimary
    return (
      <SafeAreaView
        style={[commonStyles.defaultPage, containerStyle, bgColor]}
      >
        {header && <StatusBar backgroundColor={headerColor} barStyle='light-content' />}
        {children}
      </SafeAreaView>
    )
  }
}
