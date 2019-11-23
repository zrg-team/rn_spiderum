import React from 'react'
import {
  View
} from 'react-native'
import {
  withStyles
} from 'react-native-ui-kitten'

class ReactionBarComponent extends React.Component {
  render () {
    const { themedStyle, style, ...restProps } = this.props

    return (
      <View
        {...restProps}
        style={[themedStyle.container, style]}
      />
    )
  }
}

export const ReactionBar = withStyles(ReactionBarComponent, (theme) => ({
  container: {
    flexDirection: 'row'
  }
}))
