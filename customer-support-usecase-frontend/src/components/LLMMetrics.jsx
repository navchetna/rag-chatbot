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
    tokensPerSec,
    setTokensPerSec,
    promptTokens,
    totalTokens,
    setTotalTokens,
    totalTime,
    serverUrl,
    prompt,
  } = props;

  const getTotalTokens = async () => {
    try {
      console.log("prompt: ", prompt);
      const apiUrl = `${serverUrl}/count-tokens?sentence=${prompt}`;
      const response = await fetch(apiUrl);
      console.log("getTotalTokens reponse: ", response);
      const data = await response.json();
      console.log("getTotalTokens reponse.json: ", data);
      if (!response.ok) {
        console.log("not ok");
      }
      setTotalTokens(data.num_tokens + promptTokens);
      console.log("totalTokens: ", totalTokens);
    } catch (error) {
      console.log("getTotalTokens error: ", error);
    }
  };

  useEffect(() => {
    // Execute getTotalTokens when the component mounts
    if (prompt != "") getTotalTokens();
  }, [ragTime]);

  const toggleMetrics = () => {
    setShowMetrics(!showMetrics);
  };

  setTokensPerSec((totalTokens * 1000) / totalTime);

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
            left: "16.3rem",
            boxShadow: "none",
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
              left: "3rem",
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
              <Box>Time for 1st token:</Box>
              <Box>Tokens/s:</Box>
              <Box>Prompt Tokens:</Box>
              <Box>Total Tokens:</Box>
              <Box>Total Time:</Box>
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
              <Box>{firstTokenTime} ms</Box>
              <Box>{tokensPerSec.toFixed(2)}</Box>
              <Box>{promptTokens}</Box>
              <Box>{totalTokens}</Box>
              <Box>{totalTime / 1000} s</Box>
            </Box>
          </Box>
          <Fab
            sx={{
              backgroundColor: "transparent",
              height: "2rem",
              width: "2.4rem",
              position: "absolute",
              top: "5.2rem",
              left: "16.1rem",
              boxShadow: "none",
            }}
          >
            <CloseIcon
              sx={{
                backgroundColor: "white",
                position: "absolute",
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
