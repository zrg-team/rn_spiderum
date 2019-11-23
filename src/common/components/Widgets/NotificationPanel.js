import React, { Component } from 'react'
import moment from 'moment'
import i18n from 'i18n-js'
import {
  Text,
  Easing,
  FlatList,
  Platform,
  Dimensions,
  SafeAreaView,
  View,
  StyleSheet,
  Animated,
  Image,
  StatusBar,
  findNodeHandle,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import FastImage from 'react-native-fast-image'
import { BlurView } from '@react-native-community/blur'
import AntDesignIcons from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import commonStyles, { appHeight } from '../../../styles/common'
import { images } from '../../../assets/elements'
import { MODULE_NAME as MODULE_HOME } from '../../../modules/home/models'
import { navigationPush, screens } from '../../utils/navigation'
const { width } = Dimensions.get('window')

let instance = null
class NotificationPanelComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isShow: false,
      notification: false,
      notificationLatest: props.notificationTime
    }

    instance = this
    this.show = this.show.bind(this)
    this.handleHide = this.handleHide.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.runAnimation = this.runAnimation.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
    this.handlePressNew = this.handlePressNew.bind(this)
    this.runHideAnimation = this.runHideAnimation.bind(this)
    this.getAnimationStyle = this.getAnimationStyle.bind(this)

    this.notificationInstance = null
    this.showAnimation = new Animated.Value(1)
    this.iconAnimation = new Animated.Value(0)
    this.listenNotification()
  }

  handlePressNew (article) {
    this.handleHide()
    navigationPush(undefined, screens().Reading, { article, itemIndex: null })
  }

  runAnimation () {
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
    ]).start()
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

  keyExtractor (item) {
    return item.id
  }

  renderItem ({ item }) {
    const { notificationTime } = this.props
    let containerStyle = {}
    let textStyle = {}
    const isNews = +item.time > +notificationTime
    if (isNews) {
      containerStyle = {
        backgroundColor: '#EFF3F6'
      }
      textStyle = {
        fontWeight: 'bold',
        color: '#35474E'
      }
    }
    const readingTime = moment.duration(item.reading_time, 'seconds').minutes()
    return (
      <TouchableOpacity
        onPress={() => this.handlePressNew(item)}
        style={[styles.item, containerStyle]}
      >
        <View style={styles.itemImage}>
          <FastImage
            style={{ width: 60, height: 60 }}
            resizeMode={FastImage.resizeMode.cover}
            source={item.og_image_url ? { uri: item.og_image_url } : images.default_image}
          />
        </View>
        <View style={styles.itemContent}>
          <Text
            style={[styles.itemMessage, textStyle]}
          >{item.title}
          </Text>
          <Text
            style={styles.itemTime}
          >
            {`${moment(item.created_at).fromNow()} . ${readingTime} phút đọc`}
          </Text>
        </View>
      </TouchableOpacity>)
  }

  listenNotification () {
  }

  getNotificationTimeStamp (time) {
    if (isNaN(time)) {
      return +moment(time).unix()
    }
    return +time
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
      this.runAnimation()
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
    const { appState } = this.props
    if (this.blurNode && appState === 'active') {
      return (
        <TouchableOpacity onPress={this.handleHide} style={styles.overlay}>
          <BlurView
            viewRef={this.blurNode}
            blurType='dark'
            blurAmount={2}
            downsampleFactor={2}
          />
        </TouchableOpacity>
      )
    }
    return <TouchableOpacity onPress={this.handleHide} style={styles.overlay_background} />
  }

  render () {
    const { notificationTime, notificationLatest, notifications } = this.props
    const { isShow } = this.state
    if (!isShow) {
      return null
    }
    const animationStyles = this.getAnimationStyle()
    return (
      <SafeAreaView style={styles.container}>
        {this.renderBackground()}
        <View
          style={styles.overlayIcon}
        >
          <MaterialCommunityIcons onPress={this.handleHide} name='book-open-variant' color='#000' size={29} />
          {+notificationLatest > +notificationTime
            ? <View style={styles.notification} /> : null}
        </View>
        <Animated.View
          style={[styles.image, animationStyles.image]}
        />
        <Animated.View
          style={[styles.list, animationStyles.container, commonStyles.shadow]}
        >
          <View style={styles.titleContainer}>
            <AntDesignIcons name='solution1' size={30} />
            <Text
              style={[styles.notificationTitle]}
            >
              {i18n.t('common.hot_news')}
            </Text>
          </View>
          {notifications && notifications.length
            ? (
              <FlatList
                data={notifications}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                style={{
                  width: '100%',
                  height: undefined
                }}
                contentContainerStyle={styles.list_content}
              />)
            : (
              <View
                style={styles.no_notification}
              >
                <Image source={images.alarm} width={30} height={30} />
              </View>)}
        </Animated.View>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
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
    color: '#35474E',
    fontSize: 20,
    paddingLeft: 10
  },
  itemMessage: {
    color: '#35474E',
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
    width: 60
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
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    paddingVertical: 10,
    maxHeight: appHeight - 170,
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
    borderBottomColor: '#FFFFFF',
    marginTop: StatusBar.currentHeight
  },
  list_content: {
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
  no_notification: {
    width: '100%',
    height: '100%',
    display: 'flex',
    paddingVertical: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  no_notification_text: { color: '#35474E', fontSize: 18, marginTop: 10 },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  overlay_background: {
    position: 'absolute',
    backgroundColor: '#000',
    opacity: 0.5,
    width: '100%',
    height: '100%',
    top: StatusBar.currentHeight
  }
})

function mapStateToProps (state) {
  return {
    appState: state.session.appState,
    notifications: state[MODULE_HOME].news.top || []
  }
}

export default {
  Component: connect(mapStateToProps, {
  })(NotificationPanelComponent),
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
