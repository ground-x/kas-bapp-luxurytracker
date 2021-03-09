import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

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
});

class CustomerReceiptDetail extends React.Component {
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
            </Toolbar>
          </AppBar>
          <List>
            <ListItem>
              <img src={this.props.productImage}  alt="product_image"/>
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary="제품명"
                secondary={this.props.productName}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary="영수증 일련번호"
                secondary={this.props.receipt.tokenID}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary="소유자"
                secondary={this.props.receipt.owner}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary="보낸이"
                secondary={this.props.receipt.sender}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary="컨트랙트 주소"
                secondary={this.props.receipt.contractAddr}
                onClick={this.handleClickContractAddr}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary="영수증 수령일"
                secondary={this.props.receipt.updatedAt}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary="영수증 발급일"
                secondary={this.props.receipt.createdAt}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary="기타 정보"
                secondary={this.props.receipt.tokenUri}
              />
            </ListItem>
          </List>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(CustomerReceiptDetail);
