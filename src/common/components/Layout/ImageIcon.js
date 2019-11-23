import React, { memo } from 'react'
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native'
import { icons } from '../../../assets/elements'

export default memo(props => {
  const Wrapper = props.onPress ? TouchableOpacity : View
  let source = icons[props.name]
  if (props.active !== undefined) {
    source = props.active ? icons[`${props.name}_active`] : icons[`${props.name}_inactive`]
  }
  return (
    <Wrapper style={[styles.view, props.style]}>
      <Image
        source={source}
        resizeMode='contain'
        style={[styles.container, props.imageStyle]}
      />
    </Wrapper>
  )
})

const styles = StyleSheet.create({
  container: {
    height: 25,
    width: 25
  },
  view: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})
