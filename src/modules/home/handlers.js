import { requestLoading } from '../../common/effects'
import { ENPOINTS, AVATAR_URL } from './models'
import { setNews, setHots, setTops } from './actions'
import database from '../../libraries/Database'

export function parseHtml (page, data) {
  const results = {}
  const scriptTag = /<script>(.*?)<\/script>/g.exec(data)
  const pageData = JSON.parse(`${scriptTag[1]}`.replace("window['TRANSFER_STATE'] = ", ''))
  const deleteKeys = []
  const items = []
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
          const url = decodeURIComponent(`${item.fb_share_url}`.replace('https://www.facebook.com/sharer/sharer.php?u=', ''))
          items.push({
            key: url,
            title: item.title,
            body: item.body,
            image: item.og_image_url
          })
          deleteKeys.push(url)
          delete item.body
          item.key = url
          return item
        })
      }
    } catch (err) {
    }
  })
  database.model('article').delete({
    where: [['key', 'in', deleteKeys]]
  }).then((response) => {
    return database.model('article').bulkInsert(items)
  }).catch((error) => {
    console.log('error', error)
  })

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
