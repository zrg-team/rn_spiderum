import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import FadeLoading from '../common/components/Widgets/FadeLoading'
import DefaultPage from '../common/hocs/DefaultPage'
import { SCREENS } from '../common/routes'

class LoadingPage extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      screen: props.page || SCREENS.TabGroup
    }
  }

  render () {
    const { screen } = this.state
    const { navigation, time } = this.props
    return (
      <DefaultPage containerStyle={{ backgroundColor: '#FFFFFF' }}>
        <FadeLoading
          time={time}
          navigation={navigation}
          mainPage={screen}
          init
        />
      </DefaultPage>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  dispatch
})

const mapStateToProps = state => ({
  rehydrated: state._persist.rehydrated
})

export default connect(mapStateToProps, mapDispatchToProps)(LoadingPage)
