import React from 'react'
import { View } from 'react-native'
import { withStyles } from 'react-native-ui-kitten'
import { ProfileInfo } from './ProfileInfo'
import { ProfileSocials } from './ProfileSocials'
import ProfileActivityList from '../containers/ProfileActivityList'
import { AVATAR_URL } from '../models'
import { images } from '../../../assets/elements'
import commonStyle from '../../../styles/common'

class ProfileComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      page: 1,
      profile: {
        count: {},
        profile: {}
      }
    }
  }

  async componentDidMount () {
    this.getData(1)
  }

  async getData (nextPage, loadMore = false) {
    const { page, profile } = this.state
    const { getProfile, profileId } = this.props
    const next = nextPage || page
    const result = await getProfile(profileId)
    if (result && result.profile) {
      this.setState({
        page: next,
        loading: false,
        profile: !loadMore ? result.profile : profile
      })
    }
  }

  render () {
    const { loading, profile } = this.state
    const { themedStyle, navigation } = this.props
    return (
      <View
        style={themedStyle.container}
      >
        <ProfileInfo
          style={[themedStyle.profileInfo, commonStyle.shadow]}
          photo={
            profile.profile.avatar
              ? { uri: `${AVATAR_URL}${profile.profile.avatar}` }
              : images.default_user
          }
          name={`${profile.profile.display_name || ''}`}
          location={`@${profile.profile.name || ''} . ${profile.profile.score || 0} spiders`}
        >
          <View style={themedStyle.parametersContainer}>
            <ProfileSocials
              followers={profile.count.followers || 0}
              following={profile.count.followings || 0}
              posts={profile.count.createdPosts || 0}
            />
          </View>
        </ProfileInfo>
        {!loading
          ? (
            <ProfileActivityList
              navigation={navigation}
              profile={profile.profile}
              style={themedStyle.feed}
            />) : null}
      </View>
    )
  }
}

export default withStyles(ProfileComponent, (theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2']
  },
  parametersContainer: {
    marginTop: 10
  },
  profileInfo: {
    heigth: 200,
    paddingHorizontal: 24,
    backgroundColor: theme['background-basic-color-1']
  },
  feed: {
    flex: 1,
    paddingVertical: 8
  }
}))
