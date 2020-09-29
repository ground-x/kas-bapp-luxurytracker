import React from "react";
import queryString from "query-string";
import ProductPage from "./ProductPage";
import ReceiptPage from "./ReceiptPage";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";

// const styles = (theme) => ({
//   container: {
//     height: "100vh",
//   },
// });

function isEmpty(str) {
  if (typeof str == "undefined" || str == null || str == "") return true;
  else return false;
}

const Product = ({ location, match }) => {
  const query = queryString.parse(location.search);
  const detail = query.detail === "true";

  console.log("aaa", match.params);
  console.log("match.params.id", match.params.id);

  return (
    <Container>
      {match.params.id && <ReceiptPage id={match.params.id} />}
      {!match.params.id && <ProductPage />}
    </Container>
  );
};

export default Product;
