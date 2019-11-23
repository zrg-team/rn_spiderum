import React, { Component } from 'react'
import {
  View
} from 'react-native'
import { withStyles } from 'react-native-ui-kitten'
import Carousel from 'react-native-snap-carousel'
// import { navigationPush, screens } from '../../../common/utils/navigation'
import SliderEntry, { sliderWidth, itemWidth } from './CarouselItem'

class CarouselComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      page: 1,
      loading: true,
      refreshing: false
    }

    this.renderItem = this.renderItem.bind(this)
  }

  renderItem ({ item, index }, parallaxProps) {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax
        parallaxProps={parallaxProps}
      />
    )
  }

  render () {
    const { themedStyle, data } = this.props
    return (
      <View style={[themedStyle.carousel]}>
        <Carousel
          data={data}
          renderItem={this.renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          containerCustomStyle={themedStyle.slider}
          contentContainerCustomStyle={themedStyle.sliderContentContainer}
          layout='tinder'
          hasParallaxImages
          loop
        />
      </View>
    )
  }
}

export default withStyles(CarouselComponent, (theme) => ({
  carousel: {
    height: 200
  },
  slider: {
    height: 100,
    overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10 // for custom animation
  }
}))
