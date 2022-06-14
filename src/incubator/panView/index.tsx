import {isEmpty} from 'lodash';
import React from 'react';
import {StyleProp, View as RNView, ViewStyle} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {asBaseComponent} from '../../commons/new';
import View, {ViewProps} from '../../components/view';
import {PanningDirections, PanningDirectionsEnum} from './panningUtil';
import useHiddenLocation from '../hooks/useHiddenLocation';
import usePanGesture, {
  PanGestureProps,
  PanViewDirections,
  PanViewDirectionsEnum,
  PanViewDismissThreshold,
  DEFAULT_ANIMATION_CONFIG
} from './usePanGesture';
export {
  PanningDirections,
  PanningDirectionsEnum,
  PanViewDirections,
  PanViewDirectionsEnum,
  PanViewDismissThreshold,
  DEFAULT_ANIMATION_CONFIG
};

export interface PanViewProps extends Omit<PanGestureProps, 'hiddenLocation'>, ViewProps {
  /**
   * Add a style to the container
   */
  containerStyle?: StyleProp<ViewStyle>;
}

interface Props extends PanViewProps {
  children?: React.ReactNode | React.ReactNode[];
}

const PanView = (props: Props) => {
  const {
    directions,
    dismissible,
    animateToOrigin,
    onDismiss,
    directionLock,
    threshold,
    containerStyle,
    children,
    ...others
  } = props;

  const containerRef = React.createRef<RNView>();
  const {onLayout, hiddenLocation} = useHiddenLocation({containerRef});
  const {panAnimatedStyle, panGestureEvent} = usePanGesture({
    directions,
    dismissible,
    animateToOrigin,
    onDismiss,
    directionLock,
    threshold,
    hiddenLocation
  });

  return (
    <View ref={containerRef} style={containerStyle} onLayout={onLayout}>
      {/* @ts-expect-error missing children TS error started with react 18 */}
      <PanGestureHandler onGestureEvent={isEmpty(directions) ? undefined : panGestureEvent}>
        <View reanimated style={panAnimatedStyle}>
          <View {...others}>{children}</View>
        </View>
      </PanGestureHandler>
    </View>
  );
};

PanView.displayName = 'PanView';
PanView.directions = PanViewDirectionsEnum;

export default asBaseComponent<PanViewProps, typeof PanView>(PanView);
