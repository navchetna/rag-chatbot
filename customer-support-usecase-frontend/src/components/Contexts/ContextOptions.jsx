import { Box, Typography, Button } from "@mui/material";
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ManageFilesTable from "./ManageFilesTable";
import NewContextDialog from "./NewContextDialog";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteContextDialog from "./DeleteContextDialog";
import { useState } from "react";

function ContextOptions() {
  const [contexts, setContexts] = React.useState([]);
  const [selectedContextName, setSelectedContextName] = React.useState("");
  const [newContextName, setNewContextName] = React.useState("");
  const [deletedDocuments, setDeletedDocuments] = React.useState([]);
  const [newContextDocumentName, setNewContextDocumentName] =
    React.useState("");
  const [deletedContext, setDeletedContext] = useState();
  const serverUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchContexts = async () => {
    try {
      const response = await fetch(`${serverUrl}/contexts`);
      const data = await response.json();
      setContexts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    console.log("Fetching contexts...");
    fetchContexts();
  }, [
    newContextName,
    newContextDocumentName,
    deletedDocuments,
    deletedContext,
  ]);

  console.log("Rendering with contexts:", contexts);

  const handleSetContext = (event) => {
    setSelectedContextName(event.target.value);
  };

  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <>
      <Box
        sx={{
          m: "4rem 20rem",
          // ml: "30rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          width: "50%",
          padding: "2rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            ml: "1rem",
            display: "flex",
            flexDirection: "row",
            width: "90%",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Button
            disableGutter
            sx={{
              maxWidth: "1rem",
              // backgroundColor: "blue",
              borderRadius: "50%",
              p: "0rem",
              height: "4rem",
              // color: "red",
            }}
            to="/"
            onClick={navigateHome}
            size="small"
          >
            <CloseIcon />
          </Button>
          <Typography variant="h3">Context Options</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            width: "80%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
            }}
          >
            <FormControl
              fullWidth
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
              }}
            >
              <InputLabel id="demo-simple-select-label">
                Select Context
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedContextName}
                label="Select Context"
                onChange={handleSetContext}
              >
                {contexts.map((item) => (
                  <MenuItem key={item.id} value={item.title}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <NewContextDialog setNewContextName={setNewContextName} />
          </Box>
          {selectedContextName !== "" ? (
            <Box>
              {console.log(
                "parent()",
                contexts.find(
                  (context) => context.title === selectedContextName
                ),
                selectedContextName,
                contexts
              )}
              <ManageFilesTable
                setNewContextDocumentName={setNewContextDocumentName}
                setDeletedDocuments={setDeletedDocuments}
                selectedContext={contexts.find(
                  (context) => context.title === selectedContextName
                )}
              />
              <DeleteContextDialog
                setDeletedContext={setDeletedContext}
                contextId={
                  contexts.find(
                    (context) => context.title === selectedContextName
                  ).id
                }
                setSelectedContextName={setSelectedContextName}
              />
            </Box>
          ) : (
            <Typography variant="h4">No Context Chosen</Typography>
          )}
        </Box>
      </Box>
    </>
  );
}

export default ContextOptions;
