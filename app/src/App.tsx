import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, Image } from "react-native";
import { SlideModal } from "react-native-slide-modal";
import { Loading } from "./components/Loading";

import { useWS } from "./components/WebSocketContext";

const Home: React.FC = () => {
   const { ws } = useWS();
   const [loading, setLoading] = useState(true);
   const [gameData, setGameData] = useState<{
      firstConnection: boolean;
   } | null>(null);

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
         console.log(parsed);
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
            <SafeAreaView>
               <Text>Reddam House Go</Text>
            </SafeAreaView>
         }
         modalContainer={
            <View className="px-4">
               <Text className="text-3xl font-medium text-center">
                  Welcome!
               </Text>
               <Text className="text-center mt-2">
                  You have been given 10 random places around the school, try
                  and find them...
               </Text>
               <Text className="text-center mt-2">
                  First one to 10 points,{" "}
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
