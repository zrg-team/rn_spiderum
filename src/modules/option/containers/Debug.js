import { connect } from 'react-redux'
import Debug from '../components/Debug'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = (state, props) => {
  return {
    state
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Debug)
