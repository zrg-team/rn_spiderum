import React, { Component } from 'react'
import { Animated, StyleSheet, Easing, Dimensions } from 'react-native'
const { width } = Dimensions.get('window')

export const ANIMATIONS = {
  none: null,
  fade: 'fade',
  slide: 'slide',
  book: 'book',
  paper: 'paper',
  up: 'up'
}
export default function NavigationPage (WrapperComponent, stackNavigation, option = {}) {
  return class extends Component {
    constructor (props) {
      super(props)
      const type = option.animation || ANIMATIONS.none
      this.state = {
        page: option.page || 0,
        stacks: [0],
        params: { ...option.params },
        animationType: type,
        animations: this.createAnimationValues(type),
        lastPage: null,
        animationRun: false
      }
      this.wrapper = null
      this.currentPage = null
      this.back = this.back.bind(this)
      this.push = this.push.bind(this)
      this.reset = this.reset.bind(this)
      this.setParams = this.setParams.bind(this)
      this.replaceParams = this.replaceParams.bind(this)
      this.forceRenderWrap = this.forceRenderWrap.bind(this)
    }

    createAnimationValues (type) {
      switch (type) {
        case ANIMATIONS.fade:
          return {
            in: {
              value: new Animated.Value(0),
              duration: 300
            },
            out: {
              value: new Animated.Value(0),
              duration: 500
            }
          }
        case ANIMATIONS.slide:
          return {
            in: {
              value: new Animated.Value(0),
              duration: 400
            },
            out: {
              value: new Animated.Value(0),
              duration: 300
            }
          }
        case ANIMATIONS.book:
          return {
            in: {
              value: new Animated.Value(0),
              duration: 300
            },
            out: {
              value: new Animated.Value(0),
              duration: 500
            }
          }
        case ANIMATIONS.paper:
          return {
            in: {
              value: new Animated.Value(0),
              duration: 300
            }
          }
        case ANIMATIONS.up:
          return {
            in: {
              value: new Animated.Value(0),
              duration: 400
            }
          }
        case ANIMATIONS.none:
          return {}
      }
    }

    getAnimationStyles (type) {
      const { animations } = this.state
      let value = null
      switch (type) {
        case ANIMATIONS.fade:
          value = animations.in.value.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.6, 0.8, 1]
          })
          return {
            opacity: value
          }
        case ANIMATIONS.book:
        case ANIMATIONS.slide:
          value = animations.in.value.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [width, width / 2, 0]
          })
          return {
            transform: [{
              translateX: value
            }]
          }
        case ANIMATIONS.paper:
          value = animations.in.value.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [-width, -width / 2, 0]
          })
          return {
            transform: [{
              translateX: value
            }],
            zIndex: 10
          }
        case ANIMATIONS.up:
          value = animations.in.value.interpolate({
            inputRange: [0, 1],
            outputRange: [500, 0]
          })
          return {
            transform: [{
              translateY: value
            }],
            zIndex: 10
          }
        case ANIMATIONS.none:
          return {}
      }
    }

    getTempAnimationStyles (type) {
      const { animations } = this.state
      let value = null
      switch (type) {
        case ANIMATIONS.fade:
          value = animations.out.value.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0.5, 0.5]
          })
          return {
            opacity: value
          }
        case ANIMATIONS.book: {
          const cubeRotateY = animations.out.value.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['-60deg', '0deg', '60deg']
          })
          return {
            transform: [{
              perspective: width
            },
            {
              translateX: width / 2
            },
            {
              rotateY: cubeRotateY
            }]
          }
        }
        case ANIMATIONS.slide:
          value = animations.out.value.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, width / 2, width]
          })
          return {
            transform: [{
              translateX: value
            }]
          }
        case ANIMATIONS.up:
        case ANIMATIONS.paper:
          return {
            width: 0,
            overflow: 'hidden'
          }
        case ANIMATIONS.none:
          return {}
      }
    }

    runAnimation (type) {
      const { animations } = this.state
      switch (type) {
        case ANIMATIONS.fade:
          animations.out.value.setValue(0)
          animations.in.value.setValue(0)
          return Animated.sequence([
            Animated.timing(animations.out.value, {
              toValue: 1,
              useNativeDriver: true,
              duration: animations.out.duration,
              easing: Easing.bezier(0.04, 0.9, 0.11, 0.9)
            }),
            Animated.timing(animations.in.value, {
              toValue: 1,
              useNativeDriver: true,
              duration: animations.in.duration,
              easing: Easing.bezier(0.04, 0.9, 0.11, 0.9)
            })
          ]).start(() => {
            this.setState({
              lastPage: null,
              animationRun: false
            })
          })
        case ANIMATIONS.book:
        case ANIMATIONS.slide:
          animations.out.value.setValue(0)
          animations.in.value.setValue(0)
          return Animated.parallel([
            Animated.timing(animations.out.value, {
              toValue: 1,
              useNativeDriver: true,
              duration: animations.out.duration,
              easing: Easing.bezier(0.04, 0.9, 0.11, 0.9)
            }),
            Animated.timing(animations.in.value, {
              toValue: 1,
              useNativeDriver: true,
              duration: animations.in.duration,
              easing: Easing.bezier(0.04, 0.9, 0.11, 0.9)
            })
          ]).start(() => {
            this.setState({
              lastPage: null,
              animationRun: false
            })
          })
        case ANIMATIONS.up:
        case ANIMATIONS.paper:
          animations.in.value.setValue(0)
          return Animated.timing(animations.in.value, {
            toValue: 1,
            useNativeDriver: true,
            duration: animations.in.duration,
            easing: Easing.bezier(0.04, 0.9, 0.11, 0.9)
          }).start(() => {
            this.setState({
              lastPage: null,
              animationRun: false
            })
          })
        case ANIMATIONS.none:
          return false
      }
    }

    forceRenderWrap () {
      this.wrapper && this.wrapper.forceUpdate()
    }

    renderPage (animationRun) {
      const { page, params = {} } = this.state
      const Component = stackNavigation[page]
      if (!Component) {
        throw new Error('NOT_VALID_PAGE')
      }
      this.currentPage = (
        <Component
          animationRun={animationRun}
          {...params}
          {...this.props}
          back={this.back}
          push={this.push}
          reset={this.reset}
          wrapper={this.wrapper}
          setParams={this.setParams}
          replaceParams={this.replaceParams}
          forceRenderWrap={this.forceRenderWrap}
        />)
      return this.currentPage
    }

    setParams (nextParams) {
      const { params } = this.state
      this.setState({
        params: {
          ...params,
          ...nextParams
        }
      })
    }

    replaceParams (params = {}) {
      this.setState({
        params
      })
    }

    push (page, nextParams = undefined) {
      const { stacks, page: currentPage, animationType, animationRun, params } = this.state
      if (currentPage === page) {
        return false
      }
      if (!stackNavigation[page]) {
        throw new Error('NOT_VALID_PAGE')
      }
      stacks.push(currentPage)
      this.setState({
        stacks,
        params: !nextParams
          ? params
          : {
            ...params,
            ...nextParams
          },
        page,
        animationRun: !animationRun || false,
        lastPage: !animationRun ? this.currentPage : null
      }, () => {
        !animationRun && this.runAnimation(animationType)
      })
    }

    back (nextParams = undefined) {
      const { stacks, params } = this.state
      if (stacks && stacks.length > 0) {
        const page = stacks.pop()
        this.setState({
          page,
          params: !nextParams
            ? params
            : {
              ...params,
              ...nextParams
            }
        })
      }
    }

    reset (page, params = {}) {
      if (!stackNavigation[page]) {
        throw new Error('NOT_VALID_PAGE')
      }
      this.setState({
        params,
        page
      })
    }

    render () {
      const { lastPage, animationType, animationRun, page } = this.state
      return (
        <WrapperComponent
          key='main'
          back={this.back}
          push={this.push}
          reset={this.reset}
          currentPage={page}
          setParams={this.setParams}
          replaceParams={this.replaceParams}
          {...this.props}
          ref={ref => { this.wrapper = ref }}
        >
          {animationRun
            ? (
              <Animated.View
                style={[internalStyles.animationContainer, this.getAnimationStyles(animationType)]}
              >
                {this.renderPage(animationRun)}
              </Animated.View>
            ) : this.renderPage()}
          {lastPage ? (
            <Animated.View
              key='animation'
              style={[internalStyles.animationContainer, this.getTempAnimationStyles(animationType)]}
            >
              {lastPage}
            </Animated.View>
          ) : null}
        </WrapperComponent>
      )
    }
  }
}

const internalStyles = StyleSheet.create({
  animationContainer: {
    width: '100%',
    height: '100%',
    elevation: 1
  }
})
