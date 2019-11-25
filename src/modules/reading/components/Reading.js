import React from 'react'
import i18n from 'i18n-js'
import moment from 'moment'
import {
  View,
  Dimensions,
  ScrollView
} from 'react-native'
import {
  Text,
  Avatar,
  Button,
  withStyles
} from 'react-native-ui-kitten'
import Share from 'react-native-share'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import YouTube from 'react-native-youtube'
import WebView from 'react-native-webview'
import FastImage from 'react-native-fast-image'
import { Transition } from 'react-navigation-fluid-transitions'
import { CommentList } from './comments/CommentList'
import { READING_URL } from '../models'
import Toast from '../../../common/components/Widgets/Toast'
import { ActivityAuthoring } from '../../home/components/item/ActivityAuthoring'
import { ArticleActivityBar } from '../../home/components/item/ArticleActivityBar'
import commonStyles, { textStyle } from '../../../styles/common'
import { images } from '../../../assets/elements'
import { ContentSkeleton } from '../../../libraries/components/Skeleton'
import { navigationPop } from '../../../common/utils/navigation'
import ParallaxScrollView from '../../../libraries/components/Parallax/ParallaxScrollView'

const { width, height } = Dimensions.get('window')

class ReadingComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      data: [],
      webview: false,
      commentPage: 1,
      loadingComment: true,
      comments: []
    }
    this.handlePress = this.handlePress.bind(this)
    this.handleCommentsButtonPress = this.handleCommentsButtonPress.bind(this)
    this.handleLikeButtonPress = this.handleLikeButtonPress.bind(this)
    this.handleLoadMoreComments = this.handleLoadMoreComments.bind(this)
    this.handleIncreaseFont = this.handleIncreaseFont.bind(this)
    this.handleReduceFont = this.handleReduceFont.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleShare = this.handleShare.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  handleRemove () {
    const { article, removeNews, navigation } = this.props
    removeNews(article)
    Toast.show(i18n.t('messages.removed_news'))
    navigationPop(navigation)
  }

  handleSave () {
    const { article, saveNews } = this.props
    const { data } = this.state
    const news = { ...article }
    const images = []
    data.forEach(async (item, index) => {
      switch (item.type) {
        case 'image':
          images.push({
            uri: item.data
          })
          break
      }
    })
    try {
      FastImage.preload(images.filter(item => item.uri))
    } catch (err) {
    }
    news.data = data
    saveNews(news)
    Toast.show(i18n.t('messages.saved_news'))
  }

  handleShare () {
    const { article } = this.props
    Share.open({
      title: article.title,
      message: article.title,
      url: `${READING_URL}${article.slug}`
    })
      .then((res) => { console.log(res) })
      .catch((err) => { err && console.log(err) })
  }

  handleIncreaseFont () {
    const { setFontSize, fontSize } = this.props
    setFontSize(fontSize + 1)
  }

  handleReduceFont () {
    const { setFontSize, fontSize } = this.props
    setFontSize(fontSize - 1)
  }

  handlePress () {
  }

  handleCommentsButtonPress () {
  }

  handleLikeButtonPress () {
  }

  handleLoadMoreComments () {
    const { commentPage } = this.state
    this.setState({
      loadingComment: true
    }, () => {
      this.getComments(commentPage + 1)
    })
  }

  componentDidMount () {
    const { article, parseContent } = this.props
    const data = parseContent(article.body)
    setTimeout(() => {
      const { noComment } = this.props
      this.setState({
        data,
        loadingComment: true,
        webview: false,
        loading: false
      }, async () => {
        !noComment && this.getComments()
      })
    }, 300)
  }

  componentWillReceiveProps (nextProps, nextState) {
    const { noComment, fontSize } = this.props
    if (
      noComment !== nextProps.noComment &&
      !nextProps.noComment &&
      (!nextState.comments || !nextState.comments.length)
    ) {
      this.getComments()
    }
    if (fontSize !== nextProps.fontSize) {
      console.log('nextProps.fontSize', nextProps.fontSize)
    }
  }

  async getComments (page) {
    const { article, getComments } = this.props
    const { commentPage } = this.state
    const next = page || commentPage
    const comments = await getComments(article._id, next)
    if (comments) {
      this.setState({
        loadingComment: false,
        commentPage: next,
        comments: next === 1 ? comments : [...this.state.comments, ...comments]
      })
    }
  }

  renderTextStyle (item) {
    const { fontSize } = this.props
    const style = {
      fontSize
    }
    if (item.h1) {
      style.fontSize = fontSize * 1.73
    } else if (item.h2) {
      style.fontSize = fontSize * 1.58
    } else if (item.h3) {
      style.fontSize = fontSize * 1.44
    } else if (item.h4) {
      style.fontSize = fontSize * 1.3
    } else if (item.h5) {
      style.fontSize = fontSize * 1.15
    }

    if (item.strong) {
      style.fontWeight = 'bold'
    }

    return style
  }

  renderContent () {
    const { data } = this.state
    const { article, themedStyle } = this.props

    const renders = [
      (
        <Text
          key='title'
          style={themedStyle.titleLabel}
          category='h5'
        >
          {article.title}
        </Text>
      )
    ]
    data.forEach((item, index) => {
      let result = null
      switch (item.type) {
        case 'text':
          result = (
            <Text
              key={index}
              style={[themedStyle.contentLabel, this.renderTextStyle(item)]}
            >
              {item.data}
            </Text>
          )
          break
        case 'youtube':
          result = (
            <YouTube
              key={index}
              apiKey='AIzaSyDMK1RbmZhPs3sNfNXTXy3_gvzJaW6Xa64'
              videoId={item.data} // The YouTube video ID
              style={{ alignSelf: 'stretch', height: 300, marginTop: 20 }}
            />
          )
          break
        case 'youtube_web':
          result = (
            <WebView
              source={{ uri: `https://${item.fullUrl}` }}
              style={{ alignSelf: 'stretch', height: 300, width: '100%', marginTop: 20 }}
            />
          )
          break
        case 'image':
          result = [
            <FastImage
              key={`${index}_1`}
              style={themedStyle.imageContent}
              resizeMode={FastImage.resizeMode.contain}
              source={{ uri: item.data }}
            />,
            <Text
              key={`${index}_2`}
              style={themedStyle.imageCaption}
            >
              {item.title}
            </Text>
          ]
          break
      }
      renders.push(result)
    })
    return renders
  }

  renderActions () {
    const { type } = this.props

    return (
      <ActionButton fixNativeFeedbackRadius key='1' buttonColor='rgba(231,76,60,1)'>
        {type === 'bookmark'
          ? (
            <ActionButton.Item key='1' buttonColor='#9b59b6' title={i18n.t('reading.close')} onPress={this.handleRemove}>
              <Icon name='close' style={{ fontSize: 20, height: 22, color: '#FFFFFF' }} />
            </ActionButton.Item>
          ) : (
            <ActionButton.Item key='1' buttonColor='#9b59b6' title={i18n.t('reading.save_news')} onPress={this.handleSave}>
              <Icon name='cloud-download' style={{ fontSize: 20, height: 22, color: '#FFFFFF' }} />
            </ActionButton.Item>
          )}
        <ActionButton.Item key='2' buttonColor='#3498db' title={i18n.t('reading.share')} onPress={this.handleShare}>
          <Icon name='share' style={{ fontSize: 20, height: 22, color: '#FFFFFF' }} />
        </ActionButton.Item>
        <ActionButton.Item key='3' buttonColor='#1abc9c' title={i18n.t('reading.font_size')} onPress={this.handleIncreaseFont}>
          <Icon name='magnifier-add' style={{ fontSize: 20, height: 22, color: '#FFFFFF' }} />
        </ActionButton.Item>
        <ActionButton.Item key='4' buttonColor='#1abc9c' title={i18n.t('reading.font_size')} onPress={this.handleReduceFont}>
          <Icon name='magnifier-remove' style={{ fontSize: 20, height: 22, color: '#FFFFFF' }} />
        </ActionButton.Item>
      </ActionButton>
    )
  }

  render () {
    const {
      noTransition,
      themedStyle,
      article = {}
    } = this.props
    const { loadingComment, comments, loading } = this.state
    const imageSource = article.og_image_url ? { uri: article.og_image_url } : images.default_image
    const readingTime = moment.duration(article.reading_time, 'seconds').minutes()

    return [
      <ParallaxScrollView
        key='0'
        noTransition={noTransition}
        windowHeight={height * 0.4}
        backgroundSource={imageSource}
        style={themedStyle.container}
        imageUrl={article.og_image_url}
        userImage={article.avatar}
        scrollableViewStyle={themedStyle.content}
        headerView={() => {
          let UserAvatarComponent = null
          if (noTransition) {
            UserAvatarComponent = (
              <Avatar
                style={themedStyle.authorPhoto}
                size='large'
                source={article.avatar ? { uri: article.avatar } : images.default_user}
              />
            )
          } else {
            UserAvatarComponent = (
              <Transition shared={`${article._id}_${article.avatar}_avatar`}>
                <Avatar
                  style={themedStyle.authorPhoto}
                  size='large'
                  source={article.avatar ? { uri: article.avatar } : images.default_user}
                />
              </Transition>
            )
          }
          return [
            <ScrollView horizontal key='info' style={themedStyle.tagContainer}>
              {article.tags && article.tags.map(item => {
                return (
                  <View
                    style={[themedStyle.badgeContainer, themedStyle.badge, commonStyles.shadow]}
                    key={item._id}
                  >
                    <Text style={themedStyle.textBadge}>{item.name}</Text>
                  </View>
                )
              })}
            </ScrollView>,
            <View key='avatar' style={[themedStyle.authorPhotoContainer]}>
              {UserAvatarComponent}
            </View>
          ]
        }}
      >
        <ActivityAuthoring
          noTransition
          article={article}
          style={[themedStyle.authorBar]}
          name={article.creator_id.display_name}
          date={`${moment(article.created_at).fromNow()} . ${readingTime} phút đọc`}
        />
        {
          loading
            ? <ContentSkeleton />
            : this.renderContent()
        }
        <ArticleActivityBar
          style={themedStyle.detailsContainer}
          comments={article.comment_count}
          views={article.views_count}
        >
          <View style={themedStyle.dateContainer}>
            <Text
              style={themedStyle.dateLabel}
              appearance='hint'
              category='p2'
            >
              {article.date}
            </Text>
          </View>
        </ArticleActivityBar>
        <CommentList article={article} data={comments} />
        <Button
          disabled={loadingComment}
          onPress={this.handleLoadMoreComments}
          style={themedStyle.button}
          appearance='ghost'
          status='info'
        >
          {i18n.t('reading.loading_more_comments')}
        </Button>
      </ParallaxScrollView>,
      this.renderActions()
    ]
  }
}

export default withStyles(ReadingComponent, (theme) => ({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: theme['background-basic-color-1']
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
  content: {
    paddingTop: 60
  },
  detailsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: theme['border-basic-color-2']
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    height: 175
  },
  authorPhoto: {
    width: 100,
    height: 100,
    zIndex: 999
  },
  authorPhotoContainer: {
    position: 'absolute',
    left: 24,
    bottom: -50,
    margin: 0,
    width: 100,
    height: 100,
    zIndex: 999,
    borderWidth: 2,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderColor: theme['border-basic-color-2']
  },
  authorBar: {
    width: width - 74,
    left: 80,
    zIndex: 999,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 10
  },
  titleLabel: {
    marginHorizontal: 24,
    // marginLeft: 140,
    ...textStyle.headline
  },
  contentLabel: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 10,
    ...textStyle.paragraph
  },
  imageCaption: {
    flex: 1,
    textAlign: 'center',
    ...textStyle.paragraph
  },
  dateLabel: {
    marginLeft: 8,
    ...textStyle.paragraph
  },
  dateIcon: {
    width: 24,
    height: 24,
    tintColor: theme['text-hint-color']
  },
  imageContent: {
    height: 200,
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor: '#000'
  },
  tagContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginLeft: 130,
    width: width - 140,
    height: 48,
    position: 'absolute',
    bottom: -12,
    left: 5
  },
  button: {
    marginTop: -5,
    paddingTop: 26,
    paddingBottom: 30,
    backgroundColor: theme['border-basic-color-3']
  },
  textBadge: {
    paddingHorizontal: 10,
    color: '#FFFFFF'
  }
}))
