/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, memo } from 'react'
import {
  View,
  ScrollView
} from 'react-native'
import { withStyles } from 'react-native-ui-kitten'
import Markdown from 'react-native-markdown-renderer'
import { DEFAULT_TERM } from '../../../assets/text/information'
import { ContentSkeleton } from '../../../libraries/components/Skeleton'
import commonStyles from '../../../styles/common'

const MarkdownComponent = memo(({ themedStyle, source }) => {
  return (
    <ScrollView style={themedStyle.scroll}>
      <Markdown
        style={themedStyle}
      >
        {source}
      </Markdown>
    </ScrollView>
  )
})
class TermsAndConditionsComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      term: '',
      loading: true
    }
    this.termConditionText = ''
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        term: DEFAULT_TERM,
        loading: false
      })
    }, 50)
  }

  render () {
    const { themedStyle } = this.props
    const { term, loading } = this.state
    return (
      <View style={themedStyle.content}>
        <View style={themedStyle.terms_conditions_content}>
          {loading
            ? (
              <View style={themedStyle.loading_container}>
                <ContentSkeleton />
              </View>) : (<MarkdownComponent themedStyle={themedStyle} source={term} />)}
        </View>
      </View>
    )
  }
}

export default withStyles(TermsAndConditionsComponent, (theme) => ({
  terms_conditions_content: {
    flex: 9,
    marginTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: 15,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: theme['border-basic-color-1'],
    overflow: 'hidden'
  },
  scroll: {
    padding: 24,
    paddingBottom: 24,
    paddingTop: 24
  },
  content: {
    flex: 1
  },
  loading_container: {
    margin: 24,
    overflow: 'hidden'
  },
  text: { color: theme['text-basic-color'] },
  heading: { color: theme['text-basic-color'], ...commonStyles.txt_primary },
  heading1: { color: theme['text-basic-color'], ...commonStyles.h2 },
  heading2: { color: theme['text-basic-color'], ...commonStyles.h3 },
  heading3: { color: theme['text-basic-color'], ...commonStyles.h4 },
  heading4: { color: theme['text-basic-color'], ...commonStyles.h5 },
  heading5: { color: theme['text-basic-color'], ...commonStyles.h6 },
  list_itemBullet: { color: theme['text-basic-color'], ...commonStyles.txt_primary },
  list_item: { color: theme['text-basic-color'], ...commonStyles.txt_primary }
}))
