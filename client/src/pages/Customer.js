import React from "react";
import CustomerReceiptPage from "./CustomerReceiptPage";
import { Container } from "@material-ui/core";

const Customer = ({ location, match }) => {
  return (
    <Container>
      {/* <h2>Customer {localStorage.CustomerAddress}</h2> */}
      <CustomerReceiptPage />
    </Container>
  );
};

export default Customer;
