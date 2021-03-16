import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import ProductDetail from "./ProductDetail";
import { NavLink } from "react-router-dom";

class Product extends React.Component {
  handleClick = () => {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = this.props.contractAddr;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    alert(this.props.contractAddr + "가 클립보드에 복사되었습니다!");
  };

  render() {
    return (
      <TableRow>
        <TableCell>
          <img src={this.props.image} alt="product_image"/>
        </TableCell>
        <TableCell>
          <ProductDetail
            stateRefresh={this.props.stateRefresh}
            productID={this.props.id}
            productImage={this.props.image}
            productName={this.props.name}
            productSymbol={this.props.symbol}
            registeredDate={this.props.registeredDate}
            contractAddr={this.props.contractAddr}
          />
        </TableCell>
        <TableCell>
          {" "}
          <NavLink to={"/product/" + this.props.id}>
            <Button fullWidth variant="contained" color="primary">
              영수증
            </Button>
          </NavLink>
        </TableCell>
      </TableRow>
    );
  }
}

export default Product;
