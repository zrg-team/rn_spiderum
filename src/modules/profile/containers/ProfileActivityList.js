import { connect } from 'react-redux'
import { ProfileActivityList } from '../components/ProfileActivityList'
import handlers from '../handlers'
import { MODULE_NAME as MODULE_PROFILE } from '../models'

const mapDispatchToProps = (dispatch, props) => ({
  ...handlers(dispatch, props)
})

const mapStateToProps = (state, props) => {
  return {
    posts: state[MODULE_PROFILE].news
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileActivityList)
