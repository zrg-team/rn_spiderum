import React from 'react'
import {
  View
} from 'react-native'
import {
  withStyles
} from 'react-native-ui-kitten'
import ViewPager from '@react-native-community/viewpager'
import Reading from '../containers/Reading'

class ReadingContainerComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inital: props.inital
    }
    this.handlePageSelected = this.handlePageSelected.bind(this)
    this.setPage = this.setPage.bind(this)
    this.setRef = this.setRef.bind(this)
    this.viewPager = null
  }

  setRef (ref) {
    this.viewPager = ref
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { data } = this.props
    return data.length !== nextProps.data.length
  }

  setPage (page) {
    try {
      this.refs.viewPager.setPageWithoutAnimation(page)
    } catch (err) {
      console.log('error', err)
    }
  }

  handlePageSelected ({ nativeEvent }) {
    const { page, onSelectArticle } = this.props
    if (page !== nativeEvent.position) {
      let nextIndex = nativeEvent.position
      if (page > nativeEvent.position) {
        nextIndex -= 1
      } else {
        nextIndex += 1
      }
      onSelectArticle(nextIndex, nativeEvent.position, this.setPage)
    }
  }

  render () {
    const { inital } = this.state
    const { page, themedStyle, data, navigation } = this.props
    return (
      <ViewPager
        pageMargin={10}
        ref='viewPager'
        style={themedStyle.viewPager}
        initialPage={page}
        onPageSelected={this.handlePageSelected}
      >
        {data.map((item, index) => {
          return (
            <View style={themedStyle.viewPagerItem} key={index}>
              <Reading
                noComment={page !== index}
                noTransition={index !== inital}
                article={item}
                navigation={navigation}
              />
            </View>
          )
        })}
      </ViewPager>
    )
  }
}

export default withStyles(ReadingContainerComponent, (theme) => ({
  viewPager: {
    flex: 1,
    heigth: '100%'
  },
  viewPagerItem: {
    heigth: '100%'
  }
}))
