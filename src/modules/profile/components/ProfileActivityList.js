import React from 'react'
import {
  List,
  withStyles
} from 'react-native-ui-kitten'
import {
  ProfileActivityListItem
} from './ProfileActivityListItem'
import { AVATAR_URL } from '../models'
import { images } from '../../../assets/elements'
import { navigationPush, pages } from '../../../common/utils/navigation'

class ProfileActivityListComponent extends React.Component {
  constructor (props) {
    super(props)
    this.renderItem = this.renderItem.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
    this.renderListItemElement = this.renderListItemElement.bind(this)
    this.handlePressItem = this.handlePressItem.bind(this)
  }

  handlePressItem (item) {
    const { navigation } = this.props
    navigationPush(navigation, pages().Reading, { article: item })
  }

  keyExtractor (item, index) {
    return `${item._id}_${index}`
  }

  renderListItemElement (item) {
    const { themedStyle, profile } = this.props
    item.creator_id = profile
    return (
      <ProfileActivityListItem
        item={item}
        style={themedStyle.item}
        photo={
          item.og_image_url
            ? { uri: item.og_image_url }
            : images.default_image
        }
        profilePhoto={
          profile.avatar
            ? { uri: `${AVATAR_URL}${profile.avatar}` }
            : images.default_user
        }
        authorName={`${profile.display_name || ''}`}
        date={item.created_at}
        likes={item.comment_count}
        onPress={this.handlePressItem}
      />
    )
  }

  renderItem (info) {
    const { item, index } = info

    const listItemElement = this.renderListItemElement(item)

    return React.cloneElement(listItemElement, { index })
  }

  render () {
    const { posts, style } = this.props
    return (
      <List
        data={posts}
        style={style}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    )
  }
}

export const ProfileActivityList = withStyles(ProfileActivityListComponent, (theme) => ({
  item: {
    marginVertical: 8,
    backgroundColor: theme['background-basic-color-1']
  }
}))
