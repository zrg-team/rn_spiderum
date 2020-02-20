import React, { Component } from 'react'
import i18n from 'i18n-js'
import DefaultPage from '../common/hocs/DefaultPage'
import DefaultHeader from '../common/containers/DefaultHeader'
import { Layout } from 'react-native-ui-kitten'
import Categories from '../modules/category/containers/Categories'

export default class CategoriesPage extends Component {
  render () {
    const { navigation } = this.props
    return (
      <DefaultPage>
        <DefaultHeader
          noBack
          transition={false}
          title={i18n.t('pages.categories').toUpperCase()}
          navigation={navigation}
        />
        <Layout style={[{ flexGrow: 1 }]} level='2'>
          <Categories type='top' navigation={navigation} />
        </Layout>
      </DefaultPage>
    )
  }
}
