import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions
} from 'react-native'
import i18n from 'i18n-js'
import { Button } from 'react-native-ui-kitten'
import { RNCamera } from 'react-native-camera'
import Permissions from 'react-native-permissions'
import BottomSheet from './BottomSheet'
import { images } from '../../../assets/elements'

const { width, height } = Dimensions.get('window')

let instance = null
class QRCodeScan extends Component {
  constructor (props) {
    super(props)

    this.state = {
      cameraAvailable: false,
      cameraDisabledPopupVisible: false,
      show: false,
      qrCode: false,
      image: null,
      imageData: null,
      capureType: 'data-uri'
    }
    instance = this
    this.captureCallback = null

    this.handleHide = this.handleHide.bind(this)
    this.handleCapture = this.handleCapture.bind(this)
    this.showQrcode = this.showQrcode.bind(this)
    this.cameraRequest = this.cameraRequest.bind(this)
  }

  handleHide () {
    this.setState({
      show: false,
      image: null
    }, () => {
      this.onCaptureCallback = null
      if (BottomSheet.isShow()) {
        BottomSheet.temporaryShow()
      }
    })
  }

  async handleCapture () {
    try {
      if (this.camera) {
        const options = {
          quality: 0.1,
          base64: true,
          pauseAfterCapture: true,
          orientation: 'portrait',
          fixOrientation: true
        }
        const data = await this.camera.takePictureAsync(options)
        this.onCaptureCallback && this.onCaptureCallback(data)
        this.setState({
          cameraAvailable: false,
          cameraDisabledPopupVisible: false,
          show: false,
          image: null,
          imageData: null,
          capureType: 'data-uri'
        })
        this.captureCallback = null
        this.hide()
      }
    } catch (err) {
      console.show('>>>>>>>err', err)
    }
  }

  showQrcode (captureCallback) {
    this.onCaptureCallback = captureCallback
    this.cameraRequest()
    this.setState({
      show: true,
      qrCode: true
    }, () => {
      if (BottomSheet.isShow()) {
        BottomSheet.temporaryHide()
      }
    })
  }

  show (captureCallback, image) {
    this.onCaptureCallback = captureCallback
    this.cameraRequest()
    this.setState({
      show: true,
      image,
      qrCode: false
    }, () => {
      if (BottomSheet.isShow()) {
        BottomSheet.temporaryHide()
      }
    })
  }

  cameraRequest () {
    Permissions.check(Permissions.PERMISSIONS.ANDROID.CAMERA).then(response => {
      console.log('Permissions', response)
      if (response === Permissions.RESULTS.GRANTED) {
        this.setState({ cameraAvailable: true })
      } else {
        Permissions.request(Permissions.PERMISSIONS.ANDROID.CAMERA)
          .then(res => {
            if (res === Permissions.RESULTS.GRANTED) {
              this.setState({ cameraAvailable: true })
            } else {
              this.setState({ cameraDisabledPopupVisible: true })
            }
          })
      }
    })
  }

  render () {
    const { zIndex } = this.props
    const { show, image, qrCode, cameraAvailable } = this.state
    if (!show) {
      return null
    }
    return (
      <View style={[styles.container, { zIndex }]}>
        <View style={{ flex: 1 }}>
          {cameraAvailable
            ? (
              <RNCamera
                ref={camera => {
                  this.camera = camera
                }}
                onBarCodeRead={qrCode ? this.onCaptureCallback : undefined}
                barCodeTypes={qrCode ? [RNCamera.Constants.BarCodeType.qr] : []}
                style={styles.camera}
                type={RNCamera.Constants.Type.back}
                captureAudio={false}
              >
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{ width: '80%', height: '80%', opacity: 0.4 }}
                    resizeMode='stretch'
                  />
                )}
                {qrCode && (
                  <Image source={images.camera_focus} style={styles.image} />
                )}
              </RNCamera>
            ) : null}
        </View>
        <View
          style={styles.buttonContainer}
        >
          <Button
            raised
            onPress={this.handleHide}
            backgroundColor='#09203f'
            containerViewStyle={{ flex: 1 }}
            title={i18n.t('common.back')}
          />
          {!qrCode
            ? (
              <Button
                full
                onPress={this.handleCapture}
              >
                <Text>Capture</Text>
              </Button>)
            : null}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    height
  },
  header: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.3
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  image: {
    width: width * 0.37,
    height: width * 0.37
  },
  buttonContainer: {
    height: 60,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default {
  Component: QRCodeScan,
  show (callback, image = null) {
    instance &&
      instance.show(callback, image)
  },
  showQrcode (callback) {
    instance &&
      instance.showQrcode(callback)
  },
  hide () {
    instance && instance.handleHide()
  }
}
