import React, { useState } from "react";
import { TouchableOpacity, View, Text, Modal } from "react-native";
import * as Animatable from "react-native-animatable";
import { AntDesign } from "@expo/vector-icons";

import ScanQRCode from "./ScanQRCode";
import { useWS } from "./WebSocketContext";

const Marker: React.FC<{
   top: number;
   left: number;
   right: number;
   bottom: number;
   roomName: string;
}> = ({ top, bottom, left, right, roomName }) => {
   const { ws } = useWS();
   const [openScanModal, setOpenScanModal] = useState(false);

   const handleScannedQRCode = (data: string) => {};

   return (
      <>
         <Animatable.View
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            className="absolute z-50"
            style={top === 0 && left === 0 ? { bottom, right } : { top, left }}
         >
            <TouchableOpacity
               onPress={() => setOpenScanModal(true)}
               className="absolute rounded-full px-1 py-1 bg-red-500 opacity-50 h-6 w-6"
            >
               <Text
                  style={{ fontSize: 6 }}
                  className="text-center mt-1 text-white font-bold"
               >
                  {roomName}
               </Text>
            </TouchableOpacity>
         </Animatable.View>
         <Modal
            transparent={true}
            visible={openScanModal}
            onRequestClose={() => {
               setOpenScanModal(false);
            }}
         >
            <View
               className="flex h-full justify-center items-center"
               style={{ backgroundColor: "rgba(00, 00, 00, 0.6)" }}
            >
               <View className="bg-white rounded-md py-2 px-4 border-2 border-gray-300">
                  <View className="absolute right-0 p-2 z-50">
                     <AntDesign
                        name="close"
                        size={24}
                        color="black"
                        onPress={() => setOpenScanModal(false)}
                     />
                  </View>
                  <ScanQRCode
                     onSuccess={handleScannedQRCode}
                     title={`Scan ${roomName}`}
                     width={300}
                     height={300}
                  />
                  {__DEV__ && (
                     <TouchableOpacity
                        onPress={() => handleScannedQRCode(roomName)}
                        className="px-4 py-2 mx-auto mt-2 text-center bg-blue-500 rounded-md"
                     >
                        <Text className="text-white text-lg font-medium">
                           Assume Scanned (dev)
                        </Text>
                     </TouchableOpacity>
                  )}
               </View>
            </View>
         </Modal>
      </>
   );
};

export default Marker;
