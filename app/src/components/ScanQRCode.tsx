import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera, CameraType } from "expo-camera";

interface ScanQRCodeProps {
   onSuccess: (data: string) => void;
   onFail: () => void;
   title?: string;
}

const ScanQRCode: React.FC<ScanQRCodeProps> = ({
   onSuccess,
   onFail,
   title = "Scan QR Code",
}) => {
   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
   const [scanned, setScanned] = useState(false);
   const [type, setType] = useState(CameraType.front);

   useEffect(() => {
      (async () => {
         const { status } = await BarCodeScanner.requestPermissionsAsync();
         setHasPermission(status === "granted");
      })();
   }, []);

   const handleBarCodeScanned = ({ data }: { data: string }) => {
      setScanned(true);
      onSuccess(data);
   };

   const handleCameraFlip = () => {
      setType(type === CameraType.front ? CameraType.back : CameraType.front);
   };

   if (hasPermission === null) {
      return (
         <View className="flex-1 justify-center items-center">
            <Text>null</Text>
         </View>
      );
   }

   if (hasPermission === false) {
      return (
         <View className="flex-1 justify-center items-center">
            <Text>No access to camera</Text>
         </View>
      );
   }

   return (
      <SafeAreaView className="mt-12">
         <Text className="text-center text-2xl font-medium">{title}</Text>
         <Camera
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 500, width: 500 }}
            type={type}
         />
         <TouchableOpacity
            className="bg-blue-500 py-2 px-4 rounded-md text-center mx-auto mt-2"
            onPress={handleCameraFlip}
         >
            <Text className="text-white font-medium text-xl">Flip Camera</Text>
         </TouchableOpacity>
      </SafeAreaView>
   );
};

export default ScanQRCode;
