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
    Modal.showFullScreen(<ContentLoadingPage noSearch title={i18n.t('pages.news')} />)
    this.handleLoadingDone = this.handleLoadingDone.bind(this)
  }

  handleLoadingDone () {
    Modal.hide()
  }

  render () {
    const { navigation } = this.props
    return (
      <DefaultPage>
        <DefaultHeader
          noBack
          transition={false}
          navigation={navigation}
          title={i18n.t('pages.news').toUpperCase()}
        />
        <Layout style={[{ flexGrow: 1 }]} level='2'>
          <List type='news' navigation={navigation} lazy onLoadingDone={this.handleLoadingDone} />
        </Layout>
      </DefaultPage>
    )
  }
}
