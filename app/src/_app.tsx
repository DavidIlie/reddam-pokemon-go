import React, { useState } from "react";
import { SafeAreaView, Button } from "react-native";

import ScanQRCode from "./components/ScanQRCode";

const App: React.FC = () => {
   const [scan, setScan] = useState(false);

   return (
      <SafeAreaView>
         {scan ? (
            <ScanQRCode
               onSuccess={(data) => console.log(data)}
               onFail={() => console.log("error")}
               title="Scan QR Code to Log In"
            />
         ) : (
            <Button title="Scan QR Code" onPress={() => setScan(true)} />
         )}
      </SafeAreaView>
   );
};

export default App;
