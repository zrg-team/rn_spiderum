import { connect } from 'react-redux'
import Reading from '../components/Reading'
import handlers from '../handlers'
import userHandlers from '../../user/handlers'
import { MODULE_NAME as MODULE_READING } from '../models'

const mapDispatchToProps = (dispatch, props) => ({
  ...handlers(dispatch, props),
  ...userHandlers(dispatch, props)
})

const mapStateToProps = (state, props) => {
  return {
    fontSize: state[MODULE_READING].fontSize || 14
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reading)
