import React, { Component } from "react";
import "./index.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ViewAllPackages from "./components/ViewAllPackages"
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { PackageContinent } from "./components/PackageContinent";
import {Book} from './components/Book';
import { ViewAllBooks } from "./components/ViewAllBooks";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_userId: sessionStorage.getItem("userId"),
      logged_userName: sessionStorage.getItem("userName"),
      dialog_visible: false,
      logged_out: false
    };
  }

  onClick = () => {
    this.setState({ dialog_visible: true });
  };

  onHide = () => {
    this.setState({ dialog_visible: false });
  };

  logout = () => {
    this.setState({ dialog_visible: false });
    alert("Do you want to logout from the session?")
    sessionStorage.clear();
    this.setState({ logged_out: true });
    window.location.reload();
  };

  confirm_logout = () => {
    this.setState({ dialog_visible: true });
  };
  render() {
    return (
      <div>
        <Router>
          {/* <div className="container-fluid"> */}
          <div className="App">
            <nav className="navbar navbar-expand-md bg-dark navbar-dark">
              <div className="navbar-header">
                <Link className="navbar-brand" to="/">
                  Start Wandering
                </Link>
              </div>
              <ul className="navbar-nav ml-auto">
                {this.state.logged_userId ? (
                  <li className="nav-item">
                    <Link className="nav-link" to="">
                      Welcome {this.state.logged_userName}
                    </Link>
                  </li>
                ) : null}
                <li className="nav-item">
                  <Link className="nav-link" to="/packages">
                    Hot Deals{" "}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/viewBookings">
                    Planned Trips
                  </Link>
                </li>

                {!this.state.logged_userId ? (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      {" "}
                      Login
                    </Link>
                  </li>
                ) : null}
                {this.state.logged_userId ? (
                  <li className="nav-item">
                    <Link className="nav-link" onClick={this.logout} to="">
                      {" "}
                      Logout
                    </Link>
                  </li>
                ) : null}
              </ul>
            </nav>

            <Switch>
              <Route exact path="/packages" component={ViewAllPackages}></Route>
              <Route exact path="/" component={Home}></Route>
              <Route exact path="/login" component={Login}></Route>
              /* Implement route path here */
              <Route exact path="/booking/:destId" component={Book}></Route>
               <Route exact path="/register" component={Register}></Route>
               <Route exact path="/viewBookings" component={ViewAllBooks}></Route>
               <Route exact path="/packages/:continent" component={PackageContinent}></Route>
              
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}
export default App;