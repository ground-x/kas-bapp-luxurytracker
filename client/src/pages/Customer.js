import React from "react";
import queryString from "query-string";
import CustomerReceiptPage from "./CustomerReceiptPage";
import { Container } from "@material-ui/core";

const Customer = ({ location, match }) => {
  const query = queryString.parse(location.search);
  const detail = query.detail === "true";

  console.log("match.params.id 22", match.params.id);

  return (
    <Container>
      {/* <h2>Customer {localStorage.CustomerAddress}</h2> */}
      <CustomerReceiptPage />
    </Container>
  );
};

export default Customer;
