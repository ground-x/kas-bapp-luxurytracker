import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import {caver} from "./../Config.js"

const axios = require("axios");

const styles = (theme) => ({
  hidden: {
    display: "none",
  },
  appBar: {
    position: "relative",
  },
});

class ProductAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      fileName: "",
      name: "",
      symbol: "",
      open: false, // dialog 창이 열려있는지 확인하는 용도
    };
  }

  deployProductContract = () => {
    const account = caver.klay.accounts.privateKeyToAccount(
      localStorage.PrivateKey
    );

    if (!caver.wallet.getKeyring(account.address)) {
      const singleKeyRing = caver.wallet.keyring.createFromPrivateKey(
        localStorage.PrivateKey
      );
      caver.wallet.add(singleKeyRing);
    }
    return caver.klay.KIP17.deploy(
      {
        name: this.state.name,
        symbol: this.state.name,
      },
      account.address
    );
  };

  addProduct = () => {
    const url = "/api/products";
    const formData = new FormData();
    formData.append("image", this.state.file);
    formData.append("filename", this.state.fileName);
    formData.append("name", this.state.name);
    formData.append("symbol", this.state.symbol);

    formData.append("sellerPrivateKey", localStorage.SellerPrivateKey);

    console.log("sellerPrivateKey: " + localStorage.SellerPrivateKey);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return axios.post(url, formData, config);
  };

  handleFormSubmit = (e) => {
    console.log("handleFormSubmit");
    e.preventDefault();

    this.addProduct().then((response) => {
      console.log(response.data);
      this.props.stateRefresh();
    });

    this.setState({
      file: null,
      fileName: "",
      name: "",
      symbol: "",
      open: false,
    });
  };

  handleFileChange = (e) => {
    console.log("filName");
    this.setState({
      file: e.target.files[0],
      fileName: e.target.value,
    });
  };

  handleValueChange = (e) => {
    console.log(e.target.name + " has been updated to " + e.target.value);
    let nextState = {};
    nextState[e.target.name] = e.target.value;
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
      file: null,
      fileName: "",
      name: "",
      symbol: "",
      open: false, // dialog 창이 열려있는지 확인하는 용도
    });
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
          제품 추가하기
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
                제품 추가하기
              </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <DialogContentText>
              제품 이미지, 제품 이름, 제품 심볼을 입력해주세요.
            </DialogContentText>
            <input
              fullWitdth
              className={classes.hidden}
              accept="image/*"
              id="raised-button-file"
              type="file"
              file={this.state.file}
              value={this.state.fileName}
              onChange={this.handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="contained"
                color="primary"
                component="span"
                name="file"
              >
                {this.state.fileName === ""
                  ? "제품 이미지 선택"
                  : this.state.fileName}
              </Button>
            </label>
            <br />
            <TextField
              fullWidth
              margin="dense"
              label="제품명"
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleValueChange}
            />
            <br />
            <TextField
              fullWidth
              margin="dense"
              label="심볼"
              type="text"
              name="symbol"
              value={this.state.symbol}
              onChange={this.handleValueChange}
            />
            <br />
          </DialogContent>
          <DialogActions>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.handleFormSubmit}
            >
              추가
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

export default withStyles(styles)(ProductAdd);
