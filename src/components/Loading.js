import React from "react";

const Loading = props => {
  if (props.error) {
    return <div>Error!</div>;
  } else {
    return  <div className={'content is-loading'}>
              <div className="loader">
                <div className="icon"></div>
              </div>
            </div>;
  }
};

export default Loading;