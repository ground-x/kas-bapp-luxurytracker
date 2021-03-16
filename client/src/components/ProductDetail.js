import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ReceiptAdd from "./ReceiptAdd";
import ProductDelete from "./ProductDelete";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";

const styles = (theme) => ({
  hidden: {
    display: "none",
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
});

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false, // dialog 창이 열려있는지 확인하는 용도
    };
  }

  handleFormSubmit = (e) => {
    console.log("handleFormSubmit");
    e.preventDefault();

    this.addCustomer().then((response) => {
      console.log(response.data);
      this.props.stateRefresh();
    });

    this.setState({
      open: false,
    });
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    console.log("handleClose");
    this.setState({
      open: false, // dialog 창이 열려있는지 확인하는 용도
    });
  };

  handleClickContractAddr = () => {
    var win = window.open(
      "https://baobab.scope.klaytn.com/account/" +
        this.props.receipt.contractAddr,
      "_blank"
    );
    win.focus();
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button fullWidth variant="contained" onClick={this.handleClickOpen}>
          {this.props.productName}
        </Button>
        <Dialog fullScreen open={this.state.open} onClose={this.handleClose}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={this.handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {this.props.productName}
              </Typography>
              <ProductDelete
                id={this.props.productID}
                stateRefresh={this.props.stateRefresh}
              />
            </Toolbar>
          </AppBar>
          <List>
            <ListItem button>
              <ListItemText
                primary="제품명"
                secondary={this.props.productName}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary="제품 번호"
                secondary={this.props.productID}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary="컨트랙트 주소"
                secondary={this.props.contractAddr}
                onClick={this.handleClickContractAddr}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary="제품 등록일"
                secondary={this.props.registeredDate}
              />
            </ListItem>
            <Divider />
            <ReceiptAdd
              stateRefresh={this.props.stateRefresh}
              id={this.props.productID}
            />
            <Divider />
          </List>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(ProductDetail);
