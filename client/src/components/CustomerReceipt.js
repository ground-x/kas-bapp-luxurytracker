import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import ReceiptSend from "./ReceiptSend";
import CustomerReceiptDetail from "./CustomerReceiptDetail";

class CustomerReceipt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: "",
      productImage: "",
    };
  }

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

  getProduct = async () => {
    const response = await fetch("/api/products/" + this.props.tokenID);
    const body = await response.json();

    console.log("getProduct: " + body[0]);
    this.setState({
      productName: body[0]["name"],
      productImage: body[0]["image"],
    });
    return body;
  };

  componentDidMount() {
    this.timer = setInterval(this.progress, 20);
    // 모든 컴포넌트의 마운트가 완료 되었을 때
    this.getProduct()
      .then((res) => console.log("customerReceipts", res))
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <TableRow>
        <TableCell>
          <CustomerReceiptDetail
            stateRefresh={this.props.stateRefresh}
            owner={this.props.toAddr}
            sender={this.props.fromAddr}
            contractAddr={this.props.contractAddr}
            tokenID={this.props.tokenID}
            tokenUri={this.props.tokenURI}
            createdAt={this.props.registeredDate}
            updatedAt={this.props.lastUpdatedDate}
            productName={this.state.productName}
            productImage={this.state.productImage}
            receipt={this.props}
          />
        </TableCell>
        <TableCell>
          <ReceiptSend
            stateRefresh={this.props.stateRefresh}
            contractAddr={this.props.contractAddr}
            tokenID={this.props.tokenID}
            tokenUri={this.props.tokenUri}
          />
        </TableCell>
      </TableRow>
    );
  }
}

export default CustomerReceipt;
