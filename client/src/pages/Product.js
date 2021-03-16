import React from "react";
import ProductPage from "./ProductPage";
import ReceiptPage from "./ReceiptPage";
import Container from "@material-ui/core/Container";

const Product = ({ location, match }) => {
  return (
    <Container>
      {match.params.id && <ReceiptPage id={match.params.id} />}
      {!match.params.id && <ProductPage />}
    </Container>
  );
};

export default Product;
