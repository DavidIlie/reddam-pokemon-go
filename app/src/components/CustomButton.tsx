import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
   children: string | React.ReactNode;
}

const CustomButton: React.FC<ButtonProps> = ({ children, ...rest }) => (
   <TouchableOpacity
      className="px-4 py-2 mx-auto mt-2 text-center bg-blue-500 rounded-md"
      {...rest}
   >
      {typeof children === "string" ? (
         <Text className="text-xl font-medium text-white">{children}</Text>
      ) : (
         children
      )}
   </TouchableOpacity>
);

export default CustomButton;
