import { connect } from 'react-redux'
import Bookmark from '../components/Bookmark'
import handlers from '../handlers'
import { MODULE_NAME as MODULE_USER } from '../models'

const mapDispatchToProps = (dispatch, props) => ({
  ...handlers(dispatch, props)
})

const mapStateToProps = (state, props) => {
  return {
    data: state[MODULE_USER].bookmark || []
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bookmark)
