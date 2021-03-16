import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { fade } from "@material-ui/core/styles";
import Product from "../components/Product";
import ProductAdd from "../components/ProductAdd";

const styles = (theme) => ({
  tableHead: {
    fontSize: "1.0rem",
  },
  menu: {
    marginTop: 15,
    marginBottom: 15,
    display: "flex",
    justifyContent: "center",
  },
  root: {
    width: "100%",
  },
  paper: {
    marginLeft: 18,
    marginRight: 18,
  },
  progress: {
    margin: theme.spacing(2),
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  table: {
    backgroundColor: "",
  },
});

class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: "",
      sellers: "",
      completed: 0,
      searchKeyword: "",
    };
  }

  stateRefresh = () => {
    this.setState({
      customers: "",
      sellers: "",
      completed: 0,
      searchKeyword: "",
    });

    this.getProducts()
      .then((res) => this.setState({ customers: res }))
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    this.timer = setInterval(this.progress, 20);
    // 모든 컴포넌트의 마운트가 완료 되었을 때
    this.getProducts()
      .then((res) => this.setState({ customers: res }))
      .catch((err) => console.log(err));
  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  getProducts = async () => {
    const response = await fetch("/api/products");
    const body = await response.json();

    console.log("getProducts: " + body);
    return body;
  };

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
  };
  render() {
    const filteredComponents = (data) => {
      data = data.filter((c) => {
        return c.name.indexOf(this.state.searchKeyword) > -1;
      });
      return data.map((c) => {
        return (
          <Product
            stateRefresh={this.stateRefresh}
            key={c.id}
            id={c.id}
            image={c.image}
            name={c.name}
            symbol={c.symbol}
            registeredDate={c.registeredDate}
            contractAddr={c.contractAddr}
          />
        );
      });
    };
    const { classes } = this.props;
    const productCells = [{id: 1, title: "이미지"}, {id: 2, title: "제품명"}, {id: 3, title: "영수증"}];
    return (
      <Container className={classes.root}>
        {/* Seller#{localStorage.SellerID} - {localStorage.SellerPrivateKey}
        <Box className={classes.menu}>
          <SellerLogin />
        </Box> */}
        <br />
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {productCells.map((c, index) => {
                  return (
                    <TableCell id={index} className={classes.tableHead}>{c.title}</TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan="3" align="center">
                  <ProductAdd stateRefresh={this.stateRefresh} />
                </TableCell>
              </TableRow>
              {this.state.customers ? (
                filteredComponents(this.state.customers)
              ) : (
                <TableRow>
                  <TableCell colSpan="7" align="center">
                    <CircularProgress
                      className={classes.progress}
                      variant="determinate"
                      value={this.state.completed}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }
}

export default withStyles(styles)(ProductPage);
