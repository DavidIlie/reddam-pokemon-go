import React, { useState } from "react";
import { TouchableOpacity, View, Text, Modal } from "react-native";
import * as Animatable from "react-native-animatable";
import { AntDesign } from "@expo/vector-icons";

import ScanQRCode from "./ScanQRCode";
import { useWS } from "./WebSocketContext";

const Marker: React.FC<{
   top: number;
   left: number;
   roomName: string;
   prod: boolean;
}> = ({ top, left, prod, roomName }) => {
   const { ws } = useWS();
   const [openScanModal, setOpenScanModal] = useState(false);

   const handleScannedQRCode = (data: string) => {
      ws.sendJsonMessage({ action: "reportFound", room: data });
      setOpenScanModal(false);
   };

   const colors = [
      "#ef4444",
      "#f59e0b",
      "#22c55e",
      "#06b6d4",
      "#0ea5e9",
      "#3b82f6",
      "#6366f1",
   ];

   const index = parseInt(roomName.substr(-2));
   const color = colors[index % colors.length] || "#0ea5e9";

   return (
      <>
         <Animatable.View
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            className="absolute z-50"
            style={{ top, left }}
         >
            <TouchableOpacity
               onPress={() => setOpenScanModal(true)}
               className={`absolute rounded-full px-1 py-1 opacity-50 h-6 w-6`}
               style={{ backgroundColor: color }}
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
                     width={500}
                     height={500}
                  />
                  {!prod && (
                     <TouchableOpacity
                        onPress={() => handleScannedQRCode(roomName)}
                        className="px-4 py-2 mx-auto mt-2 text-center bg-blue-500 rounded-md"
                     >
                        <Text className="text-white text-lg font-medium">
                           Assume Scanned
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
