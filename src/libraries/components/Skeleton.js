import React, { memo } from 'react'
import {
  PixelRatio
} from 'react-native'
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  // ShineOverlay,
  Fade
} from 'rn-placeholder'

export const DefaultSkeleton = memo(function (props) {
  return (
    <Placeholder
      Animation={Fade}
      Left={() => <PlaceholderMedia isRound style={{ marginRight: 10 }} />}
      style={[{
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 0,
        borderBottomColor: 'rgba(171,171,171,0.33)',
        borderBottomWidth: 1 / PixelRatio.get()
      }, props.style]}
    >
      <PlaceholderLine />
      <PlaceholderLine width={80} />
    </Placeholder>
  )
})
export const ContentSkeleton = memo(function (props) {
  return (
    <Placeholder
      Animation={Fade}
      style={[{
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 25,
        paddingHorizontal: 20,
        borderBottomColor: 'rgba(171,171,171,0.33)',
        borderBottomWidth: 1 / PixelRatio.get()
      }, props.style]}
    >
      <PlaceholderLine />
      <PlaceholderLine />
      <PlaceholderLine width={80} />
      <PlaceholderLine />
      <PlaceholderLine />
      <PlaceholderLine />
      <PlaceholderLine />
      <PlaceholderLine />
      <PlaceholderLine />
      <PlaceholderLine />
      <PlaceholderLine />
      <PlaceholderLine />
      <PlaceholderLine width={40} />
      <PlaceholderLine />
      <PlaceholderLine width={60} />
      <PlaceholderLine width={30} />
    </Placeholder>
  )
})
export default memo(function (props) {
  return (
    <Placeholder
      Animation={Fade}
      {...props}
      style={props.style}
    >
      <PlaceholderLine />
    </Placeholder>
  )
})
