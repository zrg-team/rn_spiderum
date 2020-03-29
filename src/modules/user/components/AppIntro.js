import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { StyleSheet, View, Text, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import AppIntroSlider from 'react-native-app-intro-slider'

export default class AppIntro extends React.Component {
  constructor (props) {
    super(props)
    this.handleDone = this.handleDone.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  handleDone () {
    const { updateAppIntro } = this.props
    updateAppIntro(true)
  }

  renderItem ({ item, dimensions }) {
    return (
      <LinearGradient
        style={[
          styles.mainContent,
          dimensions
        ]}
        colors={item.colors}
        start={{ x: 0, y: 0.1 }}
        end={{ x: 0.1, y: 1 }}
      >
        {item.icon && (
          <AntDesign
            style={{ backgroundColor: 'transparent' }}
            name={item.icon}
            size={170}
            color='white'
          />)}
        {item.image && (
          <Image
            style={styles.image}
            source={item.image}
            resizeMode='contain'
          />)}
        <View style={styles.title_container}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </LinearGradient>
    )
  }

  render () {
    return (
      <AppIntroSlider
        slides={slides}
        renderItem={this.renderItem}
        bottomButton
        onDone={this.handleDone}
      />)
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  image: {
    width: 400,
    height: 300
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16
  },
  title_container: {
    paddingBottom: 30
  }
})

const slides = [
  {
    key: '1',
    title: 'Chia sẻ thông tin và thảo luận',
    text:
      'Spiderum là một nền tảng chia sẻ thông tin và thảo luận có chọn lọc theo nhu cầu của người dùng',
    icon: 'gift',
    colors: ['#63E2FF', '#B066FE']
  },
  {
    key: '2',
    title: 'Nhiều tính năng thú vị',
    text:
      ` Hệ thống subsciption
        Hệ thống Upvote/Downvote và thuật toán
        Hệ thống theo dõi và cung cấp nội dung theo hành vi người dùng
      `,
    icon: 'star',
    colors: ['#A3A1FF', '#3A3897']
  },
  {
    key: '1',
    title: 'Ứng dụng không chính thức',
    text: 'Ứng dụng đơn giản, giao diện dễ dùng, đọc offline, bookmark, mã nguồn mở',
    icon: 'mobile1',
    colors: ['#29ABE2', '#4F00BC']
  }
]
