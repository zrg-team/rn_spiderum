import { requestLoading } from '../../common/effects'
import { ENPOINTS, AVATAR_URL, DEFAULT_POST_URL } from './models'
import { setNews, setHots, setTops, setSearchResults } from './actions'
import database from '../../libraries/Database'

const cheerio = require('react-native-cheerio')

function handleItem (item) {
  let url = ''
  if (item.slug) {
    url = `${DEFAULT_POST_URL}/${item.slug}`
    item.key = url
  } else {
    item.avatar = item.creator_id.avatar ? `${AVATAR_URL}${item.creator_id.avatar}` : null
    url = decodeURIComponent(`${item.fb_share_url}`.replace('https://www.facebook.com/sharer/sharer.php?u=', ''))
  }
  const regex = /(<([^>]+)>)/ig
  item.decription = `${item.body}`.substring(0, 1000).replace(regex, '')
  delete item.body
  return {
    item,
    url,
    databaseItem: {
      key: url,
      title: item.title,
      body: item.body,
      image: item.og_image_url
    }
  }
}

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
        results.random = pageData[key].map(item => {
          const result = handleItem(item)
          items.push(result.databaseItem)
          deleteKeys.push(result.url)
          item.key = result.url
          return result.item
        })
      } else if (key.includes('getTopPosts')) {
        results.top = pageData[key].posts.items.map(item => {
          const result = handleItem(item)
          items.push(result.databaseItem)
          deleteKeys.push(result.url)
          item.key = result.url
          return result.item
        })
      } else if (key.includes('getAllPosts')) {
        results.data = pageData[key].posts.items.map(item => {
          const result = handleItem(item)
          items.push(result.databaseItem)
          deleteKeys.push(result.url)
          item.key = result.url
          return result.item
        })
      } else if (key.includes('category')) {
        results.data = pageData[key].posts.items.map(item => {
          const result = handleItem(item)
          items.push(result.databaseItem)
          deleteKeys.push(result.url)
          item.key = result.url
          return result.item
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
    console.debug('parseHtml', error)
  })

  return results
}

export function parseHtmlByDOM (body) {
  const results = { data: [] }
  const $ = cheerio.load(body)
  $('li.feed-post').each(function (i) {
    try {
      const item = {}
      const element = $(this)
      const author = $(element.find('.author')[0])
      const title = $(element.find('.title a')[0])
      const description = $(element.find('.body')[0])
      const thumb = $(element.find('.thumb img')[0])
      const vote = $(element.find('.vote-count')[0])
      const comment = $(element.find('.text')[0])
      const category = $(element.find('.category-name')[0])
      const created = $(element.find('.created')[0])
      if (title.attr('href')) {
        if (author && author.find) {
          const authorAvatar = $(author.find('img')[0])
          const authorLink = $(author.find('.avatar')[0])
          const itemDate = $(author.find('.date')[0])
          const reading = $(author.find('.created span')[1])
          const username = $(author.find('.username')[0])
          item.creator_id = {
            avatar: authorAvatar.attr('src'),
            url: authorLink.attr('href'),
            date: itemDate.text(),
            reading: reading.text(),
            username: username.text(),
            display_name: username.text()
          }
        }
        const timeItem = $(created.find('span')[0])
        const timeReading = $(created.find('span')[1])
        item.time_formated = `${timeItem.text().trim()} ${timeReading.text().trim()}`
        item.title = title.text().trim()
        item.key = `https://spiderum.com${title.attr('href')}`
        item.category = category.text()
        item.url = `https://spiderum.com${title.attr('href')}`
        item.description = description.text()
        item.image = thumb.attr('src')
        item.vote = vote.text()
        item.comment = comment.text()
        results.data.push(item)
      }
    } catch (err) {
    }
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

export function searchNews (page = 1, params) {
  return requestLoading({
    url: ENPOINTS.search,
    params: {
      page,
      type: 'post',
      ...params
    }
  }).then(response => {
    return parseHtmlByDOM(response.data)
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
      console.debug('getNews', err)
      return undefined
    }
  },
  searchNews: async (page, params) => {
    try {
      const results = await searchNews(page, params)
      dispatch(setSearchResults({ page, results }))
      return results
    } catch (err) {
      console.debug('searchNews', err)
      return undefined
    }
  }
})
