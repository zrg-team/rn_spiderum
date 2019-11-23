import React from 'react'
import {
  TouchableOpacity
} from 'react-native'
import {
  Text,
  withStyles
} from 'react-native-ui-kitten'
import Icon from 'react-native-vector-icons/SimpleLineIcons'

class PointButtonComponent extends React.Component {
  render () {
    const { style, themedStyle, textStyle, children, ...restProps } = this.props

    return (
      <TouchableOpacity
        style={[themedStyle.container, style]}
        {...restProps}
      >
        <Icon name='heart' size={20} style={themedStyle.icon} />
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

export const PointButton = withStyles(PointButtonComponent, (theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    color: theme['color-danger-default']
  },
  valueLabel: {
    marginHorizontal: 8
  }
}))
