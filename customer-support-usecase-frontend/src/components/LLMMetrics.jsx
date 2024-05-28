import React from "react";
import { useState, useEffect } from "react";
import { Box, Fab } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";

export default function LLMMetrics(props) {
  const [showMetrics, setShowMetrics] = useState(false);
  const {
    ragTime,
    firstTokenTime,
    promptTokens,
    generateTokenTime,
    serverUrl,
    outputTokens,
  } = props;

  // const getTotalTokens = async () => {
  //   try {
  //     const apiUrl = `${serverUrl}/count-tokens?sentence=${lastResponseContent}`;
  //     const response = await fetch(apiUrl);
  //     const data = await response.json();

  //     if (!response.ok) {
  //       console.log("not ok");
  //     }
  //     setOutputTokens(data.num_tokens);
  //   } catch (error) {
  //     console.log("getTotalTokens error: ", error);
  //   }
  // };

  // useEffect(() => {
  //   // Execute getTotalTokens when the component mounts
  //   getTotalTokens();
  // }, [lastResponseContent]);

  const toggleMetrics = () => {
    setShowMetrics(!showMetrics);
  };

  return (
    <>
      {!showMetrics ? (
        <Fab
          sx={{
            backgroundColor: "white",
            height: "2rem",
            width: "2.4rem",
            position: "absolute",
            top: "5rem",
            left: "1.2rem",
            boxShadow: "none",
            zIndex: "0",
          }}
        >
          <AccessTimeIcon
            color="primary"
            aria-label="add"
            onClick={toggleMetrics}
          ></AccessTimeIcon>
        </Fab>
      ) : null}
      {showMetrics && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: "5rem",
              left: "1.2rem",
              backgroundColor: "#ffffff",
              borderRadius: "1rem",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "row",
              gap: "0.5rem",
              fontSize: "1rem",
              p: "2rem 2rem 1.5rem 2rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                justifyContent: "space-between",
                //   fontWeight: "bold",
              }}
            >
              <Box>Time for RAG:</Box>
              <Box>Prompt Tokens:</Box>
              <Box>Time for 1st token:</Box>
              <Box>Output Tokens:</Box>
              <Box>Token Gen Time:</Box>
              <Box>Tokens/s:</Box>
              <Box>Total Tokens:</Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                justifyContent: "space-between",
                fontWeight: "bold",
              }}
            >
              <Box>{ragTime.toFixed(3)} s</Box>
              <Box>{promptTokens}</Box>
              <Box>{firstTokenTime / 1000} s</Box>
              <Box>{outputTokens}</Box>
              <Box>{generateTokenTime / 1000} s</Box>
              <Box>
                {generateTokenTime == 0
                  ? 0
                  : ((outputTokens * 1000) / generateTokenTime).toFixed(2)}
              </Box>
              <Box>{outputTokens + promptTokens}</Box>
            </Box>
          </Box>
          <Fab
            sx={{
              backgroundColor: "transparent",
              height: "2rem",
              width: "2.4rem",
              position: "absolute",
              top: "5.1rem",
              left: "1.4rem",
              boxShadow: "none",
            }}
          >
            <CloseIcon
              sx={{
                backgroundColor: "white",
                position: "relative",
                boxShadow: "none",
              }}
              onClick={toggleMetrics}
            ></CloseIcon>
          </Fab>
        </>
      )}
    </>
  );
}

// Mementoes 75 pieces - 11250
// WriteUp - 1200
