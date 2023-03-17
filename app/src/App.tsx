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
import { ReadyState } from "react-native-use-websocket";
import { useToast } from "react-native-toast-notifications";

import { Loading } from "./components/Loading";
import { useWS } from "./components/WebSocketContext";
import PinchPan from "./components/PinchPan";
import Marker from "./components/Marker";
import CustomButton from "./components/CustomButton";

const Home: React.FC = () => {
   const toast = useToast();
   const { ws } = useWS();
   const [loading, setLoading] = useState(true);
   const [gameData, setGameData] = useState<{
      firstConnection: boolean;
      foundRooms: string[];
      status: "NOT_STARTED" | "STARTED" | "FINISHED";
      endTime?: Date;
      markers: { left: number; top: number; roomName: string }[];
   } | null>(null);
   const [floor, setFloor] = useState(1);

   useEffect(() => {
      const getData = async () => {
         if (ws.readyState === ReadyState.OPEN) {
            setTimeout(() => {
               setLoading(true);
               ws.sendJsonMessage({ action: "getGameData" });
            }, 200);
         }
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
            case "someoneGotPoint":
               toast.show(parsed.res, { type: "danger" });
               break;
            case "askForGameData":
               ws.sendJsonMessage({ action: "getGameData" });
               break;
            default:
               break;
         }
      }
   }, [ws.lastMessage]);

   if (loading) return <Loading />;

   if (gameData?.status === "NOT_STARTED")
      return (
         <SafeAreaView className="flex justify-center items-center h-full">
            <Text className="font-bold text-4xl text-red-500">
               Game Has Not Started 🙄
            </Text>
            <Text className="text-lg">Please wait for it to start</Text>
         </SafeAreaView>
      );

   if (gameData?.status === "FINISHED")
      return (
         <SafeAreaView className="flex justify-center items-center h-full">
            <Text className="font-bold text-4xl text-red-500">Finished 🚀</Text>
            <Text className="text-lg">Go back to class!</Text>
         </SafeAreaView>
      );

   const interactionSlideModal = () => {
      ws.sendJsonMessage({ action: "getGameData" });
   };

   return (
      <SlideModal
         modalType="iOS Form Sheet"
         screenContainer={
            <SafeAreaView className="h-full w-full bg-white">
               <View className="bg-white z-50 border-b pb-1 border-gray-300">
                  <View className="p-2">
                     <Text className="text-lg text-center">Time Left:</Text>
                     <Text className="text-lg text-center mt-1">
                        Total Points:{" "}
                        <Text className="font-bold text-blue-500">
                           {gameData?.foundRooms.length}
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
               <View className="h-[80%]">
                  <PinchPan>
                     {({ scale, x, y }) => (
                        <Animated.View
                           style={{
                              transform: [
                                 { scale },
                                 { translateX: x },
                                 { translateY: y },
                              ],
                           }}
                        >
                           <View>
                              {gameData?.markers?.map((marker, index) => (
                                 <Marker {...marker} key={index} />
                              ))}
                              <Animated.Image
                                 source={require("../assets/1st_floor_mansion_PHOTOSHOPPED.png")}
                                 style={{
                                    width: "80%",
                                    height: "80%",
                                    aspectRatio: 1,
                                    resizeMode: "contain",
                                 }}
                              />
                           </View>
                        </Animated.View>
                     )}
                  </PinchPan>
               </View>
            </SafeAreaView>
         }
         modalContainer={
            <View className="px-4 mt-24 w-full">
               <Text className="text-3xl font-medium text-center">
                  Welcome!
               </Text>
               <Text className="text-center text-lg mt-2">
                  Try and find as many points around Reddam...
               </Text>
               <Text className="text-center text-xl">
                  The team which gets the most{" "}
                  <Text className="text-blue-500 font-bold">points</Text> in 30
                  minutes,{" "}
                  <Text className="text-blue-500 font-bold">wins!</Text>
               </Text>
               <CustomButton
                  onPress={() => {
                     ws.sendJsonMessage({ action: "getGameData" });
                  }}
               >
                  Okay
               </CustomButton>
               <View className="mx-auto mt-4">
                  <Image
                     source={require("../assets/ReddamHouseLogo.png")}
                     style={{
                        width: "80%",
                        height: "80%",
                        aspectRatio: 1,
                        resizeMode: "contain",
                     }}
                  />
               </View>
            </View>
         }
         modalVisible={gameData?.firstConnection!}
         pressDone={interactionSlideModal}
         pressCancel={interactionSlideModal}
         darkMode={false}
         doneDisabled={false}
      />
   );
};

export default Home;
