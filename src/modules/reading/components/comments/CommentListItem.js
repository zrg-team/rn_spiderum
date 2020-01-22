import React from 'react'
import moment from 'moment'
import {
  TouchableOpacity,
  View
} from 'react-native'
import {
  ActivityAuthoring
} from '../../../home/components/item/ActivityAuthoring'
import {
  ArticleActivityBar
} from '../../../home/components/item/ArticleActivityBar'
import { textStyle } from '../../../../styles/common'
import {
  withStyles,
  ListItem,
  Text
} from 'react-native-ui-kitten'
import { AVATAR_URL } from '../../models'
import { images } from '../../../../assets/elements'

class CommentListItemComponent extends React.Component {
  handleMorePress () {
    // this.props.onMorePress(this.props.index);
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { style, themedStyle, data, ...restProps } = this.props
    const regex = /(<([^>]+)>)/ig
    const body = data.body.replace(regex, '')
    return (
      <ListItem
        style={[themedStyle.container, style]}
        {...restProps}
      >
        <View style={themedStyle.authorContainer}>
          <ActivityAuthoring
            style={themedStyle.activityAuthoring}
            photo={data.user_id.avatar
              ? { uri: `${AVATAR_URL}${data.user_id.avatar}` }
              : images.default_user}
            name={`${data.user_id.display_name}`}
            date={moment(data.created_at).fromNow()}
            article={{
              creator_id: data.user_id
            }}
          />
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={this.handleMorePress}
          />
        </View>
        <Text
          style={themedStyle.commentLabel}
          category='s1'
        >
          {body}
        </Text>
        <ArticleActivityBar
          style={themedStyle.activityContainer}
          comments={data.child_count}
          point={data.up_point}
        />
      </ListItem>
    )
  }
}

export const CommentListItem = withStyles(CommentListItemComponent, (theme) => ({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 10,
    backgroundColor: theme['background-basic-color-1']
  },
  activityContainer: {
    backgroundColor: theme['background-basic-color-2']
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  activityAuthoring: {
    flex: 1
  },
  moreIcon: {
    width: 18,
    height: 18,
    tintColor: theme['text-hint-color']
  },
  commentLabel: {
    marginVertical: 14,
    ...textStyle.paragraph
  }
}))
