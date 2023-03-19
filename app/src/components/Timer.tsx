import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import { useWS } from "./WebSocketContext";

const CountdownTimer: React.FC<{ endTime: Date }> = ({ endTime }) => {
   const { ws } = useWS();
   const [timeLeft, setTimeLeft] = useState("");

   useEffect(() => {
      const intervalId = setInterval(() => {
         const now = new Date().getTime();
         const distance = endTime.getTime() - now;

         if (distance < 0) {
            clearInterval(intervalId);
            setTimeLeft("0:00");
            ws.sendJsonMessage({ action: "getGameData" });
         } else {
            const minutes = Math.floor(
               (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
         }
      }, 1000);

      return () => clearInterval(intervalId);
   }, [endTime]);

   return <Text>{timeLeft}</Text>;
};

export default CountdownTimer;
