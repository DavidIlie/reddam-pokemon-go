import React, { useState } from "react";
import { TouchableOpacity, View, Text, Modal } from "react-native";
import * as Animatable from "react-native-animatable";
import { AntDesign } from "@expo/vector-icons";

import ScanQRCode from "./ScanQRCode";

const Marker: React.FC<{ top: number; left: number; markerId: string }> = ({
   top,
   left,
   markerId,
}) => {
   const [openScanModal, setOpenScanModal] = useState(false);
   const [scannedUUID, setScannedUUID] = useState();
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
               className="absolute rounded-full p-2 bg-red-500 opacity-50"
            />
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
                  <View className="absolute right-0 p-2">
                     <AntDesign
                        name="close"
                        size={24}
                        color="black"
                        onPress={() => setOpenScanModal(false)}
                     />
                  </View>
                  <ScanQRCode
                     onSuccess={(data) => {
                        console.log(data);
                     }}
                     title="Scan Room"
                     width={300}
                     height={300}
                  />
               </View>
            </View>
         </Modal>
      </>
   );
};

export default Marker;
