import React from 'react'
import {
  TouchableOpacity,
  ImageBackground,
  View
} from 'react-native'
import {
  Text,
  withStyles
} from 'react-native-ui-kitten'
import { ArticleActivityBar } from '../../home/components/item/ArticleActivityBar'
import { textStyle } from '../../../styles/common'
import { images } from '../../../assets/elements'

class NewsItemComponent extends React.Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    const {
      style,
      themedStyle,
      article,
      itemIndex,
      shouldHaveAnimation,
      animationDeplay,
      onPressItem,
      onPressAuthoring,
      ...restProps
    } = this.props
    return (
      <TouchableOpacity
        activeOpacity={0.95}
        {...restProps}
        style={[themedStyle.container, style]}
        onPress={() => onPressItem(article, itemIndex)}
      >
        <ImageBackground
          style={themedStyle.photo}
          source={article.og_image_url ? { uri: article.og_image_url } : images.default_image}
        />
        <View style={themedStyle.infoContainer}>
          <Text
            numberOfLines={3}
            style={themedStyle.titleLabel}
            category='h6'
          >
            {article.title}
          </Text>
          <ArticleActivityBar
            onPress={() => onPressAuthoring && onPressAuthoring(article, itemIndex)}
            style={themedStyle.activityContainer}
            comments={article.comment_count}
            views={article.views_count}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

export default withStyles(NewsItemComponent, (theme) => ({
  container: {
    flexDirection: 'row',
    minHeight: 150
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: theme['border-basic-color-3']
  },
  activityContainer: {
    marginTop: 24
  },
  photo: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  titleLabel: {
    flex: 1,
    ...textStyle.headline
  }
}))
