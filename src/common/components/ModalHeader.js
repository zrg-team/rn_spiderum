import React from 'react'
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { Transition } from 'react-navigation-fluid-transitions'

export default props => {
  const backgroundColor = props.backgroundColor
    ? props.backgroundColor
    : '#0061B1'

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }, props.style]}>
      {props.image
        ? (
          <Transition shared={`coin_${props.operator}`}>
            <Image source={props.image} style={styles.image} resizeMode='contain' />
          </Transition>
        ) : null}
      <Text style={styles.title}>
        {props.title}
      </Text>
      {props.visibleBtnClose ? (
        <TouchableOpacity
          style={styles.btnClose} onPress={() =>
            props.onClose()}
        >
          <Icon name='ios-close' style={styles.iconPower} />
        </TouchableOpacity>
      ) : null}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row'
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  image: {
    marginRight: 10,
    width: 25,
    height: 30
  },
  btnClose: {
    position: 'absolute',
    right: 0,
    top: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconPower: {
    fontSize: 30,
    color: '#fff'
  }
})
