import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  withStyles
} from 'react-native-ui-kitten'
import FadeLoading from '../common/components/Widgets/FadeLoading'
import DefaultPage from '../common/hocs/DefaultPage'
import { PAGES } from '../common/routes'

class LoadingPage extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      screen: props.page || PAGES.TabGroup
    }
  }

  render () {
    const { screen } = this.state
    const { navigation, time, themedStyle } = this.props
    return (
      <DefaultPage containerStyle={themedStyle.background}>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(LoadingPage, (theme) => ({
  background: {
    backgroundColor: theme['background-basic-color-0']
  }
})))
