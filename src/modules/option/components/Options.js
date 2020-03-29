import React, { Component } from 'react'
import i18n from 'i18n-js'
import {
  View,
  Text,
  Linking,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import Icon from 'react-native-vector-icons/AntDesign'
import { withStyles } from 'react-native-ui-kitten'
import { DEBUG_PAGE } from '../../../configs'
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
    const { navigation, toggleUIMode } = this.props
    switch (option) {
      case 'UIMode':
        toggleUIMode()
        break
      case 'bookmark':
        navigationPush(navigation, screens().Bookmark)
        break
      case 'about':
        BottomSheet.show(<Information />)
        break
      case 'debug':
        navigationPush(navigation, screens().Debug)
        break
      case 'spiderum':
        Linking.openURL('https://spiderum.com/')
          .catch(() => {})
        break
    }
  }

  renderItemOption (option) {
    const { themedStyle, darkMode } = this.props
    let textOpt = ''
    let showArrow = ''
    let icon = ''
    let special = false
    let boder = true
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
        break
      case 'debug':
        textOpt = i18n.t('option.debug')
        showArrow = true
        icon = 'tool'
        break
      case 'version':
        textOpt = `${i18n.t('option.version')} ${DeviceInfo.getVersion()} ${i18n.t('option.build')} ${DeviceInfo.getBuildNumber()}`
        showArrow = false
        icon = null
        boder = false
        break
      case 'UIMode':
        textOpt = darkMode ? i18n.t('option.ui_normal_mode') : i18n.t('option.ui_dark_mode')
        showArrow = true
        icon = 'mobile1'
        break
    }

    return (
      <TouchableOpacity
        onPress={() => {
          this.onPressOption(option)
        }}
      >
        <View style={[themedStyle.containerOption, boder ? themedStyle.bottomBorder : {}]}>
          {icon ? (
            <Icon
              style={themedStyle.styleIcon}
              name={icon}
              size={22}
            />) : null}
          <Text
            h={5}
            style={[
              themedStyle.textOption, special ? themedStyle.textSpecial : {},
              icon ? {} : { paddingLeft: 5 }
            ]}
          >
            {textOpt}
          </Text>
          {showArrow && (
            <Icon
              style={themedStyle.styleIcon}
              name='right'
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
      <ScrollView style={themedStyle.container}>
        {this.renderItemOption('bookmark')}
        {this.renderItemOption('UIMode')}
        {this.renderItemOption('about')}
        {this.renderItemOption('spiderum')}
        {DEBUG_PAGE ? this.renderItemOption('debug') : null}
        {this.renderItemOption('version')}
      </ScrollView>
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
    paddingLeft: 15,
    color: theme['text-basic-color']
  },
  leftIcon: {
    paddingLeft: 4
  },
  styleIcon: {
    color: theme['text-hint-color']
  },
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
    borderBottomColor: theme['border-basic-color-4']
  },
  styleSwitch: {
    // marginRight: 17
  },
  textSpecial: {
  }
}))
