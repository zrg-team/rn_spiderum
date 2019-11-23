/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, memo } from 'react'
import {
  StyleSheet,
  View,
  ScrollView
} from 'react-native'
import Markdown from 'react-native-markdown-renderer'
import { DEFAULT_TERM } from '../../../assets/text/information'
import { ContentSkeleton } from '../../../libraries/components/Skeleton'
import commonStyles from '../../../styles/common'

const MarkdownComponent = memo(({ source }) => {
  return (
    <ScrollView style={styles.scroll}>
      <Markdown
        style={styles}
        markdownStyles={{
          heading: commonStyles.txt_primary,
          heading1: commonStyles.h2,
          heading2: commonStyles.h3,
          heading3: commonStyles.h4,
          heading4: commonStyles.h5,
          heading5: commonStyles.h6,
          list_itemBullet: commonStyles.txt_primary,
          list_item: commonStyles.txt_primary
        }}
      >
        {source}
      </Markdown>
    </ScrollView>
  )
})
export default class TermsAndConditions extends Component {
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
    const { term, loading } = this.state
    return (
      <View style={styles.content}>
        <View style={styles.terms_conditions_content}>
          {loading
            ? (
              <View style={styles.loading_container}>
                <ContentSkeleton />
              </View>) : (<MarkdownComponent source={term} />)}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  list_item: {
    flex: 1,
    flexWrap: 'wrap'
  },
  terms_conditions_content: {
    flex: 9,
    marginTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: 15,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'rgba(232,236,240,1)',
    overflow: 'hidden'
  },
  scroll: {
    padding: 24,
    paddingBottom: 24,
    paddingTop: 24
  },
  txt_normal: {
    color: 'rgba(46,62,69,1)',
    lineHeight: 22,
    fontSize: 15
  },
  txt_organ: {
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 19,
    color: 'rgba(241,134,0,1)'
  },
  view_text: {
    flex: 1,
    marginHorizontal: 30,
    marginBottom: 20
  },
  content: {
    flex: 1
  },
  footer: {
    height: 30,
    marginBottom: 30,
    marginLeft: 30,
    marginRight: 30
  },
  loading_container: {
    margin: 24,
    overflow: 'hidden'
  }
})
