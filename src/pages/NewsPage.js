import React, { Component } from 'react'
import i18n from 'i18n-js'
import DefaultPage from '../common/hocs/DefaultPage'
import DefaultHeader from '../common/containers/DefaultHeader'
import { Layout } from 'react-native-ui-kitten'
import List from '../modules/home/containers/List'

export default class NewsPage extends Component {
  constructor (props) {
    super(props)
    this.viewRef = null
  }

  render () {
    const { navigation } = this.props
    return (
      <DefaultPage ref={ref => { this.viewRef = ref }}>
        <DefaultHeader
          noBack
          transition={false}
          title={i18n.t('pages.news').toUpperCase()}
          navigation={navigation}
        />
        <Layout style={[{ flexGrow: 1 }]} level='2'>
          <List noCarousel type='news' navigation={navigation} />
        </Layout>
      </DefaultPage>
    )
  }
}
