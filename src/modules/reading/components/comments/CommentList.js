import React, { Component } from 'react'
import { View } from 'react-native'
import {
  withStyles
} from 'react-native-ui-kitten'
import {
  CommentListItem
} from './CommentListItem'

class CommentListComponent extends Component {
  constructor (props) {
    super(props)
    this.renderItem = this.renderItem.bind(this)
  }

  onItemMorePress (index) {
  }

  renderComment (item, index) {
    return (
      <CommentListItem
        key={index}
        style={this.props.themedStyle.item}
        data={item}
      />
    )
  }

  renderItem (item, index) {
    const childPath = `${index}`.split('_').length || 0
    return (
      <>
        <CommentListItem
          key={index}
          style={[
            this.props.themedStyle.item,
            {
              marginLeft: childPath * 20
            }
          ]}
          data={item}
        />
        {item.child_comments &&
          item.child_comments.map((childItem, childIndex) => {
            return this.renderItem(childItem, `${index}_${childIndex}`)
          })}
      </>
    )
  }

  render () {
    const { data, themedStyle } = this.props

    return (
      <View style={themedStyle.container}>
        {data && data.map((item, index) => {
          return this.renderItem(item, index)
        })}
      </View>
    )
  }
}

export const CommentList = withStyles(CommentListComponent, (theme) => ({
  container: {
    backgroundColor: theme['border-basic-color-3']
  },
  item: {
    marginTop: 5,
    marginHorizontal: 5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: theme['border-basic-color-2']
  }
}))
