import React, { Component } from 'react'
import i18n from 'i18n-js'
import DefaultPage from '../common/hocs/DefaultPage'
import DefaultHeader from '../common/containers/DefaultHeader'
import { Layout } from 'react-native-ui-kitten'
import { getRouteParams } from '../common/utils/navigation'
import Profile from '../modules/profile/containers/Profile'

export default class ProfilePage extends Component {
  render () {
    const { navigation } = this.props
    const profileId = getRouteParams('profileId', this.props)
    return (
      <DefaultPage>
        <DefaultHeader
          transition={false}
          title={i18n.t('pages.profile').toUpperCase()}
          navigation={navigation}
        />
        <Layout style={[{ flexGrow: 1 }]} level='2'>
          <Profile profileId={profileId} navigation={navigation} />
        </Layout>
      </DefaultPage>
    )
  }
}
