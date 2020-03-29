import React from 'react'
import i18n from 'i18n-js'
import moment from 'moment'
import {
  View,
  Linking,
  Dimensions,
  ScrollView,
  StatusBar
} from 'react-native'
import {
  Text,
  Avatar,
  withStyles
} from 'react-native-ui-kitten'
import WebView from 'react-native-webview'
import Share from 'react-native-share'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import FastImage from 'react-native-fast-image'
import { Transition } from 'react-navigation-fluid-transitions'
import DefaultHeader from '../../../common/containers/DefaultHeader'
import { CommentList } from './comments/CommentList'
import { READING_URL } from '../models'
import Toast from '../../../common/components/Widgets/Toast'
import { ActivityAuthoring } from '../../home/components/item/ActivityAuthoring'
import { ArticleActivityBar } from '../../home/components/item/ArticleActivityBar'
import commonStyles, { textStyle, DEFAULT_HEADER_HEIGHT } from '../../../styles/common'
import { images as commonImages } from '../../../assets/elements'
import { navigationPop } from '../../../common/utils/navigation'
import HtmlContent from './reading/HtmlContent'
import ParallaxScrollView from '../../../libraries/components/Parallax/ParallaxScrollView'

const { width, height } = Dimensions.get('window')

class ReadingBetaComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      data: [],
      webview: false,
      images: {}
    }
    this.handlePress = this.handlePress.bind(this)
    this.renderView = this.renderView.bind(this)
    this.handleLikeButtonPress = this.handleLikeButtonPress.bind(this)
    this.handleIncreaseFont = this.handleIncreaseFont.bind(this)
    this.handleReduceFont = this.handleReduceFont.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleShare = this.handleShare.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleOpenSource = this.handleOpenSource.bind(this)
    this.renderNavBarView = this.renderNavBarView.bind(this)
    this.handleGoBack = this.handleGoBack.bind(this)
  }

  handleGoBack () {
    const { navigation } = this.props

    navigationPop(navigation)
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
    const { images } = this.state
    // const { imagesSize, images } = this.state
    const news = { ...article }
    try {
      FastImage.preload(images.map(item => ({ uri: item.data })))
    } catch (err) {
    }
    // news.imagesSize = imagesSize
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
      .then((res) => { console.info(res) })
      .catch((err) => { err && console.debug(err) })
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

  handleLikeButtonPress () {
  }

  async componentDidMount () {
    const { article, getContent } = this.props
    let result = await getContent(article)
    result = result || {}
    const newState = {
      images: result.images,
      data: result.body,
      webview: false,
      loading: false
    }
    setTimeout(() => {
      this.setState(newState)
    }, 200)
  }

  renderActions () {
    const { type, themedStyle } = this.props

    return (
      <ActionButton fixNativeFeedbackRadius key='1' buttonColor='rgba(231,76,60,1)'>
        <ActionButton.Item key='2' buttonColor='#3498db' title={i18n.t('reading.open_source')} onPress={this.handleOpenSource}>
          <Icon name='globe' style={themedStyle.actionIcon} />
        </ActionButton.Item>
        {type === 'bookmark'
          ? (
            <ActionButton.Item key='1' buttonColor='#9b59b6' title={i18n.t('reading.remove')} onPress={this.handleRemove}>
              <Icon name='close' style={themedStyle.actionIcon} />
            </ActionButton.Item>
          ) : (
            <ActionButton.Item key='1' buttonColor='#9b59b6' title={i18n.t('reading.save_news')} onPress={this.handleSave}>
              <Icon name='cloud-download' style={themedStyle.actionIcon} />
            </ActionButton.Item>
          )}
        <ActionButton.Item key='2' buttonColor='#3498db' title={i18n.t('reading.share')} onPress={this.handleShare}>
          <Icon name='share' style={themedStyle.actionIcon} />
        </ActionButton.Item>
        <ActionButton.Item key='3' buttonColor='#1abc9c' title={i18n.t('reading.font_size')} onPress={this.handleIncreaseFont}>
          <Icon name='magnifier-add' style={themedStyle.actionIcon} />
        </ActionButton.Item>
        <ActionButton.Item key='4' buttonColor='#1abc9c' title={i18n.t('reading.font_size')} onPress={this.handleReduceFont}>
          <Icon name='magnifier-remove' style={themedStyle.actionIcon} />
        </ActionButton.Item>
        <ActionButton.Item key='5' buttonColor='#9b59b6' title={i18n.t('common.back')} onPress={this.handleGoBack}>
          <Icon name='action-undo' style={themedStyle.actionIcon} />
        </ActionButton.Item>
      </ActionButton>
    )
  }

  renderView () {
    const {
      themedStyle,
      noTransition,
      article = {}
    } = this.props
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
  }

  renderNavBarView () {
    const { navigation } = this.props
    return (
      <DefaultHeader
        transition={false}
        title={i18n.t('pages.reading').toUpperCase()}
        navigation={navigation}
        headerWrapperContainer={{
          height: DEFAULT_HEADER_HEIGHT + StatusBar.currentHeight
        }}
        headerContainer={{
          backgroundColor: 'transparent',
          width: '100%',
          marginTop: StatusBar.currentHeight
        }}
      />
    )
  }

  getThemeColor () {
    const { theme } = this.props

    const baseColor = theme['background-basic-color-4'].replace('$', '')
    return baseColor
  }

  render () {
    const {
      noTransition,
      themedStyle,
      article = {},
      fontSize,
      noComment,
      getComments
    } = this.props
    const { data, loading, images } = this.state
    const imageSource = article.og_image_url
      ? { uri: article.og_image_url }
      : images && images[0] && images[0].data
        ? { uri: images[0].data }
        : commonImages.default_parallax
    const readingTime = moment.duration(article.reading_time, 'seconds').minutes()

    if (!loading && !data) {
      return (
        <WebView
          source={{ uri: article.key }}
          style={{ alignSelf: 'stretch', height, width }}
        />
      )
    }
    if (!loading && images && images.length > 26) {
      return (
        <View
          style={themedStyle.wrapperContentLite}
        >
          <ScrollView
            key='content'
            style={themedStyle.contentLite}
          >
            <Text
              key='title'
              style={themedStyle.titleLabel}
              category='h5'
            >
              {article.title}
            </Text>
            <HtmlContent
              data={data}
              loading={loading}
              fontSize={fontSize}
            />
            <CommentList article={article} noComment={noComment} getComments={getComments} />
          </ScrollView>
          {this.renderActions()}
        </View>
      )
    }
    return [
      <ParallaxScrollView
        key='0'
        noTransition={noTransition}
        windowHeight={height * 0.35}
        backgroundSource={imageSource}
        style={themedStyle.container}
        userImage={article.avatar}
        scrollableViewStyle={themedStyle.content}
        headerView={this.renderView}
        navBarView={this.renderNavBarView}
        navBarHeight={DEFAULT_HEADER_HEIGHT + StatusBar.currentHeight}
        navBarColor={this.getThemeColor()}
      >
        {article.creator_id
          ? (
            <ActivityAuthoring
              noTransition
              article={article}
              style={[themedStyle.authorBar]}
              name={`${article.creator_id.display_name}`.trim()}
              date={`${moment(article.created_at).fromNow()} . ${readingTime} phút đọc`}
            />
          ) : null}
        <Text
          key='title'
          style={themedStyle.titleLabel}
          category='h5'
        >
          {article.title}
        </Text>
        <HtmlContent
          data={data}
          loading={loading}
          fontSize={fontSize}
        />
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
        <CommentList article={article} noComment={noComment} getComments={getComments} />
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
  content: {
    paddingTop: 60,
    backgroundColor: theme['background-basic-color-2']
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
  readMoreText: {
    textAlign: 'center',
    color: theme['color-primary-500'],
    textDecorationLine: 'underline',
    paddingVertical: 10
  },
  wrapperContentLite: {
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1
  },
  contentLite: {
    width: '100%',
    height: '100%',
    display: 'flex'
  },
  actionIcon: { fontSize: 20, height: 22, color: '#FFFFFF' }
}))
