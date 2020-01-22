import React from 'react'
import DefaultPage from '../common/hocs/DefaultPage'
import AppIntro from '../modules/user/containers/AppIntro'

export default class AppIntroPage extends React.Component {
  componentDidMount () {
    console.timeEnd('[APPLICATION] Render')
  }

  render () {
    return (
      <DefaultPage
        containerStyle={{ paddingTop: 0 }}
      >
        <AppIntro />
      </DefaultPage>
    )
  }
}
