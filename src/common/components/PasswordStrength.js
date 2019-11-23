import React, { memo } from 'react'
import { StyleSheet, View } from 'react-native'
const zxcvbn = require('zxcvbn')

export default memo(props => {
  const ratePass = zxcvbn(props.value || '').score
  // let ratePassText = ''
  let line1Color = ''
  let line2Color = ''
  let line3Color = ''
  if (ratePass >= 4) {
    // ratePassText = 'Strong'
    line1Color = '#65BA0B'
    line2Color = '#65BA0B'
    line3Color = '#65BA0B'
  } else if (ratePass >= 2) {
    // ratePassText = 'Medium'
    line1Color = '#FCC31D'
    line2Color = '#FCC31D'
    line3Color = '#131E30'
  } else {
    line1Color = '#E91C1C'
    line2Color = '#131E30'
    line3Color = '#131E30'
    // ratePassText = 'Weak'
  }

  return (
    <View style={[props.style, styles.containerlinePassword]}>
      {/* {props.isTextVisible && <Text style={styles.txt}>{ratePassText}</Text>} */}
      <View style={[styles.linePassword, { backgroundColor: line1Color }]} />
      <View style={[styles.linePassword, { backgroundColor: line2Color }]} />
      <View style={[styles.linePassword, { backgroundColor: line3Color }]} />
    </View>
  )
})

const styles = StyleSheet.create({
  containerlinePassword: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  lineStrongPassword: {
    height: 5,
    borderRadius: 5,
    width: 25,
    backgroundColor: '#65BA0B',
    marginRight: 2
  },
  linePassword: {
    height: 5,
    borderRadius: 5,
    width: 25,
    marginRight: 2
  },
  lineWeakPassword: {
    height: 5,
    borderRadius: 5,
    width: 25,
    backgroundColor: '#E91C1C',
    marginRight: 2
  },
  lineNormalPassword: {
    height: 5,
    borderRadius: 5,
    width: 25,
    backgroundColor: '#FCC31D',
    marginRight: 2
  },
  lineNonePassword: {
    height: 5,
    borderRadius: 5,
    width: 25,
    backgroundColor: '#131E30',
    marginRight: 2
  },
  txt: {
    paddingRight: 10
  }
})
