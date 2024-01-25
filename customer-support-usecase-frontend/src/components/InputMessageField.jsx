import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import { Box, Button, Typography } from "@mui/material";
import CompareIcon from "@mui/icons-material/Compare";
import VoiceChatIcon from "@mui/icons-material/VoiceChat";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SendIcon from "@mui/icons-material/Send";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect } from "react";
// import makeStyles from "@mui/material";

// const useStyles = makeStyles((theme) => ({
//   select: {
//     "&:before": {
//       borderBottom: "none"
//     },
//     "&:after": {
//       borderBottom: "none"
//     },
//     "&:hover:not(.Mui-disabled):before": {
//       borderBottom: "none"
//     }
//   },
//   icon: {
//     color: "white" // Customize the icon color if needed
//   }
// }));

const theme = createTheme({
  components: {
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          // Controls default (unchecked) color for the thumb
          color: "white",
          opacity: 1,
        },
        colorPrimary: {
          "&.Mui-checked": {
            // Controls checked color for the thumb
            color: "#8CEAFF",
            opacity: 1,
            // backgroundColor: "pink",
          },
        },
        track: {
          // Controls default (unchecked) color for the track
          opacity: 0.7,
          backgroundColor: "lightgray",
          ".Mui-checked.Mui-checked + &": {
            // Controls checked color for the track
            opacity: 0.5,
            backgroundColor: "#8CEAFF",
          },
        },
      },
    },
  },
});

const styles = {
  buttons: {
    quickActionButton: {
      height: "auto",
      // backgroundColor: "yellow",
      p: "0.4rem",
      m: "0rem",
      minWidth: "3rem",
      maxWidth: "2.5rem",
    },
  },
};

export default function InputMessageField({
  setCurrentContextId,
  currentContextId,
  handleMessageSend,
  onChange,
}) {
  const [contexts, setContexts] = React.useState([]);
  const [selectedContextName, setSelectedContextName] = React.useState("");
  const serverUrl = import.meta.env.VITE_BACKEND_URL;

  // const classes = useStyles();

  const contextInit = async () => {
    try {
      const response = await fetch(`${serverUrl}/contexts`);
      const data = await response.json();
      if (data.length) {
        let displayContext = data[0];
        setSelectedContextName(displayContext.title);
      }
      setContexts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    contextInit();
  }, []);

  React.useEffect(() => {
    if (currentContextId && contexts.length > 0) {
      let matchingContexts = contexts.filter(
        (context) => context.id === currentContextId,
      );
      let currentContext = matchingContexts[0];
      setSelectedContextName(currentContext.title);
    }
  }, [currentContextId]);

  const handleSetContext = (event) => {
    let newSelectedContext = contexts.find(
      (obj) => obj["title"] === event.target.value,
    );
    setCurrentContextId(newSelectedContext.id);
    setSelectedContextName(newSelectedContext.title);
  };

  const handleSend = () => {
    handleMessageSend();
  };

  React.useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        console.log("Enter key was pressed. Run your function.");
        event.preventDefault();
        handleMessageSend();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Paper
        component="form"
        sx={{
          p: "0.6rem 0.3rem 0.3rem 0.3rem",
          display: "flex",
          alignItems: "center",
          width: "100%",
          m: "0.5rem 0rem 0.5rem 0.5rem",
          flexDirection: "column",
          borderRadius: "1rem",
        }}
        onSubmit={(e) => {
          e.preventDefault(); // Prevents the default form submission
          handleMessageSend();
        }}
      >
        <Box
          sx={{
            // p: "0.5rem 0rem 0rem 0rem",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* <IconButton sx={{ p: '10px' }} aria-label="menu">
                    <MenuIcon />
                </IconButton> */}
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              width: "auto",
              p: "0rem 0.6rem 0rem 0.6rem",
              fontSize: "0.9rem",
            }}
            placeholder="Type your message here"
            inputProps={{ "aria-label": "Type your message here" }}
            onChange={onChange}
          />
          <Button
            onClick={handleSend}
            sx={{
              p: "0rem 0rem 0rem 0rem",
              m: "0.1rem 0.5rem 0rem 0rem",
              minWidth: "2rem",
              minHeight: "2rem",
            }}
          >
            <SendIcon />
          </Button>
        </Box>
        <Box
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            className="Quick Actions"
            sx={{
              display: "flex",
              alignItems: "center",
              maxWidth: "10rem",
              // backgroundColor: "yellow",
            }}
          >
            <Button sx={styles.buttons.quickActionButton} className="Summarize">
              <Tooltip title="Summarize">
                <VoiceChatIcon
                  sx={{
                    width: "1.5rem",
                    height: "1.3rem",
                  }}
                />
              </Tooltip>
            </Button>
            <Button
              sx={styles.buttons.quickActionButton}
              className="Analyze Similarity"
            >
              <Tooltip title="Analyze Similarity">
                <CompareIcon
                  sx={{
                    width: "1.5rem",
                    height: "1.3rem",
                  }}
                />
              </Tooltip>
            </Button>
            <Button
              sx={styles.buttons.quickActionButton}
              className="Sentiment of Conversation"
            >
              <Tooltip title="Sentiment of Conversation">
                <QuestionMarkIcon
                  sx={{
                    width: "1.5rem",
                    height: "1.3rem",
                  }}
                />
              </Tooltip>
            </Button>
          </Box>
          <Box
            className="Choose Context and Automcomplete"
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              maxWidth: "40rem",
              p: "0rem",
              maxHeight: "2rem",
            }}
          >
            <FormControl
              variant="standard"
              fullWidth
              sx={{
                // mb: "1rem",
                borderBottom: "none",
                p: "0.1rem",
                // backgroundColor: "yellow",
                minWidth: "auto",
                ml: "7rem",
                backgroundColor: "#dbf9ff",
                borderRadius: "2rem",
              }}
            >
              <Select
                disableUnderline="true"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedContextName}
                label="Select Context"
                // defaultValue={30}
                placeholder="place"
                displayEmpty
                onChange={handleSetContext}
                // className={classes.formControl}
                sx={{
                  p: "0rem 0rem 0rem 1rem",
                  m: "0rem 0.5rem 0.1rem 0rem",
                  boxShadow: "none",
                  maxWidth: "15rem",
                  fontSize: "0.9rem",
                  // '.MuiOutlinedInput-notchedOutline': { border: 0 }
                  borderRadius: "2rem",
                }}
              >
                <MenuItem disabled value="">
                  Select a Context
                </MenuItem>
                {contexts.map((item) => (
                  <MenuItem key={item.id} value={item.title}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Switch size="small" />}
              label={
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    mr: "0.2rem",
                  }}
                >
                  Autocomplete
                </Typography>
              }
              labelPlacement="start"
              sx={{
                // p: "0rem",
                // backgroundColor: "yellow",
                m: "0.3rem 0.3rem 0.3rem 0rem",
                fontSize: "2rem",
              }}
            />
          </Box>
        </Box>
      </Paper>
    </ThemeProvider>
  );
}
