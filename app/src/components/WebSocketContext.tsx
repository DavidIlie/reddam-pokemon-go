import React, { useState, createContext, useContext, useEffect } from "react";
import { SafeAreaView, Text } from "react-native";
import useWebSocket, { ReadyState } from "react-native-use-websocket";
import type { WebSocketHook } from "react-native-use-websocket/lib/typescript/src/lib/types";

import { Loading } from "./Loading";

const WSContext = createContext<{
   ws: WebSocketHook;
}>({} as any);

export const AuthWSWrapper: React.FC<{
   uuid: string;
   children: React.ReactNode;
}> = ({ uuid, children }) => {
   const [socketUrl] = useState(`ws://10.172.140.16:3001/ws?auth=${uuid}`);

   const ws = useWebSocket(socketUrl, {
      shouldReconnect: () => true,
      share: true,
   });

   const connectionStatus = {
      [ReadyState.CONNECTING]: "Connecting",
      [ReadyState.OPEN]: "Open",
      [ReadyState.CLOSING]: "Closing",
      [ReadyState.CLOSED]: "Closed",
      [ReadyState.UNINSTANTIATED]: "Uninstantiated",
   }[ws.readyState];

   useEffect(() => {
      if (__DEV__) console.log(`Websocket State: ${connectionStatus}`);
   }, [connectionStatus]);

   if (ws.readyState === ReadyState.CLOSED)
      return (
         <SafeAreaView className="flex justify-center items-center h-full">
            <Text className="font-bold text-4xl text-red-500">
               No Connection
            </Text>
            <Text className="text-lg">Please connect to Wi-Fi</Text>
         </SafeAreaView>
      );

   if (ws.readyState !== ReadyState.OPEN) return <Loading />;

   return (
      <WSContext.Provider
         value={{
            ws: ws,
         }}
      >
         {children}
      </WSContext.Provider>
   );
};

export const useWS = () => {
   const ws = useContext(WSContext);

   if (!ws) {
      throw new Error("WSContext not found");
   }

   return ws;
};
