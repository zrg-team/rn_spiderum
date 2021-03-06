import React from 'react'
import i18n from 'i18n-js'
import moment from 'moment'
import {
  View,
  Linking,
  Dimensions,
  ScrollView,
  StatusBar,
  Animated,
  Platform,
  TouchableOpacity
} from 'react-native'
import {
  Text,
  Icon,
  Avatar,
  withStyles
} from 'react-native-ui-kitten'
import Share from 'react-native-share'
import WebView from 'react-native-webview'
import FastImage from 'react-native-fast-image'
import ActionButton from 'react-native-action-button'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'
import { SharedElement } from 'react-navigation-shared-element'
// import { Transition } from 'react-navigation-fluid-transitions'
import { READING_URL } from '../models'
import HtmlContent from './reading/HtmlContent'
import { CommentList } from './comments/CommentList'
import Toast from '../../../common/components/Widgets/Toast'
import { navigationPop } from '../../../common/utils/navigation'
import DefaultHeader from '../../../common/containers/DefaultHeader'
import { images as commonImages } from '../../../assets/elements'
import { ActivityAuthoring } from '../../home/components/item/ActivityAuthoring'
import { ArticleActivityBar } from '../../home/components/item/ArticleActivityBar'
import commonStyles, { textStyle, DEFAULT_HEADER_HEIGHT } from '../../../styles/common'
import ParallaxScrollView from '../../../libraries/components/Parallax/ParallaxScrollView'

const { width, height } = Dimensions.get('window')

const SCROLL_HEADER_HEIGHT = Platform.OS === 'ios' ? 66 : 76
const SCROLL_HEADER_HEIGHT_INNER = Platform.OS === 'ios' ? 60 : 70
const HEADER_IMAGE_HEIGHT = height * 0.4
const AnimatedIcon = Animated.createAnimatedComponent(Icon)
class ReadingBetaComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      data: [],
      webview: false,
      images: {}
    }
    this.renderView = this.renderView.bind(this)
    this.handleIncreaseFont = this.handleIncreaseFont.bind(this)
    this.handleReduceFont = this.handleReduceFont.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleShare = this.handleShare.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleOpenSource = this.handleOpenSource.bind(this)
    this.renderNavBarView = this.renderNavBarView.bind(this)
    this.handleGoBack = this.handleGoBack.bind(this)
    this.getScroller = this.getScroller.bind(this)
  }

  getScroller (ref) {
    this.contentScroller = ref
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
    console.info(`[READING PAGE] Removed: ${article.key}`)
    navigationPop(navigation)
  }

  handleSave () {
    const { article, saveNews } = this.props
    const { images } = this.state
    const news = { ...article }
    try {
      FastImage.preload(images.map(item => ({ uri: item.data })))
    } catch (err) {
      console.debug(`[READING PAGE] Save error ${article.key}`)
    }
    // news.imagesSize = imagesSize
    saveNews(news)
    console.info(`[READING PAGE] Saved ${article.key}`)
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
      .catch((err) => { err && console.debug('[READING SHARE] Error', err) })
  }

  handleIncreaseFont () {
    const { setFontSize, fontSize } = this.props
    this.contentScroller && this.contentScroller.scrollTo({ x: 0, y: 0, animated: false })
    setTimeout(() => {
      setFontSize(fontSize + 1)
    }, 0)
  }

  handleReduceFont () {
    const { setFontSize, fontSize } = this.props
    this.contentScroller && this.contentScroller.scrollTo({ x: 0, y: 0, animated: false })
    setTimeout(() => {
      setFontSize(fontSize - 1)
    }, 0)
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

  getThemeColor () {
    const { theme } = this.props

    const baseColor = theme['background-basic-color-4'].replace('$', '')
    return baseColor
  }

  renderActions () {
    const { type, themedStyle } = this.props

    return (
      <ActionButton fixNativeFeedbackRadius key='1' buttonColor='rgba(231,76,60,1)'>
        <ActionButton.Item key='2' buttonColor='#3498db' title={i18n.t('reading.open_source')} onPress={this.handleOpenSource}>
          <SimpleLineIcon name='globe' style={themedStyle.actionIcon} />
        </ActionButton.Item>
        {type === 'bookmark'
          ? (
            <ActionButton.Item key='1' buttonColor='#9b59b6' title={i18n.t('reading.remove')} onPress={this.handleRemove}>
              <SimpleLineIcon name='close' style={themedStyle.actionIcon} />
            </ActionButton.Item>
          ) : (
            <ActionButton.Item key='1' buttonColor='#9b59b6' title={i18n.t('reading.save_news')} onPress={this.handleSave}>
              <SimpleLineIcon name='cloud-download' style={themedStyle.actionIcon} />
            </ActionButton.Item>
          )}
        <ActionButton.Item key='2' buttonColor='#3498db' title={i18n.t('reading.share')} onPress={this.handleShare}>
          <SimpleLineIcon name='share' style={themedStyle.actionIcon} />
        </ActionButton.Item>
        <ActionButton.Item key='3' buttonColor='#1abc9c' title={i18n.t('reading.font_size')} onPress={this.handleIncreaseFont}>
          <SimpleLineIcon name='magnifier-add' style={themedStyle.actionIcon} />
        </ActionButton.Item>
        <ActionButton.Item key='4' buttonColor='#1abc9c' title={i18n.t('reading.font_size')} onPress={this.handleReduceFont}>
          <SimpleLineIcon name='magnifier-remove' style={themedStyle.actionIcon} />
        </ActionButton.Item>
        <ActionButton.Item key='5' buttonColor='#9b59b6' title={i18n.t('common.back')} onPress={this.handleGoBack}>
          <SimpleLineIcon name='action-undo' style={themedStyle.actionIcon} />
        </ActionButton.Item>
      </ActionButton>
    )
  }

  renderView (animationStyles = {}) {
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
        <SharedElement id={`${article._id}_${article.avatar}_avatar`}>
          <Avatar
            style={themedStyle.authorPhoto}
            size='large'
            source={article.avatar ? { uri: article.avatar } : commonImages.default_user}
          />
        </SharedElement>
      )
    }
    let Wrapper = View
    let wrapperProps = {
      style: themedStyle.viewBackgroundInner
    }
    let smallTranslateStyle = []
    if (Platform.OS !== 'ios') {
      Wrapper = Animated.View
      wrapperProps = {
        style: [themedStyle.viewBackgroundInner, animationStyles.translateY]
      }
      smallTranslateStyle = [animationStyles.smTranslateY, animationStyles.smScale]
    }
    const readingTime = moment.duration(article.reading_time, 'seconds').minutes()
    // TODO: stupid hack UI here
    return (
      <>
        <TouchableOpacity
          onPress={this.handleGoBack}
          style={themedStyle.hackBackContainer}
        />
        <View style={[themedStyle.backgroundColor, themedStyle.viewBackground]}>
          <Wrapper {...wrapperProps}>
            <AnimatedIcon
              style={[themedStyle.backIcon, animationStyles.opacity]}
              name='arrow-left'
            />
            <Animated.View
              key='avatar'
              style={[
                themedStyle.authorPhotoContainer,
                {
                  transform: [
                    ...animationStyles.scale.transform,
                    ...animationStyles.translateX.transform
                  ]
                }
              ]}
            >
              {UserAvatarComponent}
            </Animated.View>
            {article.creator_id
              ? (
                <ActivityAuthoring
                  noTransition
                  article={article}
                  style={[
                    themedStyle.authorBar,
                    ...smallTranslateStyle
                  ]}
                  name={`${article.creator_id.display_name || 'No name'}`.trim()}
                  date={`${moment(article.created_at).fromNow()} . ${readingTime} ${i18n.t('common.reading_mins')}`}
                />
              ) : null}
          </Wrapper>
        </View>
      </>
    )
  }

  renderNavBarView (animationStyle) {
    const { navigation, themedStyle } = this.props
    return (
      <Animated.View
        style={[
          { height: DEFAULT_HEADER_HEIGHT + StatusBar.currentHeight },
          animationStyle
        ]}
      >
        <DefaultHeader
          transition={false}
          title={i18n.t('pages.reading').toUpperCase()}
          navigation={navigation}
          headerContainer={themedStyle.defaultHeader}
        />
      </Animated.View>
    )
  }

  renderContentLite ({ data, loading }) {
    const { themedStyle, article, getComments, noComment, fontSize } = this.props
    return (
      <View
        style={themedStyle.wrapperContentLite}
      >
        <ScrollView
          key='content'
          ref={this.getScroller}
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
          <View style={themedStyle.endingBlock} />
          <Text style={themedStyle.readMoreText} category='h6'>{i18n.t('reading.swipe_to_read_more')}</Text>
          <CommentList article={article} noComment={noComment} getComments={getComments} />
        </ScrollView>
        {this.renderActions()}
      </View>
    )
  }

  renderContentWebview () {
    const { article } = this.props
    return (
      <WebView
        source={{ uri: article.key }}
        style={{ alignSelf: 'stretch', height, width }}
      />
    )
  }

  renderCategories () {
    const { themedStyle, article } = this.props
    return (
      <ScrollView horizontal key='info' style={[themedStyle.tagContainer]}>
        {article.tags && article.tags.map(item => {
          return (
            <View
              style={[themedStyle.badgeContainer, themedStyle.badge, commonStyles.shadow]}
              key={item._id}
            >
              <Text style={themedStyle.textBadge}>{`${item.name}`.toUpperCase()}</Text>
            </View>
          )
        })}
      </ScrollView>
    )
  }

  render () {
    const {
      themedStyle,
      article = {},
      fontSize,
      noComment,
      getComments,
      noTransition
    } = this.props
    const { data, loading, images } = this.state

    if (!loading && !data) {
      return this.renderContentWebview()
    }
    if (!loading && images && images.length > 26) {
      return this.renderContentLite({ data, loading })
    }

    const imageSource = article.og_image_url
      ? { uri: article.og_image_url }
      : images && images[0] && images[0].data
        ? { uri: images[0].data }
        : commonImages.default_parallax

    return [
      <ParallaxScrollView
        key='0'
        scrollable={!loading}
        getScroller={this.getScroller}
        noTransition={noTransition}
        imageUrl={article.og_image_url}
        windowHeight={HEADER_IMAGE_HEIGHT}
        backgroundSource={imageSource}
        style={themedStyle.container}
        userImage={article.avatar}
        scrollableViewStyle={themedStyle.content}
        headerView={this.renderView}
        navBarView={this.renderNavBarView}
        backgroundColor={themedStyle.backgroundColor}
        navBarHeight={DEFAULT_HEADER_HEIGHT + StatusBar.currentHeight}
        scrollHeaderHeight={SCROLL_HEADER_HEIGHT}
        navBarColor={this.getThemeColor()}
      >
        {this.renderCategories()}
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
  backgroundColor: {
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
    width: 72,
    height: 72,
    zIndex: 999
  },
  authorPhotoContainer: {
    position: 'absolute',
    left: 12,
    top: -10,
    margin: 0,
    width: 84,
    height: 84,
    zIndex: 999,
    paddingTop: 5,
    paddingLeft: 5,
    borderWidth: 2,
    borderRadius: 100,
    // paddingTop: 0,
    backgroundColor: theme['background-basic-color-2'],
    borderColor: theme['border-basic-color-2']
  },
  authorBar: {
    width: width - 64,
    left: 56,
    zIndex: 1,
    backgroundColor: theme['background-basic-color-2'],
    marginBottom: 22
    // position: 'absolute'
    // bottom: -48
  },
  viewBackgroundInner: {
    width,
    height: SCROLL_HEADER_HEIGHT_INNER,
    display: 'flex',
    justifyContent: 'center'
  },
  viewBackground: {
    width,
    height: SCROLL_HEADER_HEIGHT,
    position: 'absolute',
    bottom: -36,
    zIndex: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 * 5 },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * 5
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
    paddingVertical: 0,
    paddingHorizontal: 15,
    // marginLeft: 100,
    width: '100%',
    display: 'flex'
    // height: 42,
    // position: 'absolute',
    // bottom: 0,
    // left: 5
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
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 10,
    flex: 1
  },
  contentLite: {
    width: '100%',
    height: '100%',
    display: 'flex'
  },
  actionIcon: { fontSize: 20, height: 22, color: '#FFFFFF' },
  backIcon: {
    fontSize: 36,
    left: 10,
    position: 'absolute',
    color: theme['text-basic-color']
    // justifyContent: 'center'
  },
  hackBackContainer: {
    width: 80,
    height: HEADER_IMAGE_HEIGHT,
    position: 'relative',
    marginTop: StatusBar.currentHeight,
    zIndex: 9999,
    backgroundColor: 'transparent'
  },
  defaultHeader: {
    backgroundColor: 'transparent',
    width: '100%',
    marginTop: StatusBar.currentHeight
  }
}))
