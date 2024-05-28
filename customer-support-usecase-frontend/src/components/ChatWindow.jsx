import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import React, { useEffect, useState, useRef } from "react";
import DehazeIcon from "@mui/icons-material/Dehaze";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { SSE } from "sse.js";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import InputMessageField from "./InputMessageField";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PieChart } from "@mui/x-charts/PieChart";
import ReplayIcon from "@mui/icons-material/Replay";

import Fab from "@mui/material/Fab";
import BarChartIcon from "@mui/icons-material/BarChart";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LLMMetrics from "./LLMMetrics";

const chatWindowStyles = {
  root: {
    backgroundColor: "#F4F6FF",
    // color: "red",
    display: "flex",
    flexDirection: "column",
    height: "90%",
    width: "70%",
    padding: "0.5rem 1rem 0.5rem 0.5rem",
    borderRadius: "1.5rem",
    margin: "0rem 0rem 0rem 5rem",
    flexShrink: 0,
  },
  messagesContainer: {
    flexGrow: 1,
    overflow: "auto",
    // marginBottom: "1rem",
    padding: "0rem",
    width: "auto",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },

  message: {
    backgroundColor: "#8CEAFF",
    width: "fit-content",
    marginBottom: "10px",
    borderRadius: "1rem 1rem 0rem 1rem",
    boxShadow: "5px 4px 15px 4px rgba(0, 0, 0, 0.07)",
    padding: "1rem",
    color: "black",
    margin: "1rem",
    display: "flex",
    flexDirection: "row",
    maxWidth: "25rem",
    ai: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      backgroundColor: "#8CEAFF",
      width: "fit-content",
      marginBottom: "8px",
      borderRadius: "1rem 1rem 1rem 0rem",
      boxShadow: "5px 4px 15px 4px rgba(0, 0, 0, 0.07)",
      padding: "1rem",
      color: "black",
      margin: "1rem 0rem 1rem 1rem",
      maxWidth: "40rem",
      fontSize: "1rem",
    },
    human: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      backgroundColor: "#c7efff",
      width: "fit-content",
      marginBottom: "8px",
      borderRadius: "1rem 1rem 0rem 1rem",
      boxShadow: "5px 4px 15px 4px rgba(0, 0, 0, 0.07)",
      padding: "1rem",
      color: "black",
      margin: "1rem",
      maxWidth: "35rem",
      fontSize: "1rem",
    },
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "0rem",
    margin: "0rem",
  },
  textField: {
    flexGrow: 1,
    p: "0rem",
    m: "0rem",
  },
  button: {
    backgroundColor: "#2155BF",
    mb: "1rem",
    width: "15rem",
  },
  buttonStyle: {
    color: "white",
    background: "linear-gradient(93deg, #2155BF 0%, #29D9FF 152.8%)",
    my: "0.3rem",
    borderRadius: "3rem",
    fontSize: "0.75rem",
    fontWieght: "bold",
    quickActions: {
      color: "white",
      background: "linear-gradient(93deg, #2155BF 0%, #29D9FF 152.8%)",
      borderRadius: "3rem",
      fontSize: "0.75rem",
      margin: "0.25rem 0.5rem",
      padding: "0.5rem 0rem 0.5rem 0.8rem",
      fontWeight: "bold",
      letterSpacing: "0.1rem",
      width: "auto",
      paddingRight: "0.2rem",
    },
    feedback: {
      margin: "0rem",
      padding: "0rem 0rem 0rem 1rem",
      width: "auto",
      positive: {
        // bacgrou: "linear-gradient(93deg, #2155BF 0%, #29D9FF 152.8%)",
        borderRadius: "0.5rem",
        fontSize: "0.75rem",
        margin: "0rem",
        padding: "0.25rem 1.1rem",
        fontWeight: "bold",
        letterSpacing: "0.1rem",
        maxWidth: "2rem",
        minWidth: "2rem",
      },
      negative: {
        // color: "linear-gradient(93deg, #2155BF 0%, #29D9FF 152.8%)",
        borderRadius: "0.5rem",
        fontSize: "0.75rem",
        margin: "0rem",
        padding: "0.25rem 1.1rem",
        fontWeight: "bold",
        letterSpacing: "0.1rem",
        maxWidth: "2rem",
        minWidth: "2rem",
      },
    },
  },
  quickActionsMenu: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center", // Align items in a column
    width: "auto",
  },
};
const fetchSession = async (apiUrl, sessionId) => {
  const Url = `${serverUrl}/sessions/${sessionId}`;
  const response = await fetch(Url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const ChatWindow = ({ updateMetrics, props }) => {
  const [newMessage, setNewMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const scrollContainerRef = useRef(null);
  const [newMessages, setNewMessages] = useState([]);
  const [data, setData] = useState(null);
  const [currentContextId, setCurrentContextId] = useState(null);
  const serverUrl = import.meta.env.VITE_BACKEND_URL;
  const sessionId = import.meta.env.VITE_SESSION_ID;
  const max_new_tokens = parseInt(import.meta.env.VITE_MAX_NEW_TOKENS);
  const getAllMessages = () =>
    (data == undefined) | (data == null) | (currentContextId == null)
      ? []
      : [...data["messages"][currentContextId], ...newMessagesInCurrentContext];
  const [ragTime, setRagTime] = useState(0);
  const [firstTokenTime, setFirstTokenTime] = useState(0);
  const [promptTokens, setPromptTokens] = useState(0);
  const [running, setRunning] = useState(false);
  const [generateTokenTime, setGenerateTokenTime] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0);

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        const Url = `${serverUrl}/sessions/${sessionId}`;
        const response = await fetch(Url);
        const result = await response.json();
        if (Object.keys(result["messages"]).length !== 0) {
          let firstContextId = Object.keys(result["messages"])[0];
          setCurrentContextId(firstContextId);
        }
        setData(result);
      } catch (error) {
        // Handle errors if any
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Trigger the fetch once when the component mounts

    // If you want to prevent re-fetching on subsequent renders, omit dependencies or use an empty dependency array
  }, [serverUrl, sessionId]);
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  };

  useEffect(() => {
    // Scroll to bottom when component mounts or when newMessages change
    setTimeout(() => scrollToBottom(), 150);
  }, [newMessages, currentContextId]);

  const handleMessageSend = async () => {
    console.log("Inside handleMessageSend:");
    if (!newMessage.trim()) return;
    const humanMessage = {
      session_id: sessionId,
      role: "human",
      content: newMessage,
      feedback: 0,
      context_id: currentContextId,
    };
    setRunning(true);
    console.log("Running: ", running);
    setNewMessages([...newMessages, humanMessage]);

    //get the prompts
    const apiUrl = `${serverUrl}/prompts/chatbot?context_id=${currentContextId}&session_id=${sessionId}&query=${newMessage}`;
    console.log(apiUrl);
    setNewMessage("");
    const response = await fetch(apiUrl);
    console.log("ragResponse: ", response);
    if (!response.ok) {
      console.log("not ok");
    }
    const data = await response.json();
    console.log("ragResponse.json: ", data);
    setRagTime(data.RAG_TIME);
    setPromptTokens(data.num_tokens);

    const sseUrl = `${import.meta.env.VITE_SSE_URL}/generate_stream`;

    const aiMessage = {
      session_id: sessionId,
      role: "ai",
      content: "",
      feedback: 0,
      context: [],
      context_id: currentContextId,
    };

    const ssePayload = {
      inputs: data["prompt"],
      parameters: {
        best_of: 1,
        details: true,
        do_sample: true,
        max_new_tokens: max_new_tokens,
        repetition_penalty: 1.03,
        return_full_text: false,
        stop: [
          "<|eot_id|>"
        ],
        seed: null,
        temperature: 0.1,
        top_k: null,
        top_n_tokens: null,
        top_p: null,
        truncate: null,
        typical_p: 0.95,
        watermark: true,
      },
    };
    const eventSource = new SSE(sseUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      payload: JSON.stringify(ssePayload),
    });

    let start = Date.now();
    let tokenGenerateTime = 0;
    let firstTokenReceived = false;

    eventSource.addEventListener("message", function (event) {
      const data = JSON.parse(event.data);
      if (!firstTokenReceived) {
        firstTokenReceived = true;
        tokenGenerateTime = Date.now();
        setFirstTokenTime(Date.now() - start);
      }
      console.log("Received data:", data);
      if (
        data["details"] !== null &&
        data["details"] !== undefined &&
        "finish_reason" in data["details"]
      ) {
        setGenerateTokenTime(Date.now() - tokenGenerateTime);
        setOutputTokens(data["details"]["generated_tokens"]);
        eventSource.close();
      } else {
        aiMessage["content"] += data["token"]["text"];
        setNewMessages([...newMessages, humanMessage, aiMessage]);
      }
    });

    console.log("Outside eventSource message");

    eventSource.addEventListener("abort", function (event) {
      console.log("eventSource closed");

      const postData = [humanMessage, aiMessage];

      const URL = `${serverUrl}/messages/`; // Replace with your API endpoint
      console.log(JSON.stringify(postData));

      fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type
          // Add other headers as needed
        },
        body: JSON.stringify(postData), // Convert the JavaScript object to a JSON string
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json(); // Parse the JSON response
        })
        .then((data) => {
          // Handle the response data
          console.log("Response:", data);
          aiMessage["id"] = data["message_ids"][1];
          humanMessage["id"] = data["message_ids"][0];
          setNewMessages([...newMessages, humanMessage, aiMessage]);
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });
    });
    console.log("Outside eventSource abort");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePopoverClick = (event) => {
    setPopoverAnchorEl(event.currentTarget);
    handleMenuClose(); // Close the Quick Actions menu
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const handleMessageFeedback = async (message, feedback) => {
    message.feedback = feedback;
    // updateMetrics(1, feedback === 1 ? 1 : 0, feedback === -1 ? 1 : 0);
    if (message.id === undefined || message.id === null) {
      //This if block handles the case where the newly created response is liked
      message.feedback = feedback;
    } else {
      const URL = `${serverUrl}/messages/${message.id}?feedback=${feedback}`; // Replace with your API endpoint

      fetch(URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Specify the content type
          // Add other headers as needed
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json(); // Parse the JSON response
        })
        .then((data) => {
          // Handle the response data
          console.log("Response:", data);
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });
    }
    const allMessages = getAllMessages();
    setMessageCount(allMessages.length);
    setPositiveMessageCount(
      allMessages.filter((message) => message.feedback === 1).length
    );
    setNegativeMessageCount(
      allMessages.filter((message) => message.feedback === -1).length
    );
    // updateMetrics(
    //       allMessages.length,
    //       allMessages.filter((message) => message.feedback === 1).length,
    //       allMessages.filter((message) => message.feedback === -1).length,
    //     );

    // You can add logic here for different actions
  };
  const handleQuickAction = (action) => {
    // Perform action based on the selected quick action
    setAnchorEl(null);
    // You can add logic here for different actions
    console.log("Performing action:", action);
  };

  const newMessagesInCurrentContext = newMessages.filter(
    (obj) => obj.context_id === currentContextId
  );
  const allMessages = getAllMessages();

  const [messageCount, setMessageCount] = useState(0);
  const [positiveMessageCount, setPositiveMessageCount] = useState(0);
  const [negativeMessageCount, setNegativeMessageCount] = useState(0);

  useEffect(() => {
    const allMessages = getAllMessages();
    setMessageCount(allMessages.length);
    setPositiveMessageCount(
      allMessages.filter((message) => message.feedback === 1).length
    );
    setNegativeMessageCount(
      allMessages.filter((message) => message.feedback === -1).length
    );
  }, [currentContextId, data, newMessages]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    // updateMetrics(messageCount, positiveMessageCount, negativeMessageCount);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = () => {
    setInputValue(event.target.value);
  };

  const handleRegenerateResponse = () => {};
  return (
    <>
      <Paper style={chatWindowStyles.root} elevation={5}>
        <LLMMetrics
          ragTime={ragTime}
          firstTokenTime={firstTokenTime}
          promptTokens={promptTokens}
          generateTokenTime={generateTokenTime}
          serverUrl={serverUrl}
          outputTokens={outputTokens}
        />
        <Box
          ref={scrollContainerRef}
          style={chatWindowStyles.messagesContainer}
        >
          {allMessages.map((message, index) => (
            <Box
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: message.role === "ai" ? "flex-start" : "flex-end",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: message.role === "ai" ? "row" : "row-reverse",
                  alignItems: "center",
                }}
              >
                <Box
                  key={index}
                  style={
                    message.role === "ai"
                      ? chatWindowStyles.message.ai
                      : chatWindowStyles.message.human
                  }
                >
                  <Typography variant="h7">{message.content}</Typography>
                </Box>
                {message.role === "ai" ? (
                  <Box
                    style={chatWindowStyles.buttonStyle.feedback}
                    mb="0.5rem"
                  >
                    <Button
                      key={index}
                      style={{
                        ...chatWindowStyles.buttonStyle.feedback.positive,
                        backgroundColor:
                          message.feedback === 1 ? "#2155BF" : undefined, // Modify the style here
                      }}
                      onClick={() => handleMessageFeedback(message, 1)}
                      title="Positive Feedback"
                    >
                      {message.id && (
                        <ThumbUpIcon
                          size="small"
                          sx={{
                            width: "1.2rem",

                            color: message.feedback === 1 ? "white" : undefined,
                          }}
                        />
                      )}
                    </Button>
                    <Button
                      key={index}
                      style={{
                        ...chatWindowStyles.buttonStyle.feedback.negative,
                        backgroundColor:
                          message.feedback === -1 ? "#2155BF" : undefined, // Modify the style here
                      }}
                      onClick={() => handleMessageFeedback(message, -1)}
                      title="Negative Feedback"
                    >
                      {message.id && (
                        <ThumbDownIcon
                          sx={{
                            width: "1.2rem",
                            color:
                              message.feedback === -1 ? "white" : undefined,
                          }}
                        />
                      )}
                    </Button>
                  </Box>
                ) : null}
              </Box>
            </Box>
          ))}
        </Box>
        <Box style={chatWindowStyles.inputContainer}>
          <InputMessageField
            style={chatWindowStyles.textField}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
            handleMessageSend={handleMessageSend}
            currentContextId={currentContextId}
            setCurrentContextId={setCurrentContextId}
          ></InputMessageField>
        </Box>
      </Paper>
      {/* <Box>
        <Typography variant="body1">Total Messages Sent: {messageCount}</Typography>
        <Typography variant="body1">Positive Responses: {positiveMessageCount}</Typography>
        <Typography variant="body1">Negative Responses: {negativeMessageCount}</Typography>
      </Box> */}
      {/* <Metrics /> */}
      <Fab
        size="small"
        color="secondary"
        aria-label="add"
        sx={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
        }}
      >
        <Button onClick={handleClickOpen}>
          <BarChartIcon />
        </Button>
        {/* <BarChartIcon /> */}
        <Dialog open={open} onClose={handleClose}>
          <Box
            sx={{
              borderRadius: "2rem",
            }}
          >
            <DialogTitle
              variant="h4"
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              Metrics
              <IconButton
                onClick={handleClose}
                sx={{
                  padding: "0rem 0rem 0rem 0rem",
                  minHeight: "1rem",
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  paddingLeft: "0rem",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "auto",
                  height: "auto",
                }}
              >
                {positiveMessageCount === 0 && negativeMessageCount === 0 ? (
                  <Typography variant="h5">
                    Please give feedback for Responses
                  </Typography>
                ) : (
                  <PieChart
                    series={[
                      {
                        data: [
                          {
                            id: 0,
                            value: positiveMessageCount,
                            color: "#2155BF",
                            label: "Positive Responses",
                          },
                          {
                            id: 1,
                            value: negativeMessageCount,
                            color: "#FF3F3F",
                            label: "Negative Responses",
                          },
                        ],
                        innerRadius: 70,
                        outerRadius: 100,
                      },
                    ]}
                    width={500}
                    height={200}
                  />
                )}
              </Box>
            </DialogContent>
          </Box>
        </Dialog>
      </Fab>
    </>
  );
};

export default ChatWindow;
