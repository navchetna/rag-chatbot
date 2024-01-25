import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useState } from "react";
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

export default function DeleteContextDialog({
  contextId,
  setDeletedContext,
  setSelectedContextName,
}) {
  const [open, setOpen] = React.useState(false);
  const serverUrl = import.meta.env.VITE_BACKEND_URL;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteContext = (contextId) => {
    console.log("contextID: ", contextId);
    const deleteUrl = `${serverUrl}/contexts/${contextId}`;

    return fetch(deleteUrl, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setDeletedContext(contextId);
          setSelectedContextName("");
          console.log("setSelectedContextName: ", contextId);
          handleClose();
          console.log("Context Deleted");
        } else {
          console.log(response);
        }
      })
      .catch((error) => {
        console.log("Error Deleting Context: ", error);
      });
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={handleClickOpen}
      >
        Delete Context
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Typography
          variant="h4"
          sx={{
            m: "1.5rem 1rem 0rem 1.5rem",
          }}
        >
          Delete Context
        </Typography>
        <DialogContent>
          <Typography variant="h6">
            Are you sure you want to delete the selected context?
          </Typography>

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
          <Button
            variant="contained"
            onClick={() => handleDeleteContext(contextId)}
          >
            {console.log("contextId: ", contextId)}
            Delete Context
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
