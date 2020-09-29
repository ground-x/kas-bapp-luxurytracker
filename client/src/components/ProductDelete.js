import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";

class ProductDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false, // dialog 창이 열려있는지 확인하는 용도
    };
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false, // dialog 창이 열려있는지 확인하는 용도
    });
  };

  deleteCustomer(id) {
    const url = "/api/products/" + id;
    fetch(url, {
      method: "DELETE",
    }).then((res) => this.props.stateRefresh());
  }
  render() {
    return (
      <div>
        <Button
          autoFocus
          color="inherit"
          onClick={this.handleClickOpen}
          startIcon={<DeleteIcon />}
        >
          삭제
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle onClose={this.handleClose}>삭제 경고</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              선택한 제품이 (제품 번호 {this.props.id}) 삭제됩니다.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={(e) => this.deleteCustomer(this.props.id)}
            >
              삭제
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

export default ProductDelete;
