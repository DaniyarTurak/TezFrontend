import React, { Component } from "react";
import Axios from "axios";

class Signout extends Component {
  componentDidMount() {
    delete Axios.defaults.headers.common["Authorization"];
    localStorage.clear();
    sessionStorage.clear();
    // localStorage.removeItem('revisionToken');
    // sessionStorage.removeItem('revision-params');
    // sessionStorage.removeItem('edited-products');
    // sessionStorage.removeItem('saved-state');
    // sessionStorage.removeItem('login');

    this.props.history.push("/enterrevision");
  }

  render() {
    return <div></div>;
  }
}

export default Signout;
