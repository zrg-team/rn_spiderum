import {
  StyleSheet,
  PixelRatio
} from 'react-native'

export default StyleSheet.create({
  content: {
    flex: 10,
    margin: 30
  },
  row_in_line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  txt_warning: {
    color: 'rgba(255,59,59,1)'
  },
  icon_warning: {
    color: 'rgba(255,59,59,1)',
    fontSize: 35
  },
  view_warning: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 10,
    width: undefined,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  txt_normal: {
    color: 'rgba(53,71,78,1)',
    fontSize: 15
  },
  txt_orange: {
    color: 'rgba(241,134,0,1)',
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 16
  },
  icon_qrcode: {
    width: 34,
    height: 34
  },
  input_text: {
    marginTop: 10,
    fontSize: 16,
    height: 90,
    color: 'rgba(53,71,78,1)',
    borderRadius: 3,
    padding: 10,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: 'rgba(235,239,242,1)',
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#CFD8DD',
    textAlignVertical: 'top'
  },
  footer: {
    flex: 1,
    marginBottom: 30,
    marginLeft: 30,
    marginRight: 30
  },
  footer_btn_left: {
    marginRight: 8
  },
  footer_btn_right: {
    marginLeft: 8
  },
  error_container: {
    alignItems: 'center'
  },
  error_text: {
    textAlign: 'center',
    fontSize: 14,
    color: '#FF3B3B',
    letterSpacing: 1,
    lineHeight: 19
  },
  style_icon: {
    fontSize: 38,
    marginTop: 10,
    marginBottom: 10
  }
})
