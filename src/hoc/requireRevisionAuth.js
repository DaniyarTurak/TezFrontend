import React, { Component } from "react";
import Axios from "axios";

export default function(ComposedComponent) {
  class Authentication extends Component {
    componentWillMount() {
      const token = localStorage.getItem("token");
      // const token = localStorage.getItem('revisionToken');
      if (token)
        Axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      Axios.get("/api/revauth").catch(() => {
        localStorage.clear();
        sessionStorage.clear();
        delete Axios.defaults.headers.common["Authorization"];

        // localStorage.removeItem('revisionToken');
        // sessionStorage.removeItem('revision-params');
        // sessionStorage.removeItem('edited-products');
        // sessionStorage.removeItem('saved-state');
        // sessionStorage.removeItem('login');
        // console.log(this.props.history)
        this.props.history.push("/enterrevision");
      });
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  return Authentication;
}
