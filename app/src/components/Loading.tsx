import React from "react";
import { SafeAreaView, Text } from "react-native";

export const Loading: React.FC = () => {
   return (
      <SafeAreaView className="flex items-center justify-center h-full">
         <Text className="text-2xl font-medium">Loading...</Text>
      </SafeAreaView>
   );
};
