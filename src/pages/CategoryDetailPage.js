import React, { Component } from 'react'
import i18n from 'i18n-js'
import { Layout } from 'react-native-ui-kitten'
import DefaultPage from '../common/hocs/DefaultPage'
import DefaultHeader from '../common/containers/DefaultHeader'
import { getRouteParams } from '../common/utils/navigation'
import Detail from '../modules/category/containers/Detail'

export default class CategoryDetailPage extends Component {
  render () {
    const { navigation } = this.props
    const article = getRouteParams('item', this.props, {})
    return (
      <DefaultPage>
        <DefaultHeader
          transition={false}
          title={i18n.t('pages.category_detail').toUpperCase()}
          navigation={navigation}
        />
        <Layout style={[{ flexGrow: 1 }]} level='2'>
          <Detail article={article} navigation={navigation} />
        </Layout>
      </DefaultPage>
    )
  }
}
