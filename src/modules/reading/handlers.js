import database from '../../libraries/Database'
import { requestLoading } from '../../common/effects'
import { ENPOINTS } from './models'
import { setFontSize } from './actions'

const cheerio = require('react-native-cheerio')

function youtubeParser (url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length === 11) ? match[7] : false
}

export function removeTags (body) {
  const regex = /(<([^>]+)>)/ig
  return body.replace(regex, '')
}

export function getBodyByDOM (body) {
  const $ = cheerio.load(body)
  const html = $('#post-content-view-edit').html()
  return html
}

export function getNews (url) {
  return requestLoading({
    url
  }).then(response => {
    return getBodyByDOM(response.data)
  })
}

export default (dispatch, props) => ({
  setFontSize: (size) => {
    dispatch(setFontSize(size))
  },
  getComments: async (id, page) => {
    try {
      return requestLoading({
        url: `${ENPOINTS.getComments}`,
        params: {
          type: 'top',
          offset: (page - 1) * 5,
          post_id: id
        }
      }).then(response => {
        return response.data
      })
    } catch (err) {
      return null
    }
  },
  getContentFromSource: async (url) => {
    try {
      const body = await getNews(url)
      return body
    } catch (err) {
      return undefined
    }
  },
  getContent: async (item) => {
    try {
      let row = item
      if (!item.body) {
        const key = item.key ||
        decodeURIComponent(`${item.fb_share_url}`.replace('https://www.facebook.com/sharer/sharer.php?u=', ''))
        const [rows] = await database.model('article').get({
          where: [['key', key]]
        })
        row = rows.rows.item(0)
      }
      if (!row || !row.body) {
        row = {}
        row.body = await getNews(item.key)
        database.model('article').insert({
          key: item.key,
          title: item.title,
          body: row.body,
          image: item.og_image_url
        })
      }

      const data = []
      const $ = cheerio.load(row.body, {
        decodeEntities: false
      })
      $('div, ul, h1, h2, h3, h4, p').each(function (index) {
        // div case
        const element = $(this)
        const image = element.find('img')

        if (image && image.length) {
          const imageDOM = $(image[0])
          const caption = $(imageDOM.find('figcaption')[0])

          return data.push({
            type: 'image',
            data: imageDOM.attr('src'),
            title: caption.text()
          })
        }
      })
      return { body: row.body, images: data }
    } catch (err) {
      console.debug('getContent', err)
      return undefined
    }
  },
  parseContent: async (item) => {
    try {
      const key = item.key ||
      decodeURIComponent(`${item.fb_share_url}`.replace('https://www.facebook.com/sharer/sharer.php?u=', ''))
      const [rows] = await database.model('article').get({
        where: [['key', key]]
      })
      const row = rows.rows.item(0)
      let data = []
      const $ = cheerio.load(row.body, {
        decodeEntities: false
      })
      $('div, ul, h1, h2, h3, h4, p').each(function (index) {
        const element = $(this)

        // case not div
        switch (element[0].name) {
          case 'h1':
            return data.push({
              type: 'text',
              data: element.text(),
              h1: 1
            })
          case 'h2':
            return data.push({
              type: 'text',
              data: element.text(),
              h2: 1
            })
          case 'h3':
            return data.push({
              type: 'text',
              data: element.text(),
              h3: 1
            })
          case 'h4':
            return data.push({
              type: 'text',
              data: element.text(),
              h4: 1
            })

          case 'ul': {
            const liItems = []
            element.find('li').each(function (index) {
              const liDOM = $(this)
              liItems.push({
                type: 'text',
                data: ` + ${liDOM.text()}`
              })
            })
            if (liItems.length) {
              data = [...data, ...liItems]
              return
            }
          }
        }

        // div case
        const image = element.find('img')

        if (image && image.length) {
          const imageDOM = $(image[0])
          const caption = $(imageDOM.find('figcaption')[0])

          return data.push({
            type: 'image',
            data: imageDOM.attr('src'),
            title: caption.text()
          })
        }

        const iframe = element.find('iframe')
        if (iframe && iframe.length) {
          const iframeDOM = $(iframe[0])
          const youtubeId = youtubeParser(iframeDOM.attr('src'))
          return data.push({
            type: 'youtube_web',
            data: youtubeId,
            fullUrl: iframeDOM
              .attr('src')
              .replace('?wmode=opaque', '')
              .replace(/https:\/\//g, '')
              .replace(/http:\/\//g, '')
              .replace(/\/\//g, '')
          })
        }

        const linkElement = element.find('a')
        if (linkElement && linkElement.length) {
          const linkDOM = $(linkElement[0])
          if (linkDOM.attr('class') === 'scrape-info') {
            return data.push({
              type: 'link',
              data: linkDOM.attr('href'),
              description: linkDOM.text()
            })
          }
        }

        if (element[0].parent.name === 'blockquote') {
          return data.push({
            type: 'blockquote',
            data: removeTags(
              element
                .html()
                .replace(/<br>/g, '\n')
                .replace(/<br \/>/g, '\n')
            )
          })
        }

        const strong = element.find('strong')
        const h1 = element.find('h1')
        const h2 = element.find('h2')
        const h3 = element.find('h3')
        const h4 = element.find('h4')
        const h5 = element.find('h5')
        const html = removeTags(
          `${element.html()}`
            .replace(/<br>/g, '\n')
            .replace(/<br \/>/g, '\n')
        )
        return data.push({
          type: 'text',
          data: html,
          strong: strong.length,
          h1: h1.length,
          h2: h2.length,
          h3: h3.length,
          h4: h4.length,
          h5: h5.length
        })
      })

      return data
    } catch (err) {
      console.debug('dataItem', err)
      return []
    }
  }
})
