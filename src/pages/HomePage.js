import React, { Component } from 'react'
import i18n from 'i18n-js'
import DefaultPage from '../common/hocs/DefaultPage'
import DefaultHeader from '../common/containers/DefaultHeader'
import { Layout } from 'react-native-ui-kitten'
import List from '../modules/home/containers/List'

class HomePage extends Component {
  constructor (props) {
    super(props)
    this.viewRef = null
  }

  render () {
    const { navigation } = this.props
    return (
      <DefaultPage ref={ref => { this.viewRef = ref }}>
        <DefaultHeader
          notification
          noBack
          transition={false}
          title={i18n.t('pages.hot').toUpperCase()}
          navigation={navigation}
        />
        <Layout style={[{ flexGrow: 1 }]} level='2'>
          <List type='hot' navigation={navigation} />
        </Layout>
      </DefaultPage>
    )
  }
}

export default HomePage
