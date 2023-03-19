import React, { useState, useEffect } from "react";
import { Button, SafeAreaView, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import Dialog from "react-native-dialog";
import { ToastProvider } from "react-native-toast-notifications";

import ScanQRCode from "./components/ScanQRCode";

import App from "./App";
import { Loading } from "./components/Loading";
import { AuthWSWrapper } from "./components/WebSocketContext";
import CustomButton from "./components/CustomButton";

const AppUnderscore: React.FC = () => {
   const [loading, setLoading] = useState(true);
   const [needsToAuthQRCode, setNeedsToAuthQRCode] = useState(false);
   const [toggleScan, setToggleScan] = useState(false);
   const [uuid, setUuid] = useState<string>("");

   const [openInputUUIDEnter, setOpenInputUUIDEnter] = useState(false);
   const [inputtedUUID, setInputtedUUID] = useState("");

   useEffect(() => {
      const work = async () => {
         // await SecureStore.deleteItemAsync("uuid");
         const uuid = await SecureStore.getItemAsync("uuid");
         if (!uuid) {
            setLoading(false);
            return setNeedsToAuthQRCode(true);
         }
         setUuid(uuid);
         setLoading(false);
      };
      work();
   }, []);

   if (loading) return <Loading />;

   const handleQRScan = async (data: string) => {
      if (data === "") return;
      await SecureStore.setItemAsync("uuid", data);
      setUuid(data);
      setToggleScan(false);
      setNeedsToAuthQRCode(false);
      if (openInputUUIDEnter) {
         setOpenInputUUIDEnter(false);
         setInputtedUUID("");
      }
   };

   return (
      <SafeAreaView>
         {needsToAuthQRCode ? (
            toggleScan ? (
               <View className="mt-12 mx-auto">
                  <ScanQRCode
                     onSuccess={handleQRScan}
                     onFail={() => console.log("error")}
                     title="Scan QR Code to Log In"
                  />
                  {__DEV__ && (
                     <CustomButton onPress={() => setOpenInputUUIDEnter(true)}>
                        Input UUID
                     </CustomButton>
                  )}
                  <Dialog.Container visible={openInputUUIDEnter}>
                     <Dialog.Title>Log In</Dialog.Title>
                     <Dialog.Description>
                        Copy past UUID here.
                     </Dialog.Description>
                     <Dialog.Input
                        placeholder="bc662760-5b98-4bd0-9c56-2676ec9dcd56"
                        onChangeText={(t) => setInputtedUUID(t)}
                     />
                     <Dialog.Button
                        label="Enter"
                        onPress={() => handleQRScan(inputtedUUID)}
                     />
                  </Dialog.Container>
               </View>
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
               <ToastProvider offsetBottom={50} textStyle={{ fontSize: 20 }}>
                  <App />
               </ToastProvider>
            </AuthWSWrapper>
         )}
      </SafeAreaView>
   );
};

export default AppUnderscore;
