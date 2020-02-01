import { requestLoading } from '../../common/effects'
import { setNews, setHots, setTops } from './actions'
import { parseHtml } from '../home/handlers'

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
