import { connect } from 'react-redux'
import DefaultHeader from '../components/DefaultHeader'
// import handlers from '../handlers'

const mapDispatchToProps = (dispatch, props) => ({
  // ...handlers(dispatch, props)
})

const mapStateToProps = (state, props) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultHeader)
