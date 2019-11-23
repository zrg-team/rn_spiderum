import { connect } from 'react-redux'
import List from '../components/List'
import handlers from '../handlers'
import { MODULE_NAME as MODULE_CATEGORY } from '../models'

const mapDispatchToProps = (dispatch, props) => ({
  ...handlers(dispatch, props)
})

const mapStateToProps = (state, props) => {
  const type = props.type || 'hot'
  return {
    // hot: state[MODULE_HOME].hot || []
    ...state[MODULE_CATEGORY][type]
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List)
