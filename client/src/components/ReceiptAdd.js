import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import TextareaComponent from "./TextareaComponent";

const axios = require("axios");

const styles = (theme) => ({
  hidden: {
    display: "none",
  },
});

class ReceiptAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toAddr: "",
      open: false, // dialog 창이 열려있는지 확인하는 용도
    };
  }

  addReceipt = () => {
    const url = "/api/receipts";
    const formData = new FormData();
    formData.append("toAddr", this.state.toAddr);
    formData.append("sellerPrivateKey", localStorage.SellerPrivateKey);

    console.log("sellerPrivateKey: " + localStorage.SellerPrivateKey);
    const config = {
      //   headers: {
      //     "content-type": "application/x-www-form-urlencoded",
      //   },
    };
    return axios.post(
      url,
      {
        sellerID: localStorage.SellerID,
        sellerPrivateKey: localStorage.SellerPrivateKey,
        productID: this.props.id,
        toAddr: this.state.toAddr,
      },
      config
    );
  };

  handleFormSubmit = (e) => {
    console.log("handleFormSubmit");
    e.preventDefault();

    this.addReceipt().then((response) => {
      console.log("response.data", response.data);
      console.log(this);
      this.props.stateRefresh();
    });

    this.setState({
      toAddr: "",
      registeredDate: "",
      open: false,
    });
  };

  handleValueChange = (e) => {
    console.log("this.id", this.props.id);
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
    nextState["toAddr"] = e.target.value;
    this.setState(nextState);
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    console.log("handleClose");
    this.setState({
      toAddr: "",
      open: false, // dialog 창이 열려있는지 확인하는 용도
    });
  };

  render() {
    return (
      <div>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={this.handleClickOpen}
        >
          영수증 발행하기
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>영수증 발행하기</DialogTitle>
          <DialogContent>
            <TextareaComponent
              handleValueChangeQR={this.handleValueChangeQR}
              someValue="333"
            />
            <TextField
              label="수령인 지갑 주소"
              type="text"
              name="toAddr"
              value={this.state.toAddr}
              onChange={this.handleValueChange}
            />
            <br />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleFormSubmit}
            >
              추가
            </Button>
            <Button
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

export default withStyles(styles)(ReceiptAdd);
