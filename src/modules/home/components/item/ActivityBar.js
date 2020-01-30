import React from 'react'
import {
  View
} from 'react-native'
import {
  withStyles
} from 'react-native-ui-kitten'

class ActivityBarComponent extends React.Component {
  render () {
    const { style, themedStyle, children, ...restProps } = this.props

    return (
      <View
        style={[themedStyle.container, style]}
        {...restProps}
      >
        {children}
      </View>
    )
  }
}

export const ActivityBar = withStyles(ActivityBarComponent, (theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme['background-basic-color-3']
  }
}))
