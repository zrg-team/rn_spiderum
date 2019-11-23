import React from 'react'
import {
  TouchableOpacity,
  View
} from 'react-native'
import { Text, withStyles } from 'react-native-ui-kitten'
import { textStyle } from '../../../styles/common'

class ProfileSocialsComponent extends React.Component {
  render () {
    const { style, themedStyle, textStyle: derivedTextStyle, followers, following, posts, ...restProps } = this.props

    return (
      <View
        {...restProps}
        style={[themedStyle.container, style]}
      >
        <TouchableOpacity
          activeOpacity={0.65}
          style={themedStyle.parameterContainer}
          onPress={this.onFollowersButtonPress}
        >
          <Text style={[themedStyle.valueLabel, derivedTextStyle]}>{`${followers}`}</Text>
          <Text
            style={[themedStyle.hintLabel, derivedTextStyle]}
            appearance='hint'
            category='s2'
          >
            Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.65}
          style={themedStyle.parameterContainer}
          onPress={this.onFollowingButtonPress}
        >
          <Text style={[themedStyle.valueLabel, derivedTextStyle]}>{`${following}`}</Text>
          <Text
            style={[themedStyle.hintLabel, derivedTextStyle]}
            appearance='hint'
            category='s2'
          >
            Following
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.65}
          style={themedStyle.parameterContainer}
          onPress={this.onPostsButtonPress}
        >
          <Text style={[themedStyle.valueLabel, derivedTextStyle]}>{`${posts}`}</Text>
          <Text
            style={[themedStyle.hintLabel, derivedTextStyle]}
            appearance='hint'
            category='s2'
          >
            Posts
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export const ProfileSocials = withStyles(ProfileSocialsComponent, (theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  parameterContainer: {
    alignItems: 'center'
  },
  valueLabel: textStyle.caption2,
  hintLabel: textStyle.subtitle
}))
