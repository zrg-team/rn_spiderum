import React, { Component } from 'react'
import i18n from 'i18n-js'
import DefaultPage from '../common/hocs/DefaultPage'
import DefaultHeader from '../common/containers/DefaultHeader'
import { Layout } from 'react-native-ui-kitten'
import Profile from '../modules/profile/containers/Profile'

export default class ProfilePage extends Component {
  constructor (props) {
    super(props)
    this.viewRef = null
  }

  render () {
    const { navigation } = this.props
    const profileId = navigation.getParam('profileId')
    return (
      <DefaultPage ref={ref => { this.viewRef = ref }}>
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
