import _ from 'lodash'
import { StyleSheet, Dimensions, StatusBar, Platform } from 'react-native'
import { isIphoneX } from '../libraries/iphonex'
import { STYLE_SHEET, DEFAULT_HEADER_GRADIENT } from '../configs'
const { height } = Dimensions.get('window')
const { height: screenHeight } = Dimensions.get('screen')

export const DEFAULT_HEADER_HEIGHT = 60
export const HEADER_GRADIENT = DEFAULT_HEADER_GRADIENT

export const isFixedSize = parseInt(height) === parseInt(screenHeight - StatusBar.currentHeight)
export const appHeight = height

export const TAB_BAR_HEIGHT = isIphoneX() ? 62 : 52

const style = {
  mainContent: {
    ...Platform.select({
      android: {
        height: '100%'
      },
      ios: {
        height: appHeight - 20
      }
    })
  },
  defaultPage: {
    flex: 1,
    display: 'flex',
    height: appHeight,
    flexDirection: 'column',
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight
      }
    })
  },
  defaultBackgroundColor: {
  },
  backgroundColor: {
  },
  defaultHeaderHeight: {
    height: DEFAULT_HEADER_HEIGHT,
    width: '100%'
  },
  statusBar: {
    // position: 'absolute',
    width: '100%',
    ...Platform.select({
      ios: {
        height: isIphoneX() ? 44 : 20
      },
      android: {
        height: 0
      }
    })
    // height: Platform.select({
    //   android: StatusBar.currentHeight,
    //   ios: 0
    // })
  },
  shadow: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 * 5 },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * 5
  },
  text: {},
  btnPrimary: {},
  btnDisable: {},
  btnText: {},
  alertSuccess: { color: 'blue' },
  alertDanger: { color: 'blue' },
  table: {},
  txtHeader: { fontSize: 17 },
  input: {},
  colorPrimary: {},
  colorDisabled: {},
  colorActive: {},
  listTxs: {},
  listMenu: {},
  modalFooter: {},
  modalBody: {},
  modalHeader: {},
  bottom_bar_container: {
    borderTopColor: 'transparent',
    height: TAB_BAR_HEIGHT
  },
  bottom_bar_item_overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  bottom_bar_item_bar: {
    position: 'absolute',
    width: '100%',
    height: 2,
    top: 0
  }
}

export default StyleSheet.create(_.merge(style, STYLE_SHEET))

export const textStyle = {
  headline: {
    fontWeight: 'normal'
  },
  subtitle: {
    fontWeight: 'normal'
  },
  paragraph: {
    fontWeight: 'normal'
  },
  caption1: {
    fontWeight: 'normal'
  },
  caption2: {
    fontWeight: 'normal'
  },
  label: {
    fontWeight: 'normal'
  },
  button: {
    // fontFamily: 'opensans-extrabold',
    // fontWeight: 'normal',
  }
}
