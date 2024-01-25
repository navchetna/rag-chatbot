import React from "react";
import Fab from "@mui/material/Fab";
import BarChartIcon from "@mui/icons-material/BarChart";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography, Box } from "@mui/material";

export default function Metrics({
  messageCount,
  positiveMessageCount,
  negativeMessageCount,
  updateMetrics,
}) {
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

  return (
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
        <DialogTitle variant="h4">Metrics</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                // gap: "0.55rem",
              }}
            >
              <Typography
                variant="h6"
                // color="blue"
                sx={
                  {
                    // pt: "0.2rem",
                  }
                }
              >
                Number of messages sent:
              </Typography>
              <Typography
                variant="h6"
                // color="green"
              >
                Number of Positive Responses:
              </Typography>
              <Typography
                variant="h6"
                // color="red"
              >
                Number of Negative Responses:
              </Typography>
              {/* <Typography color="orange">
                                Ratio of Positive to Negative:
                            </Typography> */}
            </Box>
            <Box
              sx={{
                ml: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <Typography variant="h5" color="blue">
                {messageCount}
              </Typography>
              <Typography variant="h5" color="green">
                {positiveMessageCount}
              </Typography>
              <Typography variant="h5" color="red">
                {negativeMessageCount}
              </Typography>
              <Typography variant="h5" color="orange">
                {/* {(positiveMessageCount && negativeMessageCount) ? positiveMessageCount : "0"} */}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="contained" onClick={handleCreateContext}>
                Create New Context
              </Button> */}
        </DialogActions>
      </Dialog>
    </Fab>
  );
}
