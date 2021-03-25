import React, { Component } from "react";

class EmptyData extends Component {
  state = {
    noData: "Данные по вашему запросу отуствуют"
  };

  render() {
    const { noData } = this.state;
    return (
      <div className="row mt-10 text-center">
        <div className="col-md-12 not-found-text ">{noData}</div>
      </div>
    );
  }
}

export default EmptyData;
