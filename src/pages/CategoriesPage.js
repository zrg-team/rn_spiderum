import React, { Component } from 'react'
import DefaultPage from '../common/hocs/DefaultPage'
import { Layout } from 'react-native-ui-kitten'
import Categories from '../modules/category/containers/Categories'
import Modal from '../common/components/Widgets/Modal'

export default class CategoriesPage extends Component {
  componentDidMount () {
    Modal.hide()
  }

  render () {
    const { navigation } = this.props
    return (
      <DefaultPage>
        <Layout style={[{ flexGrow: 1 }]} level='2'>
          <Categories type='top' navigation={navigation} />
        </Layout>
      </DefaultPage>
    )
  }
}
