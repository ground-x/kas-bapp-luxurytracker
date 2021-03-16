import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextareaComponent from "./TextareaComponent";

const axios = require("axios");
const styles = (theme) => ({
  hidden: {
    display: "none",
  },
  appBar: {
    position: "relative",
  },
});

class ReceiptSend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      receiverAddr: "",
    };
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
      receiverAddr: "",
    });
  };

  handleFormSubmit = (e) => {
    console.log("handleFormSubmit");
    e.preventDefault();

    this.sendReceipt().then((response) => {
      console.log(response.data);
      this.props.stateRefresh();
    });

    this.setState({
      receiverAddr: "",
      open: false,
    });
  };

  handleValueChange = (e) => {
    console.log(e.target.name + " has been updated to " + e.target.value);
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  handleValueChangeQR = (e) => {
    console.log("this.id", this.props.id);
    console.log(
      e.target.name + " has been updated to by QR scan" + e.target.value
    );
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    nextState["receiverAddr"] = e.target.value;
    this.setState(nextState);
  };

  sendReceipt = () => {
    const url = "/api/receipts/send";
    console.log("customerPrivateKey: " + localStorage.CustomerPrivateKey);
    console.log("contractAddr", this.props.contractAddr);
    console.log("tokenId", this.props.tokenID);
    const config = {
      //   headers: {
      //     "content-type": "application/x-www-form-urlencoded",
      //   },
    };
    return axios.post(
      url,
      {
        customerPrivateKey: localStorage.CustomerPrivateKey,
        contractAddr: this.props.contractAddr,
        tokenId: this.props.tokenID,
        receiverAddr: this.state.receiverAddr,
      },
      config
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={this.handleClickOpen}
        >
          전송
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
                영수증 전송하기
              </Typography>
            </Toolbar>
          </AppBar>
          <DialogTitle>영수증 전송하기</DialogTitle>

          <DialogContent>
            <DialogContentText>
              아래의 영수증을 전송하시겠습니까?
            </DialogContentText>
            <DialogContentText>
              영수증 번호: {this.props.tokenID}
            </DialogContentText>
            <DialogContentText>
              영수증 정보: {this.props.tokenUri}
            </DialogContentText>
            <TextareaComponent
              handleValueChangeQR={this.handleValueChangeQR}
              someValue="333"
            />
            <TextField
              required
              fullWidth
              label="전송할 주소"
              type="text"
              name="receiverAddr"
              value={this.state.receiverAddr}
              onChange={this.handleValueChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.handleFormSubmit}
            >
              전송
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={this.handleClose}
            >
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(ReceiptSend);
