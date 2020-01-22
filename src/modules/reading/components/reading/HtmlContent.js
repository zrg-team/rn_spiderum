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
// import YouTube from 'react-native-youtube'
import WebView from 'react-native-webview'
import Html from 'react-native-render-html'
import LottieView from 'lottie-react-native'
import * as Animatable from 'react-native-animatable'
import { ContentSkeleton } from '../../../../libraries/components/Skeleton'
import ImageResize from '../../../../common/components/Layout/ImageResize'
import { animations } from '../../../../assets/elements'

const { width } = Dimensions.get('window')

class ReadingBetaComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      imagesSize: {}
    }

    this.handlePressLink = this.handlePressLink.bind(this)
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
        const uri = `https://${item.src}`.replace('////', '//')
        // const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/ // eslint-disable-line
        // const match = uri.match(regExp)
        // if (match && match[7].length === 11) {
        //   return (
        //     <YouTube
        //       key={`yotube_${item.src}`}
        //       apiKey='AIzaSyDMK1RbmZhPs3sNfNXTXy3_gvzJaW6Xa64'
        //       videoId={match[7]} // The YouTube video ID
        //       style={{ alignSelf: 'stretch', height: width / ratio, width }}
        //     />
        //   )
        // }
        return (
          <WebView
            key={`yotube_${item.src}`}
            source={{ uri }}
            onError={syntheticEvent => {
              const { nativeEvent } = syntheticEvent
              console.debug('[RENDER YOUTUBE]', nativeEvent)
            }}
            onHttpError={syntheticEvent => {
              const { nativeEvent } = syntheticEvent
              console.debug('[RENDER YOUTUBE]', nativeEvent)
            }}
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

  static getDerivedStateFromError (error) { // eslint-disable-line
    return { componentError: true }
  }

  componentDidCatch (error, errorInfo) {
    console.debug('[READING RENDER] ERROR', error)
    console.debug('[READING RENDER] ERROR INFO', errorInfo)
  }

  renderError () {
    const { themedStyle } = this.props
    return (
      <>
        <LottieView
          style={themedStyle.errorImage}
          source={animations.loading}
          autoPlay
          loop
        />
      </>
    )
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
