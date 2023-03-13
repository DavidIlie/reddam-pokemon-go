import React, { useState, useEffect } from "react";
import { SafeAreaView, Button, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";

import ScanQRCode from "./components/ScanQRCode";

import App from "./App";
import { Loading } from "./components/Loading";
import { AuthWSWrapper } from "./components/WebSocketContext";

const AppUnderscore: React.FC = () => {
   const [loading, setLoading] = useState(true);
   const [needsToAuthQRCode, setNeedsToAuthQRCode] = useState(false);
   const [toggleScan, setToggleScan] = useState(false);
   const [uuid, setUuid] = useState<string>("");

   useEffect(() => {
      const work = async () => {
         await SecureStore.setItemAsync(
            "uuid",
            "914094e8-06b6-45ca-9aa3-55d4ef93d081"
         );
         const uuid = await SecureStore.getItemAsync("uuid");
         if (!uuid) return setNeedsToAuthQRCode(true);
         setUuid(uuid);
         setLoading(false);
      };
      work();
   }, []);

   if (loading) return <Loading />;

   return (
      <SafeAreaView>
         {needsToAuthQRCode ? (
            toggleScan ? (
               <ScanQRCode
                  onSuccess={async (data) => {
                     await SecureStore.setItemAsync("uuid", data);
                     setUuid(data);
                     setToggleScan(false);
                     setNeedsToAuthQRCode(false);
                  }}
                  onFail={() => console.log("error")}
                  title="Scan QR Code to Log In"
               />
            ) : (
               <View className="flex items-center justify-center h-full">
                  <Text className="text-2xl font-medium">Reddam House Go</Text>
                  <Button
                     title="Scan Log In Code"
                     onPress={() => setToggleScan(true)}
                  />
               </View>
            )
         ) : (
            <AuthWSWrapper uuid={uuid}>
               <App />
            </AuthWSWrapper>
         )}
      </SafeAreaView>
   );
};

export default AppUnderscore;
