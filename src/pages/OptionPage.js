import React, { Component } from 'react'
import i18n from 'i18n-js'
import DefaultPage from '../common/hocs/DefaultPage'
import DefaultHeader from '../common/containers/DefaultHeader'
import { Layout } from 'react-native-ui-kitten'
import { navigate, screens } from '../common/utils/navigation'
import Carousel from '../modules/user/containers/Carousel'
import Options from '../modules/user/containers/Options'

export default class OptionPage extends Component {
  render () {
    const { navigation } = this.props
    return (
      <DefaultPage>
        <DefaultHeader
          noBack
          transition={false}
          title={i18n.t('pages.setting').toUpperCase()}
          navigation={navigation}
          onPressBack={() => {
            navigate(navigation, screens().Home)
          }}
        />
        <Layout
          level='2'
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Carousel />
          <Options navigation={navigation} />
        </Layout>
      </DefaultPage>
    )
  }
}
