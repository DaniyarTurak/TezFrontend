import React, { Component } from "react";
import Axios from "axios";

export default function(ComposedComponent) {
  class Authentication extends Component {
    componentWillMount() {
      const token = localStorage.getItem("token");
      if (token)
        Axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      Axios.get("/api/auth").catch(() => {
        localStorage.clear();
        //localStorage.removeItem("token");
        sessionStorage.clear();
        delete Axios.defaults.headers.common["Authorization"];
        this.props.history.push("/");
      });
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  return Authentication;
}
