import React, { Component } from 'react'
import i18n from 'i18n-js'
import DefaultPage from '../common/hocs/DefaultPage'
import DefaultHeader from '../common/containers/DefaultHeader'
import { Layout } from 'react-native-ui-kitten'
import Modal from '../common/components/Widgets/Modal'
import ContentLoadingPage from './ContentLoadingPage'
import List from '../modules/home/containers/List'

class HomePage extends Component {
  constructor (props) {
    super(props)
    Modal.showFullScreen(<ContentLoadingPage />)
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
          search
          noBack
          notification
          transition={false}
          navigation={navigation}
          title={i18n.t('pages.hot').toUpperCase()}
        />
        <Layout style={[{ flexGrow: 1 }]} level='2'>
          <List type='hot' navigation={navigation} lazy onLoadingDone={this.handleLoadingDone} />
        </Layout>
      </DefaultPage>
    )
  }
}

export default HomePage
