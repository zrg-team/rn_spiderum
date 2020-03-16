import React, { Component } from 'react'
import i18n from 'i18n-js'
import DefaultPage from '../common/hocs/DefaultPage'
import DefaultHeader from '../common/containers/DefaultHeader'
import Modal from '../common/components/Widgets/Modal'
import ContentLoadingPage from './ContentLoadingPage'
import { Layout } from 'react-native-ui-kitten'
import List from '../modules/home/containers/List'

export default class NewsPage extends Component {
  constructor (props) {
    super(props)
    Modal.showFullScreen(<ContentLoadingPage title={i18n.t('pages.news')} />)
    this.handleLoadingDone = this.handleLoadingDone.bind(this)
  }

  handleLoadingDone () {
    setTimeout(() => {
      Modal.hide()
    }, 10)
  }

  render () {
    const { navigation } = this.props
    return (
      <DefaultPage>
        <DefaultHeader
          noBack
          transition={false}
          title={i18n.t('pages.news').toUpperCase()}
          navigation={navigation}
        />
        <Layout style={[{ flexGrow: 1 }]} level='2'>
          <List noCarousel type='news' navigation={navigation} lazy onLoadingDone={this.handleLoadingDone} />
        </Layout>
      </DefaultPage>
    )
  }
}
