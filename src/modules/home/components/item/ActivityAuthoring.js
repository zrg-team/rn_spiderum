import React from 'react'
import {
  View,
  TouchableOpacity
} from 'react-native'
import { SharedElement } from 'react-navigation-shared-element'
// import { Transition } from 'react-navigation-fluid-transitions'
import { Text, Avatar, withStyles } from 'react-native-ui-kitten'
import { textStyle } from '../../../../styles/common'

class ActivityAuthoringComponent extends React.Component {
  render () {
    const {
      noTransition = false,
      article = {},
      style,
      themedStyle,
      photo,
      name,
      date,
      photoStyle,
      onPress,
      ...restProps
    } = this.props
    let Content = null
    if (noTransition) {
      Content = (
        <View style={themedStyle.authorInfoContainer}>
          <Text style={themedStyle.authorNameLabel}>{name}</Text>
          <Text
            style={themedStyle.dateLabel}
            appearance='hint'
            category='p2'
            numberOfLines={2}
          >
            {date}
          </Text>
        </View>
      )
    } else {
      Content = (
        <SharedElement id={`${article.creator_id._id}_${article._id}`}>
          <View style={themedStyle.authorInfoContainer}>
            <Text style={themedStyle.authorNameLabel}>{name}</Text>
            <Text
              style={themedStyle.dateLabel}
              appearance='hint'
              category='p2'
              numberOfLines={2}
            >
              {date}
            </Text>
          </View>
        </SharedElement>
      )
    }
    return (
      <TouchableOpacity
        {...restProps}
        onPress={onPress ? () => onPress(article) : undefined}
        style={[themedStyle.container, style]}
      >
        {photo
          ? (
            <SharedElement id={`${article._id}_${article.avatar}_avatar`}>
              <Avatar
                style={[themedStyle.authorPhoto, photoStyle]}
                source={photo}
              />
            </SharedElement>
          ) : <View style={themedStyle.noPhoto} />}
        {Content}
      </TouchableOpacity>
    )
  }
}

export const ActivityAuthoring = withStyles(ActivityAuthoringComponent, (theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  authorInfoContainer: {
    marginLeft: 16
  },
  authorPhoto: {
    margin: 0,
    width: 35,
    height: 35
  },
  authorNameLabel: {
    ...textStyle.subtitle
  },
  dateLabel: {
    overflow: 'hidden',
    ...textStyle.paragraph
  },
  noPhoto: {
    width: 35
  }
}))
