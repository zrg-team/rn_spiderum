import React from 'react'
import i18n from 'i18n-js'
import {
  View,
  Image
} from 'react-native'
import {
  Text,
  withStyles,
  TabView,
  Tab
} from 'react-native-ui-kitten'
import * as Animatable from 'react-native-animatable'
import { textStyle } from '../../../styles/common'
import { images } from '../../../assets/elements'
import { ContentSkeleton } from '../../../libraries/components/Skeleton'
import List from '../containers/List'

class DetailComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      data: [],
      tab: 0,
      show: true
    }
    this.handleSelectLevel = this.handleSelectLevel.bind(this)
    this.shouldLoadComponent = this.shouldLoadComponent.bind(this)
  }

  shouldLoadComponent (index) {
    // return index === this.state.tab
    return true
  }

  handleSelectLevel (index) {
    // this.scrollY.setValue(0)
    this.setState({
      tab: index
    })
  }

  renderContent () {
    const { tab } = this.state
    const { article, themedStyle, navigation } = this.props
    return (
      <TabView
        style={themedStyle.tabContainer}
        selectedIndex={tab}
        onSelect={this.handleSelectLevel}
        shouldLoadComponent={this.shouldLoadComponent}
        tabBarStyle={themedStyle.tabBar}
      >
        <Tab
          title={i18n.t('category.hot')}
        >
          <List
            navigation={navigation}
            type='hot'
            item={article}
          />
        </Tab>
        <Tab
          title={i18n.t('category.news')}
        >
          <List
            navigation={navigation}
            type='news'
            item={article}
          />
        </Tab>
        <Tab
          title={i18n.t('category.top')}
        >
          <List
            navigation={navigation}
            type='top'
            item={article}
          />
        </Tab>
      </TabView>
    )
  }

  render () {
    const {
      themedStyle,
      article = {}
    } = this.props
    const { show, loading } = this.state
    return (
      <View
        style={themedStyle.container}
      >
        {show ? (
          <View
            style={[
              themedStyle.header
            ]}
          >
            <Image
              style={[
                themedStyle.image
              ]}
              resizeMode='cover'
              source={images[article.image]}
            />
            <Animatable.View
              style={[themedStyle.titleContainer]}
              animation='bounce'
              useNativeDriver
            >
              <Text
                style={themedStyle.titleLabel}
                category='h2'
              >
                {article.title}
              </Text>
            </Animatable.View>
          </View>) : null}
        {
          loading
            ? <ContentSkeleton />
            : this.renderContent()
        }
      </View>
    )
  }
}

export default withStyles(DetailComponent, (theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-1']
  },
  tabContainer: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2']
  },
  content: {
    paddingTop: 0
  },
  header: {
    height: 80,
    overflow: 'hidden'
  },
  image: {
    height: 80
  },
  titleContainer: {
    position: 'absolute',
    margin: 0,
    zIndex: 999,
    top: 40,
    width: '100%',
    alignItems: 'center'
  },
  titleLabel: {
    color: '#FFFFFF',
    marginTop: -25,
    ...textStyle.headline
  },
  tabBar: {
    height: 38
  }
}))
