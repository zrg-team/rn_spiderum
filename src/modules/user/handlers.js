import { saveNews, removeNews } from './actions'
import { updateAppIntro } from '../../common/actions/common'

export default (dispatch, props) => ({
  saveNews: (article) => {
    dispatch(saveNews(article))
  },
  removeNews: (article) => {
    dispatch(removeNews(article))
  },
  updateAppIntro: (result) => {
    dispatch(updateAppIntro(result))
  }
})
