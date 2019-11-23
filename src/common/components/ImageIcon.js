import React, { memo } from 'react'
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { icons } from '../../assets/elements'

export default memo(function ({
  onPressOut,
  onPressIn,
  onPress,
  onLongPress,
  icon,
  imageStyles,
  style,
  ...rest
}) {
  const Wrapper = (onPressOut || onPressIn || onPress || onLongPress)
    ? TouchableOpacity : View
  return (
    <Wrapper
      {...rest}
      onPressOut={onPressOut}
      onPressIn={onPressIn}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.container, style]}
    >
      <Image source={icons[icon]} style={[styles.icon, imageStyles]} resizeMode='contain' />
    </Wrapper>
  )
})

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 29,
    height: 29
  }
})
