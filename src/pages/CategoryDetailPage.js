import React, { Component } from 'react'
import i18n from 'i18n-js'
import DefaultPage from '../common/hocs/DefaultPage'
import DefaultHeader from '../common/containers/DefaultHeader'
import { Layout } from 'react-native-ui-kitten'
import Detail from '../modules/category/containers/Detail'

export default class CategoryDetailPage extends Component {
  constructor (props) {
    super(props)
    this.viewRef = null
  }

  render () {
    const { navigation } = this.props
    const article = navigation.getParam('item', {})
    return (
      <DefaultPage ref={ref => { this.viewRef = ref }}>
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
