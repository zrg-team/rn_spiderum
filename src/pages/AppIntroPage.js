import React from 'react'
import DefaultPage from '../common/hocs/DefaultPage'
import AppIntro from '../modules/user/containers/AppIntro'

export default class AppIntroPage extends React.Component {
  render () {
    return (
      <DefaultPage>
        <AppIntro />
      </DefaultPage>
    )
  }
}
