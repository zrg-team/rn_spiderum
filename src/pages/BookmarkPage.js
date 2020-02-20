import React, { Component } from 'react'
import i18n from 'i18n-js'
import DefaultPage from '../common/hocs/DefaultPage'
import DefaultHeader from '../common/containers/DefaultHeader'
import { Layout } from 'react-native-ui-kitten'
import Bookmark from '../modules/user/containers/Bookmark'

export default class BookmarkPage extends Component {
  render () {
    const { navigation } = this.props
    return (
      <DefaultPage>
        <DefaultHeader
          transition={false}
          title={i18n.t('pages.bookmark').toUpperCase()}
          navigation={navigation}
        />
        <Layout style={[{ flexGrow: 1 }]} level='2'>
          <Bookmark navigation={navigation} />
        </Layout>
      </DefaultPage>
    )
  }
}
