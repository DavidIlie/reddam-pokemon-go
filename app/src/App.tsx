import React from "react";
import { SafeAreaView, Text } from "react-native";

import { useWS } from "./components/WebSocketContext";

const Home: React.FC = () => {
   const { ws } = useWS();

   ws.sendMessage("hi");

   return (
      <SafeAreaView>
         <Text>I should be connected to a websocket now</Text>
      </SafeAreaView>
   );
};

export default Home;
