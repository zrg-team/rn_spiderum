import { requestLoading } from '../../common/effects'
import { AVATAR_URL } from './models'
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
      } else if (key.includes('category')) {
        results.data = pageData[key].posts.items.map(item => {
          // const itemDOM = cheerio.load(item.body)
          // item.decription = itemDOM.text().substring(0, 256)
          item.avatar = item.creator_id.avatar ? `${AVATAR_URL}${item.creator_id.avatar}` : null
          return item
        })
      }
    } catch (err) {
    }
  })
  return results
}

function getTypeUrl (type, url) {
  if (type === 'news') {
    type = 'new'
  }
  return `${url}/${type}`
}

export function getNews (page = 1, type, url) {
  return requestLoading({
    url: getTypeUrl(type, url),
    params: {
      page
    }
  }).then(response => {
    return parseHtml(page, response.data)
  })
}

export default (dispatch, props) => ({
  getNews: async (page, type, url) => {
    try {
      const results = await getNews(page, type, url)
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
