import { connect } from 'react-redux'
import Carousel from '../components/Carousel'
import handlers from '../handlers'
import { MODULE_NAME as MODULE_HOME } from '../../home/models'

const mapDispatchToProps = (dispatch, props) => ({
  ...handlers(dispatch, props)
})

const mapStateToProps = (state, props) => {
  const data = state[MODULE_HOME].hot || {}
  return {
    data: data.random || []
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Carousel)
