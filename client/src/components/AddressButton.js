import React from "react";
import Button from "@material-ui/core/Button";
import FileCopyIcon from "@material-ui/icons/FileCopy";

class AddressButton extends React.Component {
  handleClick = () => {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = this.props.address;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    alert(this.props.address + "가 클립보드에 복사되었습니다!");
  };

    //
  render() {
    return (
      <Button variant="contained" onClick={this.handleClick}>
        <FileCopyIcon />
        {this.props.address.slice(0, 6) + "...." + this.props.address.slice(-4)}
      </Button>
    );
  }
}

export default AddressButton;
