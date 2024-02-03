import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-domButton"

const drawerWidth = 240;
const navItems = [
  ["Products", 0, "/"],
  ["Edit Product", 1, "/admin/edit-product"],
  ["Cart", 1, "/user/cart"],
  ["Orders", 1, "/user/orders"],
  ["Add Product", 1, "/admin/add-product"],
  ["Logout", 1, "/"],
  ["Login", 2, "/auth/login"],
];

export function Header(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        YOUR SHOP
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item[0]} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText
                onClick={() => navigate(item[2])}
                primary={item[0]}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            YOUR SHOP
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => {
              return item[1] !== 0 ? (
                item[1] === 1 ? (
                  props.isAuthenticated && (
                    <Button
                      key={item[0]}
                      sx={{ color: "#fff" }}
                      onClick={() => navigate(item[2])}
                    >
                      {item[0]}
                    </Button>
                  )
                ) : (
                  !props.isAuthenticated && (
                    <Button
                      key={item[0]}
                      sx={{ color: "#fff" }}
                      onClick={() => navigate(item[2])}
                    >
                      {item[0]}
                    </Button>
                  )
                )
              ) : (
                <Button
                  key={item[0]}
                  sx={{ color: "#fff" }}
                  onClick={() => navigate(item[2])}
                >
                  {item[0]}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 1 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}

Header.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

// export default Header;
