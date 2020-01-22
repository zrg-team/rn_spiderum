import React from 'react'
import {
  Image,
  Dimensions
} from 'react-native'
import {
  withStyles
} from 'react-native-ui-kitten'
import FastImage from 'react-native-fast-image'

const { width } = Dimensions.get('window')

class ImageResizeComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      imageSize: props.imageSize,
      width: '100%',
      height: undefined
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { loading } = this.state
    return !nextState.loading && nextState.loading !== loading
  }

  componentDidMount () {
    const { imageSize } = this.state
    const { uri, onImageLoaded } = this.props
    if (imageSize) {
      return this.setState({
        loading: false
      })
    }
    Image.getSize(uri, (itemWidth, itemHeight) => {
      const result = {}
      const ratio = itemWidth / itemHeight
      result.width = (width - 20)
      result.height = Math.round(result.width / ratio)
      this.setState({
        ...result,
        loading: false
      }, () => {
        onImageLoaded && onImageLoaded(uri, result)
      })
    }, () => {
      this.setState({
        width,
        height: 200,
        loading: false
      })
    })
  }

  render () {
    const { loading, width, height, imageSize } = this.state
    const { uri, style } = this.props

    if (loading) {
      return null
    }
    return (
      <FastImage
        style={[style, imageSize || { width, height }]}
        source={{ uri }}
        resizeMode={FastImage.resizeMode.stretch}
      />
    )
  }
}

export default withStyles(ImageResizeComponent, (theme) => ({
}))
