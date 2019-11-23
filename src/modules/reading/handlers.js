import { requestLoading } from '../../common/effects'
import { ENPOINTS } from './models'
import { setFontSize } from './actions'
const cheerio = require('react-native-cheerio')

function youtubeParser (url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length === 11) ? match[7] : false
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
  parseContent: (body) => {
    try {
      const data = []
      const $ = cheerio.load(body)
      $('div').each(function (index) {
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

        const strong = element.find('strong')
        const h1 = element.find('h1')
        const h2 = element.find('h2')
        const h3 = element.find('h3')
        const h4 = element.find('h4')
        const h5 = element.find('h5')
        return data.push({
          type: 'text',
          data: element.text(),
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
      return []
    }
  }
})
