import React, { Component } from 'react'
import i18n from 'i18n-js'
import { Dimensions, StatusBar } from 'react-native'
import * as Animatable from 'react-native-animatable'
import DefaultPage from '../common/hocs/DefaultPage'
import DefaultHeader from '../common/containers/DefaultHeader'
import { Layout, withStyles } from 'react-native-ui-kitten'
import { DefaultSkeleton } from '../libraries/components/Skeleton'
import { TAB_BAR_HEIGHT } from '../styles/common'
const { width, height } = Dimensions.get('window')

class ContentLoadingPage extends Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    const { navigation, themedStyle, title } = this.props
    return (
      <DefaultPage
        containerStyle={themedStyle.container}
      >
        <DefaultHeader
          notification
          search
          noBack
          transition={false}
          title={(title || i18n.t('pages.hot')).toUpperCase()}
          navigation={navigation}
        />
        <Layout style={[{ flexGrow: 1 }]} level='2'>
          <Animatable.View useNativeDriver animation='fadeInUp' style={themedStyle.loadingContainer}>
            <DefaultSkeleton />
            <DefaultSkeleton />
            <DefaultSkeleton />
            <DefaultSkeleton />
            <DefaultSkeleton />
            <DefaultSkeleton />
            <DefaultSkeleton />
            <DefaultSkeleton />
            <DefaultSkeleton />
            <DefaultSkeleton />
          </Animatable.View>
        </Layout>
      </DefaultPage>
    )
  }
}

export default withStyles(ContentLoadingPage, (theme) => ({
  container: {
    width: width,
    overflow: 'hidden',
    height: height - StatusBar.currentHeight - TAB_BAR_HEIGHT,
    marginTop: StatusBar.currentHeight,
    backgroundColor: 'transparent'
  },
  loadingContainer: {
    paddingHorizontal: 20
  }
}))
