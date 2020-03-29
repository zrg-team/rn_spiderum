import React, { Component } from 'react'
import { View } from 'react-native'
import DefaultPage from '../common/hocs/DefaultPage'

let MainComponent = null
export default class DebugPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  componentDidMount () {
    MainComponent = require('../modules/option/containers/Debug').default
    this.setState({
      loading: false
    })
  }

  render () {
    const { loading } = this.state
    const { navigation } = this.props
    return (
      <DefaultPage>
        <View style={{ width: '100%', height: '100%' }}>
          {!loading && MainComponent ? <MainComponent navigation={navigation} /> : null}
        </View>
      </DefaultPage>
    )
  }
}
