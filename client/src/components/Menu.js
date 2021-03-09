import React from "react";
import clsx from "clsx";
import { withRouter } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Box from "@material-ui/core/Box";

import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ReceiptIcon from "@material-ui/icons/Receipt";
import FaceIcon from "@material-ui/icons/Face";

import CustomerLogin from "./CustomerLogin";
import SellerLogin from "./SellerLogin";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    "text-decoration": "none",
  },

  activeLink: {
    color: "white",
  },

  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
}));

function Menu(props) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
    toCustomer: false,
    toSeller: false,
  });
  const { history } = props;
  const {
    location: { pathname },
  } = history;

  const classes = useStyles();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const clickCustomer = () => {
    // setState({ ...state, toCustomer: true, toSeller: false });
    history.push("/customer");
  };

  const clickSeller = () => {
    // setState({ ...state, toCustomer: false, toSeller: true });
    history.push("/product");
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button key="customer" onClick={clickCustomer}>
          <ListItemIcon>
            <FaceIcon />
          </ListItemIcon>
          <ListItemText primary="고객 페이지" secondary="영수증 확인 및 전송" />
        </ListItem>
        <Divider />

        <ListItem button key="seller" onClick={clickSeller}>
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText
            primary="판매자 페이지"
            secondary="제품 및 영수증 관리"
          />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer("left", true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {pathname === "/customer" ? "Customer" : "Seller"}
          </Typography>
          <div className={classes.sectionDesktop}>
            {pathname === "/customer" ? <CustomerLogin /> : <SellerLogin />}
          </div>
          {/* <Button color="white">
            <NavLink
              exact
              to="/customer"
              className={classes.button}
              activeClassName={classes.activeLink}
            >
              Customer
            </NavLink>
          </Button>

          <Button color="white">
            <NavLink
              exact
              to="/product"
              className={classes.button}
              activeClassName={classes.activeLink}
            >
              Seller
            </NavLink>
          </Button> */}
        </Toolbar>
      </AppBar>

      <div>
        {["left"].map((anchor) => (
          <React.Fragment key={anchor}>
            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              {list(anchor)}
            </Drawer>
          </React.Fragment>
        ))}
      </div>
    </Box>
  );
}

export default withRouter(Menu);
