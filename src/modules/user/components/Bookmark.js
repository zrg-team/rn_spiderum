import React, { Component } from 'react'
import {
  View
} from 'react-native'
import { List, withStyles } from 'react-native-ui-kitten'
import * as Animatable from 'react-native-animatable'
import { navigationPush, screens } from '../../../common/utils/navigation'
import BookmarkItem from './BookmarkItem'

class BookmarkComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      page: 1,
      loading: false,
      refreshing: false
    }

    this.loadingMore = false

    this.renderItem = this.renderItem.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
    this.handleReading = this.handleReading.bind(this)
    this.handleAuthoring = this.handleAuthoring.bind(this)
  }

  handleReading (article, itemIndex) {
    const { navigation } = this.props
    navigationPush(navigation, screens().Reading, { article, itemIndex, type: 'bookmark' })
  }

  handleAuthoring (article, itemIndex) {
    const { navigation } = this.props
    navigationPush(navigation, screens().Profile, { profileId: article.creator_id.name })
  }

  keyExtractor (item = {}, index) {
    return `${item._id}_${index}`
  }

  renderItem ({ item, index }) {
    const { themedStyle } = this.props
    const shouldHaveAnimation = this.showAnimationNewItem && this.showAnimationNewItem > 0
    this.showAnimationNewItem -= 1
    return (
      <BookmarkItem
        itemIndex={index}
        animationDeplay={(10 - this.showAnimationNewItem) * 140}
        shouldHaveAnimation={shouldHaveAnimation}
        style={themedStyle.item}
        onPress={this.handleReading}
        onPressAuthoring={this.handleAuthoring}
        article={item}
      />
    )
  }

  renderContent () {
    const { data = [], themedStyle } = this.props
    const { refreshing } = this.state
    return (
      <List
        contentContainerStyle={themedStyle.contentContainer}
        style={[themedStyle.scroll]}
        initialNumToRender={20}
        data={data}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        extraData={data}
        onRefresh={this.handleRefresh}
        refreshing={refreshing}
        onEndReached={this.handleLoadMore}
        removeClippedSubviews
        onEndThreshold={0.5}
      />)
  }

  render () {
    const { themedStyle } = this.props
    return (
      <Animatable.View
        delay={100}
        useNativeDriver
        animation='slideInUp'
        style={themedStyle.container}
      >
        <View style={themedStyle.listHistory}>
          {this.renderContent()}
        </View>
      </Animatable.View>
    )
  }
}

export default withStyles(BookmarkComponent, (theme) => ({
  container: {
    flex: 1
  },
  scroll: {
    paddingBotton: 20
  },
  listHistory: {
    flex: 1
  },
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
