import React from "react";
import { Animated } from "react-native";
import {
   PanGestureHandler,
   PinchGestureHandler,
   State,
} from "react-native-gesture-handler";

type InjectedProps = {
   scale: Animated.Value;
   x: Animated.Value;
   y: Animated.Value;
};

const PinchPan: React.FC<{
   children: (props: InjectedProps) => React.ReactNode;
}> = ({ children }) => {
   const scale = new Animated.Value(4);
   const pan = new Animated.ValueXY({ x: 170, y: 112.5 });

   let prevPanX = 0;
   let prevPanY = 0;

   return (
      <PanGestureHandler
         onGestureEvent={Animated.event(
            [
               {
                  nativeEvent: {
                     translationX: pan.x,
                     translationY: pan.y,
                  },
               },
            ],
            { useNativeDriver: true }
         )}
         onHandlerStateChange={(event) => {
            if (event.nativeEvent.oldState === State.ACTIVE) {
               prevPanX += event.nativeEvent.translationX;
               prevPanY += event.nativeEvent.translationY;
               pan.setOffset({ x: prevPanX, y: prevPanY });
               pan.setValue({ x: 0, y: 0 });
            }
         }}
         minPointers={1}
         maxPointers={1}
      >
         <Animated.View>
            <PinchGestureHandler
               onGestureEvent={Animated.event(
                  [
                     {
                        nativeEvent: {
                           scale,
                        },
                     },
                  ],
                  { useNativeDriver: true }
               )}
            >
               {children({ scale, x: pan.x, y: pan.y })}
            </PinchGestureHandler>
         </Animated.View>
      </PanGestureHandler>
   );
};

export default PinchPan;
