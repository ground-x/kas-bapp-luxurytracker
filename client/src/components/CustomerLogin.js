import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import {caver} from "./../Config.js"

const styles = (theme) => ({
  hidden: {
    display: "none",
  },
});

class CustomerLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      customerPrivateKey: localStorage.CustomerPrivateKey,
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
      customerPrivateKey: localStorage.CustomerPrivateKey,
    });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    if (caver.utils.isValidPrivateKey(this.state.customerPrivateKey)) {
      localStorage.CustomerPrivateKey = this.state.customerPrivateKey;

      const keyring = caver.wallet.keyring.createFromPrivateKey(
        localStorage.CustomerPrivateKey
      );

      localStorage.CustomerAddress = keyring.address;

      this.handleClose();
    } else {
      alert(this.state.customerPrivateKey + "는 유효한 개인키가 아닙니다!");
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
            {localStorage.CustomerPrivateKey
              ? "사용자 변경하기"
              : "사용자 입력하기"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="PrivateKey"
              type="text"
              name="customerPrivateKey"
              value={
                this.state.customerPrivateKey
                  ? this.state.customerPrivateKey
                  : localStorage.CustomerPrivateKey
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

export default withStyles(styles)(CustomerLogin);
