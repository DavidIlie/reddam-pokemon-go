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
   const [type, setType] = useState(CameraType.back);

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
      setType(type === CameraType.back ? CameraType.front : CameraType.back);
   };

   if (hasPermission === null) {
      return (
         <View className="items-center justify-center flex-1">
            <Text>null</Text>
         </View>
      );
   }

   if (hasPermission === false) {
      return (
         <View className="items-center justify-center flex-1">
            <Text>No access to camera</Text>
         </View>
      );
   }

   return (
      <SafeAreaView className="mt-12">
         <Text className="text-2xl font-medium text-center">{title}</Text>
         <Camera
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 500, width: 500 }}
            type={type}
         />
         <TouchableOpacity
            className="px-4 py-2 mx-auto mt-2 text-center bg-blue-500 rounded-md"
            onPress={handleCameraFlip}
         >
            <Text className="text-xl font-medium text-white">Flip Camera</Text>
         </TouchableOpacity>
      </SafeAreaView>
   );
};

export default ScanQRCode;
