import React, { Component } from 'react'
import DefaultPage from '../common/hocs/DefaultPage'
import ReadingContainer from '../modules/reading/containers/ReadingContainer'
import ReadingBeta from '../modules/reading/containers/ReadingBeta'
import { getRouteParams } from '../common/utils/navigation'

export default class NewsPage extends Component {
  constructor (props) {
    super(props)
    const itemIndex = getRouteParams('itemIndex', props, null)
    this.state = {
      page: null,
      article: getRouteParams('article', props, {}),
      type: getRouteParams('type', props, null),
      category: getRouteParams('category', props, false),
      itemIndex,
      dataIndex: !isNaN(itemIndex)
        ? [itemIndex - 1, itemIndex, itemIndex + 1].filter(item => !isNaN(item) && item >= 0)
        : []
    }
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
      <DefaultPage
        containerStyle={{ paddingTop: 0 }}
      >
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
            <ReadingBeta
              type={type}
              noComment={false}
              noTransition
              article={article}
              navigation={navigation}
            />
          )}
      </DefaultPage>
    )
  }
}
