import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native'
import { ParallaxImage } from 'react-native-snap-carousel'
import { images } from '../../../assets/elements'
const { width: viewportWidth } = Dimensions.get('window')

export default class SliderEntry extends Component {
  shouldComponentUpdate () {
    return false
  }

  get image () {
    const { data: { og_image_url: ogImageUrl }, parallax, parallaxProps, even } = this.props

    return parallax ? (
      <ParallaxImage
        source={ogImageUrl ? { uri: ogImageUrl } : images.default_parallax}
        containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
        style={styles.image}
        parallaxFactor={0.23}
        showSpinner
        resizeMode='contain'
        spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
        {...parallaxProps}
      />
    ) : (
      <Image
        source={ogImageUrl ? { uri: ogImageUrl } : images.default_parallax}
        resizeMode='contain'
        style={styles.image}
      />
    )
  }

  render () {
    const { data, even, onPress } = this.props
    const { title, decription } = data

    const uppercaseTitle = title ? (
      <Text
        style={[styles.title, even ? styles.titleEven : {}]}
        numberOfLines={2}
      >
        {title.toUpperCase()}
      </Text>
    ) : false
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onPress(data)}
        style={styles.slideInnerContainer}
      >
        <View style={styles.shadow} />
        <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
          {/* this.image */}
          <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
        </View>
        <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
          {uppercaseTitle}
          <Text
            style={[styles.subtitle, even ? styles.subtitleEven : {}]}
            numberOfLines={2}
          >
            {decription}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const IS_IOS = Platform.OS === 'ios'

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100
  return Math.round(value)
}

const slideHeight = 95
const slideWidth = wp(100)

export const sliderWidth = viewportWidth
export const itemWidth = slideWidth

const entryBorderRadius = 8

const styles = StyleSheet.create({
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: 5,
    paddingBottom: 0 // needed for shadow
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: 5,
    right: 5,
    bottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    borderRadius: entryBorderRadius,
    elevation: 0
  },
  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius
  },
  imageContainerEven: {
    backgroundColor: '#000'
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: IS_IOS ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius
  },
  // image's border radius is buggy on iOS; let's hack it!
  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: 'white'
  },
  radiusMaskEven: {
    backgroundColor: '#000'
  },
  textContainer: {
    justifyContent: 'center',
    paddingTop: 10 - entryBorderRadius,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius
  },
  textContainerEven: {
    backgroundColor: '#000'
  },
  title: {
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  titleEven: {
    color: 'white'
  },
  subtitle: {
    marginTop: 6,
    color: 'gray',
    fontSize: 12,
    fontStyle: 'italic'
  },
  subtitleEven: {
    color: 'rgba(255, 255, 255, 0.7)'
  }
})
