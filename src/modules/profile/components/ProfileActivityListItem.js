import React from 'react'
import {
  ImageBackground,
  TouchableOpacity
} from 'react-native'
import {
  withStyles
} from 'react-native-ui-kitten'
import { ActivityAuthoring } from '../../home/components/item/ActivityAuthoring'
import commonStyle from '../../../styles/common'

class ProfileActivityListtemComponent extends React.Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    const {
      style,
      themedStyle,
      onPress,
      photo,
      profilePhoto,
      authorName,
      date,
      likes,
      item,
      ...restProps
    } = this.props

    return (
      <TouchableOpacity
        activeOpacity={0.95}
        {...restProps}
        onPress={() => onPress && onPress(item)}
        style={[themedStyle.container, style, commonStyle.shadow]}
      >
        <ImageBackground
          style={themedStyle.photo}
          source={photo}
        />
        <ActivityAuthoring
          article={item}
          style={themedStyle.authoring}
          photo={profilePhoto}
          date={`${item.title}`}
        />
      </TouchableOpacity>
    )
  }
}

export const ProfileActivityListItem = withStyles(ProfileActivityListtemComponent, (theme) => ({
  container: {
    overflow: 'hidden',
    borderRadius: 12,
    marginHorizontal: 5
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  photo: {
    minHeight: 160
  },
  authoring: {
    marginTop: -25,
    paddingVertical: 10,
    paddingHorizontal: 10
  }
}))
