import React, { useState, useEffect } from "react";
import { SafeAreaView, Button, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";

import ScanQRCode from "./components/ScanQRCode";

const App: React.FC = () => {
   const [loading, setLoading] = useState(true);
   const [needsToAuthQRCode, setNeedsToAuthQRCode] = useState(false);
   const [toggleScan, setToggleScan] = useState(false);

   useEffect(() => {
      const work = async () => {
         const uuid = await SecureStore.getItemAsync("uuid");
         if (!uuid) setNeedsToAuthQRCode(true);
         setLoading(false);
      };
      work();
   }, []);

   const attemptToWS = async () => {
      setLoading(true);
      setTimeout(() => {
         setLoading(false);
         setNeedsToAuthQRCode(false);
      }, 2000);
   };

   if (loading)
      return (
         <SafeAreaView className="flex items-center justify-center h-full">
            <Text className="text-2xl font-medium">Loading...</Text>
         </SafeAreaView>
      );

   return (
      <SafeAreaView>
         {needsToAuthQRCode ? (
            toggleScan ? (
               <ScanQRCode
                  onSuccess={async (data) => {
                     await SecureStore.setItemAsync("uuid", data);
                     setToggleScan(false);
                     await attemptToWS();
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
            <View className="flex items-center justify-center h-full">
               <Text>Auth...</Text>
            </View>
         )}
      </SafeAreaView>
   );
};

export default App;
