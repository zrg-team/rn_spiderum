import React, { Component } from 'react'
import i18n from 'i18n-js'
import {
  View,
  Text,
  Linking,
  TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { withStyles } from 'react-native-ui-kitten'
import BottomSheet from '../../../common/components/Widgets/BottomSheet'
import Information from './Information'
import { navigationPush, screens } from '../../../common/utils/navigation'

class OptionsComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      page: 1,
      loading: true,
      refreshing: false
    }

    this.onPressOption = this.onPressOption.bind(this)
  }

  onPressOption (option) {
    const { navigation } = this.props
    switch (option) {
      case 'bookmark':
        navigationPush(navigation, screens().Bookmark)
        break
      case 'about':
        BottomSheet.show(<Information />)
        break
      case 'spiderum':
        Linking.openURL('https://spiderum.com/')
          .catch(() => {})
        break
    }
  }

  renderItemOption (option) {
    const { themedStyle } = this.props
    let textOpt = ''
    let showArrow = ''
    let icon = ''
    let special = false
    switch (option) {
      case 'bookmark':
        textOpt = i18n.t('option.bookmark')
        showArrow = true
        icon = 'book'
        break
      case 'about':
        textOpt = i18n.t('option.about')
        showArrow = true
        icon = 'infocirlceo'
        break
      case 'spiderum':
        textOpt = i18n.t('option.spiderum')
        showArrow = true
        special = true
        icon = 'Trophy'
    }

    return (
      <TouchableOpacity
        onPress={() => {
          this.onPressOption(option)
        }}
      >
        <View style={[themedStyle.containerOption, themedStyle.bottomBorder]}>
          <Icon
            style={themedStyle.styleIcon}
            name={icon}
            color='#35474E'
            size={22}
          />
          <Text h={5} style={[themedStyle.textOption, special ? themedStyle.textSpecial : {}]}>
            {textOpt}
          </Text>
          {showArrow && (
            <Icon
              style={themedStyle.styleIcon}
              name='right'
              color='#35474E'
              size={18}
            />
          )}
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    const { themedStyle } = this.props
    return (
      <View style={themedStyle.container}>
        {this.renderItemOption('bookmark')}
        {this.renderItemOption('about')}
        {this.renderItemOption('spiderum')}
      </View>
    )
  }
}

export default withStyles(OptionsComponent, (theme) => ({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 20,
    paddingHorizontal: 20
  },
  scrollview: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15
  },
  textOption: {
    lineHeight: 19,
    fontWeight: '600',
    flex: 1,
    paddingLeft: 15
  },
  leftIcon: {
    paddingLeft: 4
  },
  styleIcon: {},
  containerOption: {
    flexDirection: 'row',
    marginTop: 1,
    backgroundColor: 'transparent',
    borderRadius: 3,
    // justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    height: 60
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ECF2F9'
  },
  styleSwitch: {
    // marginRight: 17
  },
  textSpecial: {
  }
}))
