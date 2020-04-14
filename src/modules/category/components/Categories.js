import React, { Component } from 'react'
import {
  View
} from 'react-native'
import { List, withStyles } from 'react-native-ui-kitten'
import { navigationPush, pages } from '../../../common/utils/navigation'
import { images } from '../../../assets/elements'
import CategoryItem from './CategoryItem'

class CategoriesComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      page: 1,
      loading: true,
      refreshing: false
    }

    this.loadingMore = false

    this.handleReading = this.handleReading.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
    this.showAnimationNewItem = 10
  }

  handleReading (item) {
    const { navigation } = this.props
    navigationPush(navigation, pages().CategoryDetail, { item })
  }

  keyExtractor (item = {}, index) {
    return `${item._id}_${index}`
  }

  renderItem ({ item = {}, index }) {
    const { themedStyle } = this.props
    const shouldHaveAnimation = this.showAnimationNewItem && this.showAnimationNewItem > 0
    this.showAnimationNewItem -= 1
    return (
      <CategoryItem
        animationDeplay={100 + (10 - this.showAnimationNewItem) * 180}
        shouldHaveAnimation={shouldHaveAnimation}
        style={themedStyle.item}
        onPress={this.handleReading}
        image={images[item.image]}
        item={item}
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
      <View style={themedStyle.listHistory}>
        {this.renderContent()}
      </View>
    )
  }
}

export default withStyles(CategoriesComponent, (theme) => ({
  container: {
    flex: 1
  },
  scroll: {
    paddingBottom: 10
  },
  listHistory: {
    flex: 1
  },
  contentContainer: {
    paddingBottom: 10
  }
}))
