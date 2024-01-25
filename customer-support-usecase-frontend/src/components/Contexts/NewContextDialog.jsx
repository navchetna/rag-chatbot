import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

const buttonStyle = {
  // background: "linear-gradient(93deg, #2155BF 0%, #29D9FF 152.8%)",
  // my: "0.3rem",
  // borderRadius: "3rem",
  // fontSize: "0.75rem",
  color: "white",
  marginRight: "2rem",
  background: "linear-gradient(93deg, #2155BF 0%, #29D9FF 152.8%)",
  my: "0.3rem",
  borderRadius: "3rem",
  fontSize: "0.75rem",
  fontWieght: "bold",
  width: "100%",
  uploadButton: {
    px: "1.5rem",
    py: "0.5rem",
  },
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 3,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function NewContextDialog({ setNewContextName }) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const serverUrl = import.meta.env.VITE_BACKEND_URL;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = () => {
    setInputValue(event.target.value);
  };

  const handleCreateContext = () => {
    const URL = `${serverUrl}/contexts?title=${inputValue}`; // Replace with your API endpoint

    fetch(URL, {
      method: "POST",
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
        handleClose();
        setNewContextName(inputValue);
        // props.onContextCreated();
      })
      .catch((error) => {
        // Handle errors
        console.error("Error:", error);
      });
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        <AddIcon />
        New Context
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Context</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add the details of the new context you want to create
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Context Name"
            type="email"
            fullWidth
            variant="standard"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Box
            sx={
              {
                // b: "0rem",
              }
            }
          ></Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateContext}>
            Create New Context
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
