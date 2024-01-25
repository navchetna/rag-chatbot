import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function AddDeleteContexts() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6">Add/Delete Files</Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Add Files" {...a11yProps(0)} />
          <Tab label="Delete Files" {...a11yProps(1)} />
        </Tabs>
      </Box>
      {/* <CustomTabPanel value={value} index={0}>
                Add Files
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Delete Files
            </CustomTabPanel> */}
      <CustomTabPanel value={value} index={0}>
        <Button variant="contained">Upload File</Button>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <FormControl
          fullWidth
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <InputLabel id="demo-simple-select-label">
            Choose files to delete
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={0}
            label="Choose files to delete"
            // onChange={handleChange}
          >
            <MenuItem value={10}>File 1</MenuItem>
            <MenuItem value={20}>File 2</MenuItem>
            <MenuItem value={30}>File 3</MenuItem>
          </Select>
          <Box>
            <Button variant="contained">Delete Files</Button>
          </Box>
        </FormControl>
      </CustomTabPanel>
    </Box>
  );
}
