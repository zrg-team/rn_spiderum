import React from 'react'
import i18n from 'i18n-js'
import moment from 'moment'
import {
  TouchableOpacity,
  ScrollView,
  View
} from 'react-native'
import {
  Text,
  withStyles
} from 'react-native-ui-kitten'
import { SharedElement } from 'react-navigation-shared-element'
// import { Transition } from 'react-navigation-fluid-transitions'
import * as Animatable from 'react-native-animatable'
import FastImage from 'react-native-fast-image'
import { ArticleActivityBar } from './item/ArticleActivityBar'
import { ActivityAuthoring } from './item/ActivityAuthoring'
import commonStyles, { textStyle } from '../../../styles/common'
import { images } from '../../../assets/elements'

class NewsItemComponent extends React.Component {
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
      wrapperProps = { delay: animationDeplay, duration: 360, useNativeDriver: true, animation: 'zoomInUp', easing: 'ease-in-out-sine' }
    }
    return (
      <Wrapper {...wrapperProps}>
        <TouchableOpacity
          activeOpacity={0.95}
          {...restProps}
          style={[themedStyle.container, commonStyles.shadow, style]}
          onPress={this.handlePress}
        >
          <SharedElement id={article.og_image_url}>
            <FastImage
              style={themedStyle.image}
              resizeMode={FastImage.resizeMode.cover}
              source={article.og_image_url ? { uri: article.og_image_url } : images.default_image}
            />
          </SharedElement>
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
            >
              {article.decription}
            </Text>
            <ScrollView
              style={themedStyle.tagContainer}
              contentContainerStyle={themedStyle.tagScroll}
            >
              {article.tags.map(item => {
                if (!item.name) {
                  return null
                }
                return (
                  <View
                    style={[themedStyle.badgeContainer, themedStyle.badge, commonStyles.shadow]}
                    key={item._id}
                  >
                    <Text style={themedStyle.textBadge}>{item.name}</Text>
                  </View>
                )
              })}
            </ScrollView>
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
              date={`${moment(article.created_at).fromNow()} . ${readingTime} ${i18n.t('common.reading_mins')}`}
            />
          </ArticleActivityBar>
        </TouchableOpacity>
      </Wrapper>
    )
  }
}

export default withStyles(NewsItemComponent, (theme) => ({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme['border-basic-color-3'],
    marginTop: 8,
    marginHorizontal: 8
  },
  badgeContainer: {
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 2,
    justifyContent: 'center'
  },
  badge: {
    backgroundColor: theme['color-info-default']
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: theme['border-basic-color-4']
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
    height: 140
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
