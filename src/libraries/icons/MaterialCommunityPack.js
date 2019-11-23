import React from 'react'
import { StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default {
  name: 'MaterialCommunityIcons',
  icons: createIconsMap()
}

function IconProvider (name) {
  return {
    toReactElement: (props) => MaterialCommunityIcons({ name, ...props })
  }
}

function MaterialCommunityIcons ({ name, style }) {
  const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style)
  return (
    <Icon
      name={name}
      size={height}
      color={tintColor}
      style={iconStyle}
    />
  )
}

function createIconsMap () {
  return {
    home: IconProvider('home'),
    settings: IconProvider('settings'),
    'arrow-left': IconProvider('arrow-left'),
    'alpha-t-box-outline': IconProvider('alpha-t-box-outline'),
    'alpha-n-box-outline': IconProvider('alpha-n-box-outline'),
    'alpha-h-box-outline': IconProvider('alpha-h-box-outline'),
    'alpha-t-circle': IconProvider('alpha-t-circle'),
    'alpha-n-circle': IconProvider('alpha-n-circle'),
    'alpha-h-circle': IconProvider('alpha-h-circle'),
    'bell-circle-outline': IconProvider('bell-circle-outline'),
    'book-open-variant': IconProvider('book-open-variant')
  }
}
