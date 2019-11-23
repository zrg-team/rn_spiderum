import React from 'react'
import {
  TouchableOpacity
} from 'react-native'
import {
  Text,
  withStyles
} from 'react-native-ui-kitten'
import Icon from 'react-native-vector-icons/Octicons'

class CommentsButtonComponent extends React.Component {
  render () {
    const { style, themedStyle, textStyle, children, ...restProps } = this.props

    return (
      <TouchableOpacity
        style={[themedStyle.container, style]}
        {...restProps}
      >
        <Icon name='comment' size={20} style={themedStyle.icon} />
        <Text
          style={[themedStyle.valueLabel, textStyle]}
          category='p2'
        >
          {children}
        </Text>
      </TouchableOpacity>
    )
  }
}

export const CommentsButton = withStyles(CommentsButtonComponent, (theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    color: theme['color-success-default']
  },
  valueLabel: {
    marginHorizontal: 8
  }
}))
