import React from 'react'
import {
  withStyles
} from 'react-native-ui-kitten'
import { ActivityBar } from './ActivityBar'
import { CommentsButton } from './CommentsButton'
import { PointButton } from './PointButton'
import { ViewsButton } from './ViewsButton'
import { ReactionBar } from './ReactionBar'

class ArticleActivityBarComponent extends React.Component {
  render () {
    const {
      themedStyle,
      textStyle,
      comments,
      point,
      views,
      onViewPress,
      onCommentPress,
      children,
      ...restProps
    } = this.props

    return (
      <ActivityBar {...restProps}>
        {children}
        <ReactionBar>
          {views !== undefined
            ? (
              <ViewsButton
                textStyle={textStyle}
                activeOpacity={0.75}
              >
                {`${views}`}
              </ViewsButton>
            ) : null}
          {comments !== undefined
            ? (
              <CommentsButton
                textStyle={textStyle}
                activeOpacity={0.75}
              >
                {`${comments}`}
              </CommentsButton>
            ) : null}
          {point !== undefined
            ? (
              <PointButton
                textStyle={textStyle}
                activeOpacity={0.75}
              >
                {`${point}`}
              </PointButton>
            ) : null}
        </ReactionBar>
      </ActivityBar>
    )
  }
}

export const ArticleActivityBar = withStyles(ArticleActivityBarComponent, (theme) => ({
}))
