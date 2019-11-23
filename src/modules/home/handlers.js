import { requestLoading } from '../../common/effects'
import { ENPOINTS, AVATAR_URL } from './models'
import { setNews, setHots, setTops } from './actions'

export function parseHtml (page, data) {
  const results = {}
  const scriptTag = /<script>(.*?)<\/script>/g.exec(data)
  const pageData = JSON.parse(`${scriptTag[1]}`.replace("window['TRANSFER_STATE'] = ", ''))
  Object.keys(pageData).forEach(key => {
    try {
      if (key.includes('populartags')) {
        results.tags = pageData[key].tags
      } else if (key.includes('getRandomPost')) {
        results.random = pageData[key]
      } else if (key.includes('getTopPosts')) {
        results.top = pageData[key].posts.items
      } else if (key.includes('getAllPosts')) {
        results.data = pageData[key].posts.items.map(item => {
          // const itemDOM = cheerio.load(item.body)
          // item.decription = itemDOM.text().substring(0, 256)
          const regex = /(<([^>]+)>)/ig
          item.decription = item.body.substring(0, 480).replace(regex, '')
          item.avatar = item.creator_id.avatar ? `${AVATAR_URL}${item.creator_id.avatar}` : null
          return item
        })
      }
    } catch (err) {
    }
  })
  // $('li.feed-post').each(function (i) {
  //   try {
  //     const item = {}
  //     const element = $(this)
  //     const author = $(element.find('.author')[0])
  //     const title = $(element.find('.title a')[0])
  //     const description = $(element.find('.body')[0])
  //     const thumb = $(element.find('.thumb img')[0])
  //     const vote = $(element.find('.vote-count')[0])
  //     const comment = $(element.find('.text')[0])
  //     const category = $(element.find('.category-name')[0])
  //     if (!title.attr('href')) {
  //       return
  //     }
  //     if (author && author.find) {
  //       const authorAvatar = $(author.find('img')[0])
  //       const authorLink = $(author.find('.avatar')[0])
  //       const itemDate = $(author.find('.date')[0])
  //       const reading = $(author.find('.created span')[1])
  //       const username = $(author.find('.username')[0])
  //       item.author = {
  //         avatar: authorAvatar.attr('src'),
  //         url: authorLink.attr('href'),
  //         date: itemDate.text(),
  //         reading: reading.text(),
  //         username: username.text()
  //       }
  //     }
  //     item.title = title.text()
  //     item.category = category.text()
  //     item.url = title.attr('href')
  //     item.description = description.text()
  //     item.image = thumb.attr('src')
  //     item.vote = vote.text()
  //     item.comment = comment.text()
  //     results.push(item)
  //   } catch (err) {
  //   }
  // })
  return results
}
export function getNews (page = 1, type) {
  let url = ''
  switch (type) {
    case 'hot':
      url = ENPOINTS.hot
      break
    case 'news':
      url = ENPOINTS.news
      break
    case 'top':
      url = ENPOINTS.top
      break
  }
  return requestLoading({
    url,
    params: {
      page
    }
  }).then(response => {
    return parseHtml(page, response.data)
  })
}

export default (dispatch, props) => ({
  getNews: async (page, type) => {
    try {
      const results = await getNews(page, type)
      switch (type) {
        case 'hot':
          dispatch(setHots({ page, results }))
          break
        case 'news':
          dispatch(setNews({ page, results }))
          break
        case 'top':
          dispatch(setTops({ page, results }))
          break
      }
      return results
    } catch (err) {
      console.log('error', err)
      return undefined
    }
  }
})
