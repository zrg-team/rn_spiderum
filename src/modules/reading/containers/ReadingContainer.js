import { connect } from 'react-redux'
import ReadingContainer from '../components/ReadingContainer'
import handlers from '../handlers'
import { MODULE_NAME as MODULE_CATEGORY } from '../../category/models'
import { MODULE_NAME as MODULE_HOME } from '../../home/models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'

const mapDispatchToProps = (dispatch, props) => ({
  ...handlers(dispatch, props)
})

const mapStateToProps = (state, props) => {
  const { article, type, category, dataIndex, itemIndex } = props
  let inital = 0
  try {
    let moduleName = MODULE_HOME

    if (category) {
      moduleName = MODULE_CATEGORY
    }
    if (type === 'bookmark') {
      moduleName = MODULE_USER
    }
    const dataType = state[moduleName][type] || {}
    const sourceData = Array.isArray(dataType)
      ? dataType || []
      : dataType.data ? dataType.data : []
    const data = dataIndex.map(index => {
      return sourceData[index]
    }).filter(item => item)
    if (data.length === 3 || (data.length === 2 && itemIndex !== 0)) {
      inital = 1
    }
    return {
      inital,
      data,
      page: props.page === null ? inital : props.page
    }
  } catch (err) {
    return {
      inital,
      data: [
        article
      ],
      page: props.page === null ? inital : props.page
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReadingContainer)
