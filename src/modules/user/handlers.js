import { saveNews } from './actions'
import { updateAppIntro } from '../../common/actions/common'

export default (dispatch, props) => ({
  saveNews: (article) => {
    dispatch(saveNews(article))
  },
  updateAppIntro: (result) => {
    dispatch(updateAppIntro(result))
  }
})
