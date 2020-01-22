import { connect } from 'react-redux'
import ReadingBeta from '../components/ReadingBeta'
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

export default connect(mapStateToProps, mapDispatchToProps)(ReadingBeta)
