import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { DialogContentText } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import {caver} from "./../Config.js"

const styles = (theme) => ({
  hidden: {
    display: "none",
  },
});

class SellerLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      sellerID: 0,
      sellerPrivateKey: localStorage.SellerPrivateKey,
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
      sellerID: 0,
      sellerPrivateKey: localStorage.SellerPrivateKey,
    });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    if (caver.utils.isValidPrivateKey(this.state.sellerPrivateKey)) {
      localStorage.SellerPrivateKey = this.state.sellerPrivateKey;

      const keyring = caver.wallet.keyring.createFromPrivateKey(
        localStorage.SellerPrivateKey
      );

      localStorage.CustomerAddress = keyring.address;
      localStorage.SellerID = this.state.sellerID;

      this.handleClose();
    } else {
      alert(this.state.sellerPrivateKey + "는 유효한 개인키가 아닙니다!");
    }
  };

  handleValueChange = (e) => {
    console.log(e.target.name + " has been updated to " + e.target.value);
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  render() {
    return (
      <div>
        <IconButton
          variant="contained"
          color="inherit"
          onClick={this.handleClickOpen}
        >
          <AccountCircle />
        </IconButton>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>
            {localStorage.SellerPrivateKey
              ? "판매자 변경하기"
              : "판매자 입력하기"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              사용하고 싶은 아이디와 비밀키를 넣어주세요.
            </DialogContentText>
            <TextField
              fullWidth
              label="판매자 아이디(숫자)"
              type="text"
              name="sellerID"
              value={
                this.state.sellerID
                  ? this.state.sellerID
                  : localStorage.SellerID
              }
              onChange={this.handleValueChange}
            />
            <TextField
              fullWidth
              label="비밀키"
              type="text"
              name="sellerPrivateKey"
              value={
                this.state.sellerPrivateKey
                  ? this.state.sellerPrivateKey
                  : localStorage.SellerPrivateKey
              }
              onChange={this.handleValueChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleFormSubmit}
            >
              {localStorage.SellerPrivateKey ? "변경" : "입력"}
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

export default withStyles(styles)(SellerLogin);
