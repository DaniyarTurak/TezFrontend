import React, { Component } from "react";

class Searching extends Component {
  state = {
    searching: "Идет поиск"
  };

  render() {
    const { searching } = this.state;
    return (
      <div className="row mt-10 text-center">
        <div className="col-md-12 not-found-text loading-dots">
          {searching} <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
    );
  }
}

export default Searching;
