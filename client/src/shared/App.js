import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { Customer, Product } from "../pages";
import Menu from "../components/Menu";
import Box from "@material-ui/core/Box";

class App extends Component {
  render() {
    return (
      <Box>
        <Menu />
        <Route exact path="/" component={Product} />
        <Switch>
          <Route path="/customer/:id" component={Customer} />
          <Route path="/customer" component={Customer} />
        </Switch>
        <Switch>
          <Route path="/product/:id" component={Product} />
          <Route path="/product" component={Product} />
        </Switch>
      </Box>
    );
  }
}

export default App;
