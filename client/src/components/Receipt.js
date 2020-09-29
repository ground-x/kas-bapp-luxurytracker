import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import ReceiptDelete from "./ReceiptDelete";
import ReceiptSend from "./ReceiptSend";
import AddressButton from "./AddressButton";

class Receipt extends React.Component {
  timeConverter = (UNIX_timestamp) => {
    if (isNaN(UNIX_timestamp)) {
      return UNIX_timestamp;
    }

    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  };

  render() {
    return (
      <TableRow>
        <TableCell>
          <AddressButton address={this.props.owner} />
        </TableCell>
        <TableCell>
          {/* {this.props.sender === "0x0000000000000000000000000000000000000000" ?
            ("없음(=첫 영수증 발행)")
            : (<AddressButton addr={this.props.sender})
             */}
          {this.props.sender ===
          "0x0000000000000000000000000000000000000000" ? (
            "없음(=첫 영수증 발행)"
          ) : (
            <AddressButton address={this.props.sender} />
          )}
        </TableCell>
        <TableCell>{this.props.tokenID}</TableCell>
        <TableCell>{this.props.tokenUri}</TableCell>
        <TableCell>{this.timeConverter(this.props.createdAt)}</TableCell>
        <TableCell>{this.timeConverter(this.props.updatedAt)}</TableCell>
        <TableCell>
          {this.props.isCustomerReceipts ? (
            <ReceiptSend
              stateRefresh={this.props.stateRefresh}
              contractAddr={this.props.contractAddr}
              tokenID={this.props.tokenID}
              tokenUri={this.props.tokenUri}
            />
          ) : (
            <ReceiptDelete
              id={this.props.id}
              stateRefresh={this.props.stateRefresh}
            />
          )}
        </TableCell>
      </TableRow>
    );
  }
}

export default Receipt;
