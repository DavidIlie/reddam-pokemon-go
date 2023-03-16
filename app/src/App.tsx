import React, { useState, useEffect } from "react";
import {
   SafeAreaView,
   Text,
   View,
   Image,
   TouchableOpacity,
   Animated,
} from "react-native";
import { SlideModal } from "react-native-slide-modal";

import { Loading } from "./components/Loading";
import { useWS } from "./components/WebSocketContext";
import PinchPan from "./components/PinchPan";

const Home: React.FC = () => {
   const { ws } = useWS();
   const [loading, setLoading] = useState(true);
   const [gameData, setGameData] = useState<{
      firstConnection: boolean;
      completed: number;
   } | null>(null);
   const [floor, setFloor] = useState(1);

   useEffect(() => {
      const getData = async () => {
         setLoading(true);
         ws.sendJsonMessage({ action: "getGameData" });
      };

      getData();
   }, []);

   useEffect(() => {
      if (ws.lastMessage.data) {
         const parsed = JSON.parse(ws.lastMessage.data);
         switch (parsed.action) {
            case "getGameData":
               setGameData(parsed.res);
               setLoading(false);
               break;
            default:
               break;
         }
      }
   }, [ws.lastMessage]);

   if (loading) return <Loading />;

   const interactionSlideModal = () => {
      ws.sendJsonMessage({ action: "getGameData" });
   };

   return (
      <SlideModal
         modalType="iOS Form Sheet"
         modalVisible={gameData?.firstConnection!}
         screenContainer={
            <SafeAreaView className="h-full w-full">
               <View className="bg-white z-50 border-b pb-1 border-gray-300">
                  <View className="p-2">
                     <Text className="text-lg text-center">
                        Total Points:{" "}
                        <Text className="font-bold text-blue-500">
                           {gameData?.completed}
                        </Text>
                     </Text>
                     <View className="flex-row mx-auto mt-2">
                        <TouchableOpacity
                           className={`px-2 py-1 ${
                              floor === 1 ? "bg-gray-100" : "bg-blue-500"
                           } rounded-l-md`}
                           disabled={floor === 1}
                           onPress={() => setFloor(1)}
                        >
                           <Text
                              className={`text-lg ${
                                 floor === 2 ? "text-white" : "text-gray-300"
                              }`}
                           >
                              Floor 1
                           </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                           className={`px-2 py-1 ${
                              floor === 2 ? "bg-gray-100" : "bg-blue-500"
                           } rounded-r-md`}
                           disabled={floor === 2}
                           onPress={() => setFloor(2)}
                        >
                           <Text
                              className={`text-lg ${
                                 floor === 1 ? "text-white" : "text-gray-300"
                              }`}
                           >
                              Floor 2
                           </Text>
                        </TouchableOpacity>
                     </View>
                  </View>
               </View>
               <View>
                  <PinchPan>
                     {({ scale, x, y }) => (
                        <Animated.Image
                           source={require("../assets/1st_floor_mansion_PHOTOSHOPPED.png")}
                           style={{
                              width: "80%",
                              height: "80%",
                              aspectRatio: 1,
                              resizeMode: "contain",
                              transform: [
                                 { scale },
                                 { translateX: x },
                                 { translateY: y },
                              ],
                           }}
                        />
                     )}
                  </PinchPan>
               </View>
            </SafeAreaView>
         }
         modalContainer={
            <View className="px-4">
               <Text className="text-3xl font-medium text-center">
                  Welcome!
               </Text>
               <Text className="text-center mt-2">
                  You have been given different points around the school, try
                  and find them...
               </Text>
               <Text className="text-center mt-2">
                  The team which gets the most{" "}
                  <Text className="text-blue-500 font-bold">points</Text> in 30
                  minutes,{" "}
                  <Text className="text-blue-500 font-bold">wins!</Text>
               </Text>
               <View className="mt-48 mx-auto">
                  <Image
                     source={require("../assets/ReddamHouseLogo.png")}
                     style={{
                        width: "76%",
                        height: "76%",
                        aspectRatio: 1,
                        resizeMode: "contain",
                     }}
                  />
               </View>
            </View>
         }
         pressDone={interactionSlideModal}
         pressCancel={interactionSlideModal}
         darkMode={false}
         doneDisabled={false}
      />
   );
};

export default Home;
