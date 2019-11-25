import React, { Component } from 'react'
import i18n from 'i18n-js'
import DefaultPage from '../common/hocs/DefaultPage'
import DefaultHeader from '../common/containers/DefaultHeader'
import { Layout } from 'react-native-ui-kitten'
import ReadingContainer from '../modules/reading/containers/ReadingContainer'
import Reading from '../modules/reading/containers/Reading'

export default class NewsPage extends Component {
  constructor (props) {
    super(props)
    const { navigation } = props
    const itemIndex = navigation.getParam('itemIndex', null)
    this.state = {
      page: null,
      article: navigation.getParam('article', {}),
      type: navigation.getParam('type', null),
      category: navigation.getParam('category', false),
      itemIndex,
      dataIndex: !isNaN(itemIndex)
        ? [itemIndex - 1, itemIndex, itemIndex + 1].filter(item => !isNaN(item) && item >= 0)
        : []
    }
    this.viewRef = null
    this.handleSelectArticle = this.handleSelectArticle.bind(this)
  }

  handleSelectArticle (nextIndex, page, setPage) {
    const { dataIndex } = this.state
    const nextPage = page

    if (nextIndex === -1 && dataIndex[0] - 1 >= 0) {
      // dataIndex.unshift(dataIndex[0] - 1)
      // nextPage = 1
      // setTimeout(() => {
      //   setPage && setPage(nextPage)
      // }, 100)
      return this.setState({
        page: nextPage
      })
    } else if (nextIndex === dataIndex.length) {
      dataIndex.push(dataIndex[nextIndex - 1] + 1)
    } else {
      return this.setState({
        page: nextPage
      })
    }
    this.setState({
      page: nextPage,
      dataIndex: [...dataIndex]
    })
  }

  render () {
    const { navigation } = this.props
    const { page, article, itemIndex, type, category, dataIndex } = this.state

    return (
      <DefaultPage ref={ref => { this.viewRef = ref }}>
        <DefaultHeader
          transition={false}
          title={i18n.t('pages.reading').toUpperCase()}
          navigation={navigation}
        />
        <Layout style={[{ flexGrow: 1 }]} level='2'>
          {itemIndex !== null
            ? (
              <ReadingContainer
                page={page}
                dataIndex={dataIndex}
                onSelectArticle={this.handleSelectArticle}
                article={article}
                itemIndex={itemIndex}
                type={type}
                category={category}
                navigation={navigation}
              />)
            : (
              <Reading
                type={type}
                noComment={false}
                noTransition
                article={article}
                navigation={navigation}
              />
            )}
        </Layout>
      </DefaultPage>
    )
  }
}
