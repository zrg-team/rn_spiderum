import { toggleUIMode } from './actions'

export default (dispatch, props) => ({
  toggleUIMode: () => {
    dispatch(toggleUIMode())
  }
})
