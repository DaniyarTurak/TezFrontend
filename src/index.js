import "babel-polyfill";
import "react-app-polyfill/ie11";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import reducers from "./reducers";
import NetworkService from "./networkService.js";

import "./sass/index.sass";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/bouncyflip.css";
import "react-s-alert/dist/s-alert-css-effects/stackslide.css";

import App from "./App";

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

NetworkService.setupInterceptors();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
