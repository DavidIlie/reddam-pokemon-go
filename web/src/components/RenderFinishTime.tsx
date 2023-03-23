import React from "react";

const RenderFinishTime: React.FC<{ startTime: Date; endTime: Date }> = ({
  startTime,
  endTime,
}) => {
  const diffInMs = new Date(endTime).getTime() - new Date(startTime).getTime();
  const diffInMinutes = Math.floor(diffInMs / 1000 / 60);
  const diffInSeconds = Math.floor((diffInMs / 1000) % 60);
  return (
    <>
      {diffInMinutes}:{diffInSeconds} minutes
    </>
  );
};

export default RenderFinishTime;
