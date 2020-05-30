import { connect } from 'react-redux'
import TabarItem from '../components/TabarItem'
// import handlers from '../handlers'

const mapDispatchToProps = (dispatch, props) => ({
  // ...handlers(dispatch, props)
})

const mapStateToProps = (state, props) => {
  return {
    currentPage: state.session.currentPage,
    previousPage: state.common.previousPage
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabarItem)
