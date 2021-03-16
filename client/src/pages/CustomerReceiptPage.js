import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { fade } from "@material-ui/core/styles";
import CustomerReceipt from "../components/CustomerReceipt";

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
    //minWidth: 1080,
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
});

class CustomerReceiptPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerID: "",
      receipts: "",
      completed: 0,
      searchKeyword: "",
    };
  }

  stateRefresh = () => {
    this.setState({
      receipts: "",
      completed: 0,
      searchKeyword: "",
    });

    this.getReceipts()
      .then((res) => this.setState({ receipts: res }))
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    this.timer = setInterval(this.progress, 20);
    // 모든 컴포넌트의 마운트가 완료 되었을 때
    this.getReceipts()
      .then((res) => this.setState({ receipts: res }))
      .catch((err) => console.log(err));
  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  getReceipts = async () => {
    console.log("getReceipts");
    const response = await fetch(
      "/api/customers/" + localStorage.CustomerAddress
    );
    const body = await response.json();

    console.log("getReceipts: " + body);
    return body;
  };

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
  };
  render() {
    const filteredComponents = (data) => {
      if (!data) {
        return "";
      }

      return data.map((c) => {
        return (
          <CustomerReceipt
            stateRefresh={this.stateRefresh}
            owner={c.toAddr}
            sender={c.fromAddr}
            contractAddr={c.contractAddr}
            tokenID={c.tokenID}
            tokenUri={c.tokenURI}
            createdAt={c.registeredDate}
            updatedAt={c.lastUpdatedDate}
            isCustomerReceipts="true"
          />
        );
      });
    };
    const { classes } = this.props;
    const productCells = [{id: 1, title: "제품명 (상세 정보)"}, {id: 2, title: "전송"}];
    return (
      <div className={classes.root}>
        {/* <div className={classes.menu}>
          <CustomerLogin />
        </div> */}
        <br />
        <Paper className={classes.paper}>
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
              {this.state.receipts ? (
                filteredComponents(this.state.receipts)
              ) : (
                <TableRow>
                  <TableCell colSpan="8" align="center">
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
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(CustomerReceiptPage);
