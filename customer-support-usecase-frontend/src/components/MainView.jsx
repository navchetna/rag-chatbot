import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import ChatWindow from "./ChatWindow.jsx";
import RightDrawer from "./RightDrawer.jsx";
import Metrics from "./Metrics.jsx";
import { useState } from "react";

function MainView() {
  const [messageCount, setMessageCount] = useState(0);
  const [positiveMessageCount, setPositiveMessageCount] = useState(0);
  const [negativeMessageCount, setNegativeMessageCount] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = () => {
    setInputValue(event.target.value);
  };

  const updateMetrics = (
    newMessageCount,
    newPositiveMessageCount,
    newNegativeMessageCount
  ) => {
    setMessageCount(newMessageCount);
    setPositiveMessageCount(newPositiveMessageCount);
    setNegativeMessageCount(newNegativeMessageCount);
  };

  // const updateMetrics = (newMessageCount, newPositiveMessageCount, newNegativeMessageCount) => {
  //   setMessageCount((prev) => prev + newMessageCount);
  //   setPositiveMessageCount((prev) => prev + newPositiveMessageCount);
  //   setNegativeMessageCount((prev) => prev + newNegativeMessageCount);
  // };

  useEffect(() => {
    console.log("Metrics Updated: ", {
      messageCount,
      positiveMessageCount,
      negativeMessageCount,
    });
  }, [messageCount, positiveMessageCount, negativeMessageCount]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        mt: "4rem",
        maxHeight: "100vh",
        width: "100%",
        background: "linear-gradient(103deg, #2155BF 0%, #29D9FF 100.37%);",
        p: "1rem 3rem",
        justifyContent: "center",
        overflow: "hidden",
        // alignItems: "center",
      }}
    >
      <Box
        sx={{
          // flexGrow: 3,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "flex-start",
          width: "100%",
          height: "96vh",
          // mt: "5em",
        }}
      >
        <ChatWindow updateMetrics={updateMetrics} />
      </Box>
      <Box
        sx={{
          justifyContent: "top",
          px: "1rem",
          width: "6%",
        }}
      >
        <RightDrawer />
        {/* <Metrics
          messageCount={messageCount}
          positiveMessageCount={positiveMessageCount}
          negativeMessageCount={negativeMessageCount}
          updateMetrics={updateMetrics}
        /> */}
      </Box>
    </Box>
  );
}

export default MainView;
