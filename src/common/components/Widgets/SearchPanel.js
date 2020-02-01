import React, { PureComponent } from 'react'
import i18n from 'i18n-js'
import {
  Text,
  View,
  Image,
  Easing,
  FlatList,
  Animated,
  Platform,
  TextInput,
  StatusBar,
  Dimensions,
  SafeAreaView,
  findNodeHandle,
  TouchableOpacity
} from 'react-native'
import {
  withStyles
} from 'react-native-ui-kitten'
import { connect } from 'react-redux'
import { BlurView } from '@react-native-community/blur'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import commonStyles, { appHeight } from '../../../styles/common'
import { images } from '../../../assets/elements'
import { MODULE_NAME as MODULE_HOME } from '../../../modules/home/models'
import { navigationPush, screens } from '../../utils/navigation'
import homeHandlers from '../../../modules/home/handlers'

const { width } = Dimensions.get('window')

let instance = null
class SearchPanelComponent extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isShow: false,
      page: 1,
      searchText: ''
    }

    instance = this
    this.show = this.show.bind(this)
    this.handleHide = this.handleHide.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.getInputRef = this.getInputRef.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.runAnimation = this.runAnimation.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
    this.handlePressNew = this.handlePressNew.bind(this)
    this.handleLoadMore = this.handleLoadMore.bind(this)
    this.handleChangeText = this.handleChangeText.bind(this)
    this.runHideAnimation = this.runHideAnimation.bind(this)
    this.getAnimationStyle = this.getAnimationStyle.bind(this)

    this.notificationInstance = null
    this.showAnimation = new Animated.Value(1)
    this.iconAnimation = new Animated.Value(0)
  }

  handleChangeText (searchText) {
    this.setState({
      searchText
    })
  }

  handleSearch () {
    const { searchText } = this.state
    if (!searchText || !`${searchText}`.trim()) {
      return
    }
    this.getData(1)
  }

  handleLoadMore () {
    // const { page, loading, searchText } = this.state
    // if (!this.loadingMore && !loading && searchText) {
    //   this.loadingMore = true
    //   this.getData(page + 1, () => {
    //     this.loadingMore = false
    //   })
    // }
  }

  async getData (nextpage, callback) {
    const { page, searchText } = this.state
    const { searchNews, data } = this.props
    const result = await searchNews(nextpage || page, { q: searchText })
    if (result || data.length) {
      return this.setState({
        page: nextpage || page,
        loading: false
      }, () => {
        callback && callback(nextpage || page)
      })
    }
  }

  getInputRef (ref) {
    this.inputRef = ref
  }

  handlePressNew (article) {
    this.handleHide()
    navigationPush(undefined, screens().Reading, { article, itemIndex: null })
  }

  runAnimation (callback) {
    this.showAnimation.setValue(0)
    this.iconAnimation.setValue(0)
    return Animated.sequence([
      Animated.timing(this.showAnimation, {
        toValue: 1,
        useNativeDriver: true,
        duration: 100,
        easing: Easing.bounce
      }),
      Animated.timing(this.iconAnimation, {
        toValue: 1,
        useNativeDriver: true,
        duration: 150,
        easing: Easing.in()
      })
    ]).start(callback)
  }

  runHideAnimation (calback) {
    this.showAnimation.setValue(1)
    this.iconAnimation.setValue(0)
    return Animated.timing(this.showAnimation, {
      toValue: 0,
      useNativeDriver: true,
      duration: 150,
      easing: Easing.ease
    }).start(calback)
  }

  getAnimationStyle () {
    const value = this.showAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0]
    })
    const valueFade = this.showAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 1]
    })
    const iconValue = this.iconAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [60, 0]
    })
    const iconValueFade = this.iconAnimation.interpolate({
      inputRange: [0, 0.1, 1],
      outputRange: [0, 0.6, 1]
    })
    return {
      image: {
        opacity: iconValueFade,
        transform: [{
          translateY: iconValue
        }]
      },
      container: {
        opacity: valueFade,
        transform: [{
          translateY: value
        }],
        zIndex: 10
      }
    }
  }

  keyExtractor (item, index) {
    return `${item.key}_${index}`
  }

  renderItem ({ item }) {
    const { themedStyle } = this.props
    return (
      <TouchableOpacity
        onPress={() => this.handlePressNew(item)}
        style={[themedStyle.item]}
      >
        <View style={themedStyle.itemContent}>
          <Text
            style={[themedStyle.itemMessage]}
          >༄  {item.title}
          </Text>
          <Text
            style={themedStyle.itemTime}
          >
            {item.time_formated}
          </Text>
        </View>
      </TouchableOpacity>)
  }

  componentWillUnmount () {
    instance = null
  }

  show () {
    const { parentRef } = this.props
    if (parentRef) {
      this.blurNode = findNodeHandle(parentRef)
    }
    this.setState({
      isShow: true
    }, () => {
      this.runAnimation(() => {
        this.inputRef && this.inputRef.focus()
      })
    })
  }

  handleHide () {
    this.runHideAnimation(() => {
      this.blurNode = null
      this.setState({
        isShow: false
      })
      clearTimeout(this.timeoutRead)
      this.timeoutRead = setTimeout(() => {
        this.timeoutRead = null
      }, 1000)
    })
  }

  renderBackground () {
    const { themedStyle, appState } = this.props
    if (this.blurNode && appState === 'active') {
      return (
        <TouchableOpacity onPress={this.handleHide} style={themedStyle.overlay}>
          <BlurView
            viewRef={this.blurNode}
            blurType='dark'
            blurAmount={2}
            downsampleFactor={2}
          />
        </TouchableOpacity>
      )
    }
    return <TouchableOpacity onPress={this.handleHide} style={themedStyle.overlayBackground} />
  }

  render () {
    const { themedStyle, data } = this.props
    const { isShow } = this.state
    if (!isShow) {
      return null
    }
    const animationStyles = this.getAnimationStyle()
    return (
      <SafeAreaView style={themedStyle.container}>
        {this.renderBackground()}
        <View
          style={themedStyle.textInputOverlay}
        >
          <TextInput
            placeholder={i18n.t('messages.search_placeholder')}
            onChangeText={this.handleChangeText}
            onSubmitEditing={this.handleSearch}
            style={themedStyle.textInput}
            ref={this.getInputRef}
            returnKeyType='search'
            blurOnSubmit
          />
        </View>
        <View
          style={themedStyle.overlayIcon}
        >
          <MaterialCommunityIcons onPress={this.handleHide} name='close-box-multiple' color='#FFFFFF' size={30} />
        </View>
        <Animated.View
          style={[themedStyle.image, animationStyles.image]}
        />
        <Animated.View
          style={[themedStyle.list, animationStyles.container, commonStyles.shadow]}
        >
          <View style={themedStyle.titleContainer}>
            <MaterialCommunityIcons style={themedStyle.iconResult} name='file-document-box-multiple' size={22} />
            <Text
              style={[themedStyle.notificationTitle]}
            >
              {i18n.t('common.search_result')}
            </Text>
          </View>
          {data && data.length
            ? (
              <FlatList
                data={data}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                style={themedStyle.flatlist}
                contentContainerStyle={themedStyle.listContent}
                onEndReached={this.handleLoadMore}
                removeClippedSubviews
                onEndThreshold={0.5}
              />)
            : (
              <View
                style={themedStyle.noNotification}
              >
                <Image source={images.no_result} resizeMode='contain' style={themedStyle.noImage} />
              </View>)}
        </Animated.View>
      </SafeAreaView>
    )
  }
}
const styles = (theme) => ({
  flatlist: {
    width: '100%',
    height: undefined
  },
  iconItem: {
    color: theme['color-primary-focus']
  },
  iconResult: {
    color: theme['text-hint-color']
  },
  container: {
    flex: 1,
    position: 'absolute',
    width,
    height: appHeight
  },
  itemTime: {
    paddingVertical: 5,
    justifyContent: 'center',
    color: '#B7C4CC',
    fontSize: 15
  },
  notificationTitle: {
    color: theme['text-hint-color'],
    fontSize: 18,
    paddingLeft: 10
  },
  itemMessage: {
    color: theme['text-basic-color'],
    fontSize: 14
  },
  titleContainer: {
    flexDirection: 'row',
    paddingLeft: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    height: undefined,
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingHorizontal: 4,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomColor: '#9DAAB6',
    borderBottomWidth: 1
  },
  itemImage: {
    width: 40,
    display: 'flex',
    alignItems: 'center'
  },
  itemContent: {
    flex: 1,
    display: 'flex',
    paddingLeft: 10,
    flexDirection: 'column'
  },
  overlayIcon: {
    marginTop: StatusBar.currentHeight,
    position: 'absolute',
    right: 13,
    top: Platform.OS === 'ios' ? 35 : 12,
    zIndex: 99
  },
  list: {
    width: width - 10,
    marginLeft: 5,
    position: 'absolute',
    zIndex: 9999,
    backgroundColor: theme['background-basic-color-1'],
    borderRadius: 3,
    paddingVertical: 10,
    maxHeight: appHeight - 120,
    top: Platform.OS === 'ios' ? 88 : 70,
    marginTop: StatusBar.currentHeight
  },
  image: {
    width: 0,
    height: 0,
    borderRadius: 3,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    right: 17,
    top: Platform.OS === 'ios' ? 74 : 52,
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme['background-basic-color-1'],
    marginTop: StatusBar.currentHeight
  },
  listContent: {
    paddingVertical: 10
  },
  notification: {
    width: 13,
    height: 13,
    borderRadius: 5,
    right: -2,
    top: 5,
    backgroundColor: '#F18600',
    position: 'absolute',
    zIndex: 99
  },
  noNotification: {
    width: '100%',
    height: '100%',
    display: 'flex',
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noImage: {
    width: 300,
    height: 200
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  overlayBackground: {
    position: 'absolute',
    backgroundColor: '#000',
    opacity: 0.5,
    width: '100%',
    height: '100%',
    top: StatusBar.currentHeight
  },
  textInput: {
    width: '100%',
    fontSize: 16,
    color: theme['text-basic-color'],
    paddingHorizontal: 10,
    paddingTop: 10
  },
  textInputOverlay: {
    borderRadius: 5,
    height: 40,
    width: width - 70,
    marginTop: StatusBar.currentHeight,
    position: 'absolute',
    left: 20,
    top: 10,
    zIndex: 99,
    backgroundColor: theme['background-basic-color-1']
  }
})

function mapStateToProps (state) {
  const searchResult = state[MODULE_HOME].search || {}
  return {
    appState: state.session.appState,
    data: searchResult.data || []
  }
}

export default {
  Component: connect(
    mapStateToProps,
    homeHandlers
  )(withStyles(SearchPanelComponent, styles)),
  show: () => {
    if (instance) {
      instance.show()
    }
  },
  hide: () => {
    if (instance) {
      instance.handleHide()
    }
  }
}
