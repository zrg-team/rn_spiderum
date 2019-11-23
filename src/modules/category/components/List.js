import React, { Component } from 'react'
import {
  View,
  PanResponder
  // Text,
  // Animated
} from 'react-native'
import i18n from 'i18n-js'
import { List, withStyles } from 'react-native-ui-kitten'
import * as Animatable from 'react-native-animatable'
import { DefaultSkeleton } from '../../../libraries/components/Skeleton'
import { textStyle } from '../../../styles/common'
import { navigationPush, screens } from '../../../common/utils/navigation'
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

    this.panResponder = PanResponder.create({
      // onStartShouldSetPanResponder: (evt, gestureState) => true,
      // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      // onMoveShouldSetPanResponder: (evt, gestureState) => true,
      // onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      // onPanResponderGrant: props.onResponderTerminationRequest,
      // onPanResponderTerminationRequest: (evt, gestureState) => true,
      // onPanResponderRelease: props.onResponderTerminationRequest,
      // onPanResponderTerminate: props.onResponderTerminationRequest
    })
  }

  handleReading (article, itemIndex) {
    const { navigation, type } = this.props
    navigationPush(navigation, screens().Reading, { article, itemIndex, type, category: true })
  }

  handleAuthoring (article, itemIndex) {
    const { navigation } = this.props
    navigationPush(navigation, screens().Profile, { profileId: article.creator_id.name })
  }

  componentDidMount () {
    this.getData(1)
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
    const { getNews, type, data, item } = this.props
    const result = await getNews(nextpage || page, type, item.url)
    if (result || data.length) {
      this.showAnimationNewItem = 10
      return this.setState({
        page: nextpage || page,
        loading: false
      }, () => {
        callback && callback(nextpage || page)
      })
    }
  }

  keyExtractor (item = {}, index) {
    return `${item._id}_${index}`
  }

  renderItem ({ item, index }) {
    const { themedStyle } = this.props
    const isReverse = index % 2 === 1
    const style = isReverse ? themedStyle.itemReverse : themedStyle.item
    return (
      <NewsItem
        style={style}
        itemIndex={index}
        onPressItem={this.handleReading}
        article={item}
        onPressAuthoring={this.handleAuthoring}
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

  renderTitle () {
    const { type } = this.props

    switch (type) {
      case 'hot':
        return i18n.t('category.hot_topic')
      case 'news':
        return i18n.t('category.newest_post')
      case 'top':
        return i18n.t('category.most_popular')
    }
  }

  renderContent () {
    const { data = [], themedStyle, onScroll, onResponderTerminationRequest } = this.props
    const { refreshing } = this.state
    return (
      <List
        {...this.panResponder.panHandlers}
        scrollEventThrottle={16}
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
        onScroll={onScroll}
        onResponderTerminationRequest={onResponderTerminationRequest}
      />
    )
  }

  render () {
    const { themedStyle, style } = this.props
    const { loading } = this.state
    return (
      <Animatable.View
        delay={100}
        useNativeDriver
        animation='slideInUp'
        style={themedStyle.container}
      >
        <View style={[themedStyle.listHistory, style]}>
          {/* <Text
            style={themedStyle.pagerLabel}
            appearance='hint'
          >
            {this.renderTitle()}
          </Text> */}
          {!loading
            ? this.renderContent()
            : (
              <View style={{ paddingHorizontal: 20, backgroundColor: '#FFFFFF' }}>
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
      </Animatable.View>
    )
  }
}

export default withStyles(ListComponent, (theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  contentContainer: {
    width: '100%'
  },
  listHistory: {
    flex: 1,
    height: '100%'
  },
  item: {
    backgroundColor: '#FFFFFF'
  },
  itemReverse: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row-reverse'
  },
  pagerLabel: {
    marginVertical: 16,
    marginHorizontal: 10,
    ...textStyle.paragraph
  }
}))
