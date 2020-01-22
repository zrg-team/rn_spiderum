import Collapsible from 'react-native-collapsible'
import Icon from 'react-native-vector-icons/AntDesign'
import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Text,
  View
} from 'react-native'

export default class CollapsibleComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeSection: false,
      collapsed: props.collapsed,
      rotateAnimation: new Animated.Value(0)
    }
    this.handleToggleExpanded = this.handleToggleExpanded.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.collapsed !== this.props.collapsed) {
      this.setState({ collapsed: nextProps.collapsed })
    }
  }

  handleToggleExpanded () {
    const { updateCurrentCollapsed } = this.props
    updateCurrentCollapsed && updateCurrentCollapsed(this.props.index)
    this.setState({ collapsed: !this.state.collapsed })
  }

  render () {
    const { lazy } = this.props
    const { collapsed } = this.state
    const rotate = collapsed ? 1 : 0

    Animated.timing(this.state.rotateAnimation, {
      toValue: rotate,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true
    }).start()

    const spin = this.state.rotateAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '90deg']
    })

    return (
      <View style={[styles.container]}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.header}
          onPress={this.handleToggleExpanded}
        >
          <Text style={styles.headerText}>
            {this.props.title}
          </Text>
          <Animated.View style={{ transform: [{ rotate: spin }], flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: -7 }}>
            <Icon
              name='right'
              color='#5A6872'
              size={18}
            />
          </Animated.View>
        </TouchableOpacity>
        <Collapsible collapsed={!collapsed} align='center'>
          {!lazy || collapsed ? this.props.children : null}
        </Collapsible>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F7FA',
    marginBottom: 2
  },
  headerText: {
    flex: 10,
    fontWeight: '600',
    color: '#152934'
  }
})
