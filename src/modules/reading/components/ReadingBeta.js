import React from 'react'
import i18n from 'i18n-js'
import moment from 'moment'
import {
  View,
  Image,
  Linking,
  Dimensions,
  ScrollView
} from 'react-native'
import {
  Text,
  Avatar,
  Button,
  withStyles
} from 'react-native-ui-kitten'
import WebView from 'react-native-webview'
import Share from 'react-native-share'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import FastImage from 'react-native-fast-image'
import { Transition } from 'react-navigation-fluid-transitions'
import { CommentList } from './comments/CommentList'
import { READING_URL } from '../models'
import ImageResize from '../../../common/components/Layout/ImageResize'
import Toast from '../../../common/components/Widgets/Toast'
import { ActivityAuthoring } from '../../home/components/item/ActivityAuthoring'
import { ArticleActivityBar } from '../../home/components/item/ArticleActivityBar'
import commonStyles, { textStyle } from '../../../styles/common'
import { images as commonImages } from '../../../assets/elements'
import { ContentSkeleton } from '../../../libraries/components/Skeleton'
import { navigationPop } from '../../../common/utils/navigation'
import ParallaxScrollView from '../../../libraries/components/Parallax/ParallaxScrollView'
import Html from 'react-native-render-html'

const { width, height } = Dimensions.get('window')

class ReadingBetaComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      data: [],
      webview: false,
      commentPage: 1,
      loadingComment: true,
      comments: [],
      images: {}
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
    this.handlePressLink = this.handlePressLink.bind(this)
    this.handleOpenSource = this.handleOpenSource.bind(this)
    this.handleImageLoaded = this.handleImageLoaded.bind(this)

    this.createTagStyles()

    this.renderers = {
      blockquote: (item, children, css, passProps) => {
        const { themedStyle } = passProps
        return (
          <>
            <View
              style={themedStyle.blockquoteStart}
            />
            {children}
            <View
              style={themedStyle.blockquoteEnd}
            />
          </>
        )
      },
      img: (item, children, css, passProps) => {
        const { themedStyle, imagesSize = {} } = passProps
        return (
          <ImageResize
            key={item.src}
            uri={item.src}
            style={themedStyle.imageContent}
            imagesSize={imagesSize[item.src]}
            onImageLoaded={this.handleImageLoaded}
          />
        )
      },
      iframe: (item, children) => {
        const ratio = item.width / item.height
        return (
          <WebView
            key={`yotube_${item.src}`}
            source={{ uri: `https://${item.src}` }}
            style={{ alignSelf: 'stretch', height: width / ratio, width }}
          />
        )
      }
    }
  }

  handleImageLoaded (url, result) {
    const { imagesSize = {} } = this.state
    imagesSize[url] = result
    this.setState({
      imagesSize
    })
  }

  createTagStyles (nextProps) {
    const { fontSize, themedStyle } = nextProps || this.props
    if (nextProps && nextProps.fontSize === this.props.fontSize) {
      return
    }
    this.tagsStyles = {
      div: { paddingVertical: 5, fontSize: fontSize, ...themedStyle.textColor },
      a: { paddingVertical: 5, fontSize: fontSize, ...themedStyle.textColor },
      p: { paddingVertical: 5, fontSize: fontSize, ...themedStyle.textColor },
      h1: { paddingVertical: 5, fontSize: fontSize * 1.73, ...themedStyle.textColor },
      h2: { paddingVertical: 5, fontSize: fontSize * 1.58, ...themedStyle.textColor },
      h3: { paddingVertical: 5, fontSize: fontSize * 1.44, ...themedStyle.textColor },
      h4: { paddingVertical: 5, fontSize: fontSize * 1.3, ...themedStyle.textColor },
      h5: { paddingVertical: 5, fontSize: fontSize * 1.15, ...themedStyle.textColor },
      pre: { paddingVertical: 5, fontSize: fontSize, ...themedStyle.textColor }
    }

    this.setState({
      loading: true
    }, () => {
      setTimeout(() => {
        this.setState({
          loading: false
        })
      }, 100)
    })
  }

  handlePressLink (e, href) {
    Linking
      .openURL(href)
      .catch(() => {})
  }

  handleOpenSource () {
    const { article } = this.props

    Linking
      .openURL(article.key)
      .catch(() => {})
  }

  handleRemove () {
    const { article, removeNews, navigation } = this.props
    removeNews(article)
    Toast.show(i18n.t('messages.removed_news'))
    navigationPop(navigation)
  }

  handleSave () {
    const { article, saveNews } = this.props
    const { imagesSize, images } = this.state
    const news = { ...article }
    try {
      FastImage.preload(images.map(item => ({ uri: item.data })))
    } catch (err) {
    }
    news.imagesSize = imagesSize
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

  async handleImageSize (data) {
    const { images: lastImages } = this.state
    let images = await Promise.all(
      data
        .map(item => {
          return new Promise((resolve, reject) => {
            if (lastImages[item.data]) {
              resolve(undefined)
            }
            Image.getSize(item.data, (itemWidth, itemHeight) => {
              const result = {}
              const ratio = itemWidth / itemHeight
              result.width = (width - 20)
              result.height = result.width / ratio
              resolve({ [item.data]: { ...result } })
            }, () => {
              resolve(undefined)
            })
          })
        })
    )
    images = images.reduce((all, item) => {
      return { ...all, ...item }
    }, {})
    this.setState({
      loading: false,
      imagesSize: images
    })
  }

  async componentDidMount () {
    const { article, getContent } = this.props
    let result = await getContent(article)
    result = result || {}
    const newState = {
      images: result.images,
      data: result.body,
      loadingComment: true,
      webview: false,
      loading: false
    }
    if (article.imagesSize) {
      newState.imagesSize = article.imagesSize
    }
    setTimeout(() => {
      const { noComment } = this.props
      this.setState(newState, async () => {
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
      this.createTagStyles(nextProps)
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

  renderActions () {
    const { type } = this.props

    return (
      <ActionButton fixNativeFeedbackRadius key='1' buttonColor='rgba(231,76,60,1)'>
        <ActionButton.Item key='2' buttonColor='#3498db' title={i18n.t('reading.open_source')} onPress={this.handleOpenSource}>
          <Icon name='globe' style={{ fontSize: 20, height: 22, color: '#FFFFFF' }} />
        </ActionButton.Item>
        {type === 'bookmark'
          ? (
            <ActionButton.Item key='1' buttonColor='#9b59b6' title={i18n.t('reading.remove')} onPress={this.handleRemove}>
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
    const { imagesSize, data, loadingComment, comments, loading } = this.state
    const imageSource = article.og_image_url ? { uri: article.og_image_url } : commonImages.default_image
    const readingTime = moment.duration(article.reading_time, 'seconds').minutes()
    if (!loading && !data) {
      return (
        <WebView
          source={{ uri: article.key }}
          style={{ alignSelf: 'stretch', height, width }}
        />
      )
    }
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
                source={article.avatar ? { uri: article.avatar } : commonImages.default_user}
              />
            )
          } else {
            UserAvatarComponent = (
              <Transition shared={`${article._id}_${article.avatar}_avatar`}>
                <Avatar
                  style={themedStyle.authorPhoto}
                  size='large'
                  source={article.avatar ? { uri: article.avatar } : commonImages.default_user}
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
        <Text
          key='title'
          style={themedStyle.titleLabel}
          category='h5'
        >
          {article.title}
        </Text>
        {
          loading
            ? <ContentSkeleton />
            : (
              <View style={themedStyle.htmlContainer}>
                <Html
                  tagsStyles={this.tagsStyles}
                  html={data}
                  onLinkPress={this.handlePressLink}
                  imagesMaxWidth={width - 20}
                  staticContentMaxWidth={width - 20}
                  renderers={this.renderers}
                  themedStyle={themedStyle}
                  imagesSize={imagesSize}
                />
              </View>
            )
        }
        <View style={themedStyle.endingBlock} />
        <Text style={themedStyle.readMoreText} category='h6'>{i18n.t('reading.swipe_to_read_more')}</Text>
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

export default withStyles(ReadingBetaComponent, (theme) => ({
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
  textColor: {
    color: theme['text-basic-color']
  },
  content: {
    paddingTop: 60,
    backgroundColor: theme['background-basic-color-2']
  },
  htmlContainer: {
    paddingHorizontal: 10
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
    backgroundColor: theme['background-basic-color-2'],
    borderColor: theme['border-basic-color-2']
  },
  authorBar: {
    width: width - 74,
    left: 80,
    zIndex: 999,
    backgroundColor: theme['background-basic-color-2'],
    position: 'absolute',
    top: 10
  },
  titleLabel: {
    marginHorizontal: 15,
    marginBottom: 10,
    // marginLeft: 140,
    ...textStyle.headline
  },
  contentLabel: {
    // flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 5
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
    marginVertical: 10,
    marginHorizontal: 0
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
  },
  linkContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 10,
    marginVerical: 10
  },
  contentLinkText: {
    marginHorizontal: 10,
    textDecorationLine: 'underline'
  },
  blockquoteStart: {
    backgroundColor: theme['color-primary-500'],
    height: 5
  },
  blockquoteEnd: {
    backgroundColor: theme['color-primary-500'],
    height: 5
  },
  endingBlock: {
    backgroundColor: theme['color-success-500'],
    height: 3
  },
  readMoreText: {
    textAlign: 'center',
    color: theme['color-primary-500'],
    textDecorationLine: 'underline',
    paddingVertical: 10
  }
}))
