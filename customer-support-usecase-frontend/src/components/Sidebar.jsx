import * as React from "react";
import Box from "@mui/material/Box";
import FileTable from "./FileTable.jsx";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Paper } from "@mui/material";

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

const buttonStyle = {
  // background: "linear-gradient(93deg, #2155BF 0%, #29D9FF 152.8%)",
  // my: "0.3rem",
  // borderRadius: "3rem",
  // fontSize: "0.75rem",
  color: "white",
  marginRight: "1rem",
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

function InputFileUpload(props) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      // Perform your post-upload logic here, e.g., send the file to a server
      console.log("Selected file:", file);

      var formData = new FormData();
      formData.append("document", file);

      fetch(`${props.apiUrl}/contexts/${props.contextId}`, {
        method: "PUT",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            console.log("File uploaded!");
            props.setUpload(!props.upload);
          } else {
            console.log(response);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      props.callback();
    }
  };

  return (
    <>
      <Box
        sx={{
          pt: "1rem",
          pr: "0rem",
        }}
      >
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={Object.assign({}, buttonStyle, buttonStyle.uploadButton)}
        >
          Upload file
          <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
        </Button>
      </Box>
    </>
  );
}

export default function Navigator(props) {
  const [upload, setUpload] = React.useState(false);

  return (
    <Paper
      elevation={5}
      sx={{
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        padding: "2rem",
        paddingTop: "0.1rem",
        borderRadius: "1.5rem",
      }}
    >
      {" "}
      <h2 align="center">
        {" "}
        <b> All Files </b>{" "}
      </h2>
      <FileTable
        upload={upload}
        contextId={props.contextId}
        apiUrl={props.apiUrl}
      />
      <Box
        sx={{
          b: "0rem",
        }}
      >
        <InputFileUpload
          contextId={props.contextId}
          apiUrl={props.apiUrl}
          upload={upload}
          setUpload={setUpload}
        />
        <Button startIcon={<AddIcon />} sx={buttonStyle} variant="contained">
          {" "}
          Add Context{" "}
        </Button>
      </Box>
      {/* <h2 align="center">
        {" "}
        <b> Quick Actions </b>{" "}
      </h2>
      <Button sx={buttonStyle} variant="contained">
        {" "}
        Summarize{" "}
      </Button>
      <Button sx={buttonStyle} variant="contained">
        {" "}
        Analyse Similarity{" "}
      </Button>
      <Button sx={buttonStyle} variant="contained">
        {" "}
        Sentiment of Conversation{" "}
      </Button> */}
    </Paper>
  );
}
