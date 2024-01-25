import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import intelLogo from "/intel.svg";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
    /**
     * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
     * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
     * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
     * proper interaction with the underlying content.
     */
    position: "relative",
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export default function RightDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleChange = () => {
    history.push("/manageContexts");
  };

  return (
    <Box
      sx={{
        display: "flex",
        // width: "auto",
      }}
    >
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <a href="/">
            <img
              src={intelLogo}
              style={{ maxWidth: "4rem", minWidth: "4rem", marginLeft: "1rem" }}
              alt="Intel logo"
            />
          </a>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            sx={{ ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerOpen}
                sx={{ ...(open && { display: 'flex' }) }}
            >
                <Box sx={{
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0.4rem",
                    minWidth: "2rem",
                    minHeight: "2rem",
                }}
                >
                    <ChevronLeftIcon />
                </Box>
            </IconButton> */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem key="Chatbot" disablePadding>
            <Button
              sx={{
                padding: "0rem",
                margin: "0rem",
                display: "flex",
                flexDirection: "row",
                gap: "2rem",
                m: "0.4rem 1rem",
                alignItems: "space-around",
                justifyContent: "center",
                color: "black",
              }}
              component={Link}
              to="/"
            >
              <InboxIcon />
              <Typography variant="h7">Chatbot</Typography>
            </Button>
          </ListItem>
          <ListItem key="ManageContext" disablePadding>
            {/* <ListItemButton> */}
            <Button
              sx={{
                padding: "0rem",
                margin: "0rem",
                display: "flex",
                flexDirection: "row",
                gap: "2rem",
                m: "0.4rem 1rem",
                alignItems: "space-around",
                justifyContent: "center",
                color: "black",
              }}
              component={Link}
              to="/manageContexts"
            >
              <MailIcon />
              <Typography variant="h7">Manage Contexts</Typography>
            </Button>
            {/* <ListItemText primary="Manage Context" /> */}
            {/* </ListItemButton> */}
          </ListItem>
        </List>
        <Divider />
      </Drawer>
    </Box>
  );
}
