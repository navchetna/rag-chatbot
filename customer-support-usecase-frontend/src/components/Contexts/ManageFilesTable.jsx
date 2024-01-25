import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteFilesDialog from "./DeleteFilesDialog";
import { useState } from "react";

const buttonStyle = {
  // background: "linear-gradient(93deg, #2155BF 0%, #29D9FF 152.8%)",
  // my: "0.3rem",
  // borderRadius: "3rem",
  // fontSize: "0.75rem",
  color: "white",
  // marginRight: "1rem",
  background: "linear-gradient(93deg, #2155BF 0%, #29D9FF 152.8%)",
  // my: "0.3rem",
  borderRadius: "3rem",
  fontSize: "0.75rem",
  fontWieght: "bold",
  minWidth: "40%",
  uploadButton: {
    // px: "1.5rem",
    // py: "0.5rem",
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

function createData(
  id,
  contextName,
  fileName
  // fileSize
) {
  return {
    id,
    contextName,
    fileName,
    // fileSize,
  };
}

// const rows = [
//   createData(1, "Context 1", "testFile1.txt", 1.7),
//   createData(2, "Context 2", "testFile2.txt", 2.7),
//   createData(3, "Context 3", "testFile3.txt", 3.7),
//   createData(4, "Context 4", "testFile4.txt", 4.7),
//   createData(5, "Context 5", "testFile5.txt", 5.7),
// ];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "fileName",
    numeric: true,
    disablePadding: false,
    label: "File Name",
  },
  // {
  //   id: "fileSize",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "File Size",
  // },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all files",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function InputFileUpload({ setNewContextDocumentName, contextId }) {
  const serverUrl = import.meta.env.VITE_BACKEND_URL;
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      // Perform your post-upload logic here, e.g., send the file to a server
      console.log("Selected file:", file);

      var formData = new FormData();
      formData.append("document", file);

      const URL = `${serverUrl}/contexts/${contextId}`; // Replace with your API endpoint
      fetch(URL, {
        method: "PUT",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            console.log("File uploaded!");
            setNewContextDocumentName(file.name);
          } else {
            console.log(response);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      // props.callback();
    }
  };

  return (
    <>
      <Box>
        <Button component="label" variant="contained" sx={buttonStyle}>
          <AddIcon />
          <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
        </Button>
      </Box>
    </>
  );
}

function EnhancedTableToolbar(props) {
  const { numSelected } = props;
  const [upload, setUpload] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleFileDelete = () => {
    setDeleteDialogOpen(true);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Manage Files
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          {/* <IconButton> */}
          <DeleteFilesDialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            contextId={props.contextId}
            selectedFiles={props.selectedFilesForDeletion}
            setDeletedDocuments={props.setDeletedDocuments}
          />
          {console.log(
            "props.selectedFilesForDeletion: ",
            props.selectedFilesForDeletion
          )}
          {/* </IconButton> */}
        </Tooltip>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add New File">
            <IconButton>
              <InputFileUpload
                setNewContextDocumentName={props.setNewContextDocumentName}
                contextId={props.contextId}
                apiUrl={props.apiUrl}
                upload={upload}
                setUpload={setUpload}
              />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function ManageFilesTable({
  setNewContextDocumentName,
  setDeletedDocuments,
  selectedContext,
  // setContextDocs
}) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("fileName");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(0);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = selectedContext.documents.map((n, id) => id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    console.log("id: ", id);
    // selectedFilesForDeletion.push(selectedContext.documents[id]);

    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    console.log("selectedContext[id]", selectedContext.documents[id]);
    console.log("selectedFilesForDeletion: ", selectedFilesForDeletion);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box
      sx={{
        width: "auto",
        // maxWidth: "30rem",
        fontSize: "2rem",
      }}
    >
      <Paper sx={{ width: "auto", mb: 2 }}>
        <EnhancedTableToolbar
          setNewContextDocumentName={setNewContextDocumentName}
          setDeletedDocuments={setDeletedDocuments}
          contextId={selectedContext?.id}
          numSelected={selected.length}
          selectedFilesForDeletion={selected.map(
            (index) => selectedContext.documents[index]
          )}
        />
        <TableContainer>
          <Table
            sx={{
              minWidth: "20rem",
              // fontSize: "2rem",
            }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={selectedContext && selectedContext.documents.length}
            />
            <TableBody
              sx={{
                pr: "5rem",
              }}
            >
              {console.log("Selected Context:", selectedContext)}
              {selectedContext &&
                selectedContext.documents.map((doc, docId) => {
                  const isItemSelected = isSelected(docId);
                  const labelId = `enhanced-table-checkbox-${docId}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, docId)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={docId}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      {/* <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      ></TableCell> */}

                      <TableCell padding="normal" align="right">
                        {doc.name}
                        {console.log("isItemSelected", isItemSelected)}
                      </TableCell>
                    </TableRow>
                  );
                })}

              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
