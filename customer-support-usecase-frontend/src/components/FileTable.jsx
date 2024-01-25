import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useQuery } from "react-query";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
} from "@mui/material";

const FileTable = (props) => {
  const fetchContext = async (apiUrl, contextId) => {
    const Url = `${apiUrl}/contexts/${contextId}`;
    const response = await fetch(Url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError } = useQuery("context", async () => {
    return fetchContext(props.apiUrl, props.contextId);
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (props.apiUrl && props.contextId) {
      fetchContext(props.apiUrl, props.contextId);
    }
  }, [props.upload]);

  if (isLoading || isError) {
    return <CircularProgress />;
  } else {
    const filteredFiles = data["documents"].filter((file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
      <>
        <TextField
          label="Search Files"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginBottom: "10px", width: "100%" }}
        />
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "70%",
            overflowY: "auto",
          }}
        >
          <Table sx={{ minWidth: 100 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.name}>
                  <TableCell align="right">{file.name}</TableCell>
                  <TableCell align="right">
                    <IconButton>
                      {" "}
                      <DeleteIcon />{" "}
                    </IconButton>{" "}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }
};

export default FileTable;
