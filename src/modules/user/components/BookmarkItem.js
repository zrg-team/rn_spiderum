import React from 'react'
import moment from 'moment'
import {
  TouchableOpacity,
  View
} from 'react-native'
import {
  Text,
  withStyles
} from 'react-native-ui-kitten'
import { Transition } from 'react-navigation-fluid-transitions'
import * as Animatable from 'react-native-animatable'
import FastImage from 'react-native-fast-image'
import { ArticleActivityBar } from '../../home/components/item/ArticleActivityBar'
import { ActivityAuthoring } from '../../home/components/item/ActivityAuthoring'
import commonStyles, { textStyle } from '../../../styles/common'
import { images } from '../../../assets/elements'

class BookmarkItemComponent extends React.Component {
  constructor (props) {
    super(props)

    this.handlePress = this.handlePress.bind(this)
    this.handleCommentsButtonPress = this.handleCommentsButtonPress.bind(this)
    this.handleLikeButtonPress = this.handleLikeButtonPress.bind(this)
    this.handlePressAuthoring = this.handlePressAuthoring.bind(this)
  }

  shouldComponentUpdate () {
    return false
  }

  handlePress () {
    const { article, onPress, itemIndex } = this.props
    onPress(article, itemIndex)
  }

  handlePressAuthoring () {
    const { article, onPressAuthoring, itemIndex } = this.props
    onPressAuthoring(article, itemIndex)
  }

  handleCommentsButtonPress () {
  }

  handleLikeButtonPress () {
  }

  render () {
    const {
      style,
      themedStyle,
      article,
      shouldHaveAnimation,
      animationDeplay,
      ...restProps
    } = this.props
    const readingTime = moment.duration(article.reading_time, 'seconds').minutes()
    let Wrapper = View
    let wrapperProps = {}
    if (shouldHaveAnimation) {
      Wrapper = Animatable.View
      wrapperProps = { delay: animationDeplay, duration: 360, useNativeDriver: true, animation: 'fadeInRight', easing: 'ease-in-out-sine' }
    }
    return (
      <Wrapper {...wrapperProps}>
        <TouchableOpacity
          activeOpacity={0.95}
          {...restProps}
          style={[themedStyle.container, commonStyles.shadow, style]}
          onPress={this.handlePress}
        >
          <View style={[themedStyle.innerContainer]}>
            <Transition shared={article.og_image_url}>
              <FastImage
                style={themedStyle.image}
                resizeMode={FastImage.resizeMode.cover}
                source={article.og_image_url ? { uri: article.og_image_url } : images.default_image}
              />
            </Transition>
            <View style={themedStyle.infoContainer}>
              <Text
                numberOfLines={2}
                style={themedStyle.titleLabel}
                category='h6'
              >
                {article.title}
              </Text>
              <Text
                numberOfLines={2}
                style={themedStyle.descriptionLabel}
                category='h8'
              >
                {article.decription}
              </Text>
            </View>
          </View>
          <ArticleActivityBar
            style={themedStyle.activityContainer}
            comments={article.comment_count}
            views={article.views_count}
            onCommentPress={this.handleCommentsButtonPress}
            onLikePress={this.handleLikeButtonPress}
          >
            <ActivityAuthoring
              article={article}
              onPress={this.handlePressAuthoring}
              photo={article.avatar ? { uri: article.avatar } : images.default_user}
              name={article.creator_id.display_name}
              date={`${moment(article.created_at).fromNow()} . ${readingTime} phút đọc`}
            />
          </ArticleActivityBar>
        </TouchableOpacity>
      </Wrapper>
    )
  }
}

export default withStyles(BookmarkItemComponent, (theme) => ({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme['background-basic-color-3'],
    marginTop: 5,
    marginHorizontal: 5,
    marginBottom: 5
  },
  innerContainer: {
    flexDirection: 'row'
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: theme['border-basic-color-2']
  },
  tagContainer: {
    width: '100%',
    paddingVertical: 5
  },
  tagScroll: {
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  activityContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  image: {
    height: 120,
    width: 120
  },
  titleLabel: {
    ...textStyle.headline,
    fontWeight: 'bold'
  },
  descriptionLabel: {
    ...textStyle.subtitle,
    color: 'gray',
    marginTop: 5
  },
  textBadge: {
    paddingHorizontal: 10,
    color: '#FFFFFF'
  }
}))
