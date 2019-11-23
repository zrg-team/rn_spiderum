import React, { memo } from 'react'
import { StyleSheet, View } from 'react-native'

export default memo(() => {
  return (
    <View style={styles.barContainer}>
      <View style={styles.bar} />
    </View>
  )
})

const styles = StyleSheet.create({
  barContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bar: {
    width: '35%',
    height: 6,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#e2e2e2'
  }
})
