import i18n from 'i18n-js'
import React, { Component } from 'react'
import { View } from 'react-native'
import {
  Button,
  withStyles
} from 'react-native-ui-kitten'
import {
  CommentListItem
} from './CommentListItem'

class CommentListComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      commentPage: 1,
      loadingComment: true,
      comments: []
    }
    this.renderItem = this.renderItem.bind(this)
    this.handleLoadMoreComments = this.handleLoadMoreComments.bind(this)
    this.handleCommentsButtonPress = this.handleCommentsButtonPress.bind(this)
  }

  handleCommentsButtonPress () {
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

  componentDidMount () {
    setTimeout(() => {
      const { noComment } = this.props
      !noComment && this.getComments()
    }, 300)
  }

  async getComments (page) {
    const { article, getComments } = this.props
    const { commentPage } = this.state
    const next = page || commentPage
    if (!article._id) {
      return
    }
    const comments = await getComments(article._id, next)
    if (comments) {
      this.setState({
        loadingComment: false,
        commentPage: next,
        comments: next === 1 ? comments : [...this.state.comments, ...comments]
      })
    }
  }

  shouldComponentUpdate (nextProps) {
    const { noComment } = this.props
    return noComment !== nextProps.noComment
  }

  handleLoadMoreComments () {
    const { commentPage } = this.state
    this.setState({
      loadingComment: true
    }, () => {
      this.getComments(commentPage + 1)
    })
  }

  componentWillReceiveProps (nextProps, nextState) {
    const { noComment } = this.props
    if (
      noComment !== nextProps.noComment &&
      !nextProps.noComment &&
      (!nextState.comments || !nextState.comments.length)
    ) {
      this.getComments()
    }
  }

  renderItem (item, index) {
    const childPath = `${index}`.split('_').length || 0
    return (
      <View key={index}>
        <CommentListItem
          style={[
            this.props.themedStyle.item,
            {
              marginLeft: 5 + (childPath - 1) * 20
            }
          ]}
          data={item}
        />
        {item.child_comments &&
          item.child_comments.map((childItem, childIndex) => {
            return this.renderItem(childItem, `${index}_${childIndex}`)
          })}
      </View>
    )
  }

  render () {
    const { comments = [], loadingComment } = this.state
    const { themedStyle } = this.props

    return [
      <View key='comments' style={themedStyle.container}>
        {comments && comments.map((item, index) => {
          return this.renderItem(item, index)
        })}
      </View>,
      comments && comments.length
        ? (
          <Button
            key='commnet-load'
            disabled={loadingComment}
            onPress={this.handleLoadMoreComments}
            style={themedStyle.button}
            appearance='ghost'
            status='info'
          >
            {i18n.t('reading.loading_more_comments')}
          </Button>)
        : null
    ]
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
  },
  button: {
    marginTop: -5,
    paddingTop: 26,
    paddingBottom: 30,
    backgroundColor: theme['border-basic-color-3']
  }
}))
