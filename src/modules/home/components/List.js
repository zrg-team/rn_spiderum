import React, { Component } from 'react'
import {
  View
} from 'react-native'
import { List, withStyles } from 'react-native-ui-kitten'
import { DefaultSkeleton } from '../../../libraries/components/Skeleton'
import { navigationPush, pages } from '../../../common/utils/navigation'
import NewsItem from './NewsItem'

class ListComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      page: 1,
      loading: true,
      refreshing: false
    }

    this.loadingMore = false

    this.renderItem = this.renderItem.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleReading = this.handleReading.bind(this)
    this.handleLoadMore = this.handleLoadMore.bind(this)
    this.handleAuthoring = this.handleAuthoring.bind(this)
  }

  handleReading (article, itemIndex) {
    const { navigation, type } = this.props
    navigationPush(navigation, pages().Reading, { article, itemIndex, type })
  }

  handleAuthoring (article, itemIndex) {
    const { navigation } = this.props
    navigationPush(navigation, pages().Profile, { profileId: article.creator_id.name })
  }

  componentDidMount () {
    const { data, lazy } = this.props
    if (data && data.length && !lazy) {
      setTimeout(() => {
        this.setState({
          loading: false
        }, () => {
          this.getData(1)
        })
      }, 200)
    } else {
      this.getData(1)
    }
  }

  handleLoadMore () {
    const { page, loading } = this.state
    if (!this.loadingMore && !loading) {
      this.loadingMore = true
      this.getData(page + 1, () => {
        this.loadingMore = false
      })
    }
  }

  async getData (nextpage, callback) {
    const { page } = this.state
    const { getNews, type, data, onLoadingDone } = this.props
    const result = await getNews(nextpage || page, type)
    if (result || data.length) {
      this.showAnimationNewItem = 10
      return this.setState({
        page: nextpage || page,
        loading: false
      }, () => {
        callback && callback(nextpage || page)
        onLoadingDone && onLoadingDone()
      })
    }
  }

  keyExtractor (item = {}, index) {
    return `${item._id}_${index}`
  }

  renderItem ({ item, index }) {
    const { themedStyle } = this.props
    const shouldHaveAnimation = this.showAnimationNewItem && this.showAnimationNewItem > 0
    this.showAnimationNewItem -= 1
    return (
      <NewsItem
        key={item._id}
        itemIndex={index}
        animationDeplay={(10 - this.showAnimationNewItem) * 240}
        shouldHaveAnimation={shouldHaveAnimation}
        style={themedStyle.item}
        onPress={this.handleReading}
        onPressAuthoring={this.handleAuthoring}
        article={item}
      />
    )
  }

  handleRefresh () {
    const { refreshing } = this.state
    if (refreshing) {
      return
    }
    this.setState(
      {
        refreshing: true
      },
      async () => {
        await this.getData(1)
        this.setState({
          refreshing: false
        })
        this.timeoutInstance = null
      }
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
    const { loading } = this.state
    return (
      <View
        style={themedStyle.container}
      >
        <View style={themedStyle.listHistory}>
          {!loading
            ? this.renderContent()
            : (
              <View style={themedStyle.loadingContainer}>
                <DefaultSkeleton />
                <DefaultSkeleton />
                <DefaultSkeleton />
                <DefaultSkeleton />
                <DefaultSkeleton />
                <DefaultSkeleton />
                <DefaultSkeleton />
                <DefaultSkeleton />
                <DefaultSkeleton />
                <DefaultSkeleton />
              </View>
            )}
        </View>
      </View>
    )
  }
}

export default withStyles(ListComponent, (theme) => ({
  container: {
    flex: 1
  },
  scroll: {
    paddingBotton: 20,
    backgroundColor: theme['background-basic-color-1']
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
  },
  contentContainer: {
    backgroundColor: theme['background-basic-color-1']
  },
  loadingContainer: {
    paddingHorizontal: 20,
    backgroundColor: theme['background-basic-color-1']
  }
}))
