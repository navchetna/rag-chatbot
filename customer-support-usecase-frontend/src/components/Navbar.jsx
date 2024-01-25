import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import intelLogo from "/intel.svg";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import RightDrawer from "./RightDrawer";

function Navbar() {
  const pages = [];

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ boxShadow: "none" }}>
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <a href="/">
            <img
              src={intelLogo}
              style={{ maxWidth: "4rem", minWidth: "4rem", marginLeft: "1rem" }}
              alt="Intel logo"
            />
          </a>
          <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
            <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
              <Button>Button</Button>
              {/* <RightDrawer /> */}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
