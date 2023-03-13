import React from "react";
import { Button, SafeAreaView, Text } from "react-native";

import { useWS } from "./components/WebSocketContext";

const Home: React.FC = () => {
   const { ws } = useWS();
   const sendMessage = () => ws.sendJsonMessage({ message: "frog message" });

   return (
      <SafeAreaView>
         <Text>I should be connected to a websocket now</Text>
         <Button onPress={sendMessage} title="send test message" />
      </SafeAreaView>
   );
};

export default Home;
