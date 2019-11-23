import React from 'react'
import {
  View
} from 'react-native'
import {
  Avatar,
  Text,
  withStyles
} from 'react-native-ui-kitten'
import { textStyle } from '../../../styles/common'

class ProfileInfoComponent extends React.Component {
  render () {
    const { style, themedStyle, photo, name, location, children, ...restProps } = this.props

    return (
      <View
        style={[themedStyle.container, style]}
        {...restProps}
      >
        <Avatar
          size='giant'
          source={photo}
        />
        <View style={themedStyle.detailsContainer}>
          <Text
            style={themedStyle.nameLabel}
            category='h5'
          >
            {name}
          </Text>
          <Text
            style={themedStyle.locationLabel}
            appearance='hint'
            category='s2'
          >
            {location}
          </Text>
          {children}
        </View>
      </View>
    )
  }
}

export const ProfileInfo = withStyles(ProfileInfoComponent, (theme) => ({
  container: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 20
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 24
  },
  nameLabel: textStyle.headline,
  locationLabel: {
    ...textStyle.subtitle
  }
}))
