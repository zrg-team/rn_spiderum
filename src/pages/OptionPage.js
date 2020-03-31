import React, { Component } from 'react'
import { Layout } from 'react-native-ui-kitten'
import DefaultPage from '../common/hocs/DefaultPage'
import Carousel from '../modules/option/containers/Carousel'
import Options from '../modules/option/containers/Options'
import Modal from '../common/components/Widgets/Modal'

export default class OptionPage extends Component {
  componentDidMount () {
    Modal.hide()
  }

  render () {
    const { navigation } = this.props
    return (
      <DefaultPage>
        <Layout
          level='2'
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Carousel />
          <Options navigation={navigation} />
        </Layout>
      </DefaultPage>
    )
  }
}
