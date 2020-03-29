import React, { Fragment } from 'react'
import {
  View,
  Image,
  Linking,
  Dimensions
} from 'react-native'
import {
  Text,
  withStyles
} from 'react-native-ui-kitten'
import * as Animatable from 'react-native-animatable'
import Html from 'react-native-render-html'
import WebView from 'react-native-webview'
import Share from 'react-native-share'
import { READING_URL } from '../../models'
import { ContentSkeleton } from '../../../../libraries/components/Skeleton'
import ImageResize from '../../../../common/components/Layout/ImageResize'

const { width } = Dimensions.get('window')

class ReadingBetaComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      imagesSize: {}
    }

    this.handlePressLink = this.handlePressLink.bind(this)
    this.handleOpenSource = this.handleOpenSource.bind(this)
    this.handleImageLoaded = this.handleImageLoaded.bind(this)

    this.createTagStyles()
    let number = 0
    this.renderers = {
      blockquote: (item, children, css, passProps) => {
        const { themedStyle, fontSize } = passProps
        number++
        return (
          <Fragment key={`${number}`}>
            <View
              style={themedStyle.blockquoteWrapper}
            >
              <Text style={[themedStyle.blockquoteText, { fontSize }]}>❝</Text>
              <View style={themedStyle.blockquoteStart} />
            </View>
            {children}
            <View
              style={themedStyle.blockquoteWrapper}
            >
              <View style={themedStyle.blockquoteStart} />
              <Text style={[themedStyle.blockquoteText, { fontSize }]}>❞</Text>
            </View>
          </Fragment>
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
    this.tagsStyles = {
      div: { paddingVertical: 5, fontSize: fontSize, ...themedStyle.textColor },
      a: { paddingVertical: 5, fontSize: fontSize, ...themedStyle.textColor },
      p: { paddingVertical: 5, fontSize: fontSize, ...themedStyle.textColor },
      li: { paddingVertical: 5, fontSize: fontSize, ...themedStyle.textColor },
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

  componentWillReceiveProps (nextProps, nextState) {
    const { fontSize } = this.props
    if (fontSize !== nextProps.fontSize) {
      this.createTagStyles(nextProps)
    }
  }

  render () {
    const {
      themedStyle,
      fontSize,
      data,
      loading
    } = this.props
    const { imagesSize, loading: internalLoading } = this.state

    if (loading || internalLoading) {
      return (
        <Animatable.View useNativeDriver animation='fadeInUp'>
          <ContentSkeleton />
        </Animatable.View>
      )
    }
    return (
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
          fontSize={fontSize}
        />
      </View>
    )
  }
}

export default withStyles(ReadingBetaComponent, (theme) => ({
  htmlContainer: {
    paddingHorizontal: 10
  },
  textColor: {
    color: theme['text-basic-color']
  },
  blockquoteWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  blockquoteText: {
    color: theme['color-primary-500'],
    fontWeight: 'bold',
    paddingHorizontal: 5
  },
  blockquoteStart: {
    flex: 1,
    backgroundColor: theme['color-primary-500'],
    height: 2
  },
  endingBlock: {
    backgroundColor: theme['color-success-500'],
    height: 3
  },
  imageContent: {
    marginVertical: 10,
    marginHorizontal: 0
  }
}))