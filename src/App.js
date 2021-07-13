import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import requireAuth from "./hoc/requireAuth";
import requireAdminAuth from "./hoc/requireAdminAuth";
import requireRevisionAuth from "./hoc/requireRevisionAuth";
import Content from "./components/Content";
//import SignInPage from './components/pages/SignInPage';
import NotFoundPage from "./components/pages/NotFoundPage";
// import RevisionSignOut from "./components/pages/revision/RevisionSignOut";

import {
  UserCabinetPage,
  // RevisionParams,
  // RevisionSignIn,
  // RevisionEdit,
  // Revision,
  EsfInvoiceDetails,
  SignOut,
  SignUpPage,
  SignInPage,
  AdminPage,
} from "./components/AsyncPages";

export default function App() {
  return (
    <Router>
      <Content>
        <Switch>
          <Route exact path="/" component={SignInPage} />
          <Route exact path="/demo" component={SignInPage} />
          <Route path="/register" component={requireAdminAuth(SignUpPage)} />
          <Route path="/signout" component={SignOut} />
          {/* <Route path="/enterrevision" component={RevisionSignIn} />
          <Route
            path="/revision/params"
            component={requireRevisionAuth(RevisionParams)}
          />
          <Route
            path="/revision/edit"
            component={requireRevisionAuth(RevisionEdit)}
          />
          <Route path="/revision/signout" component={RevisionSignOut} />
          <Route path="/revision" component={requireRevisionAuth(Revision)} /> */}
          <Route path="/esf/invoiceDetails" component={EsfInvoiceDetails} />
          <Route
            exact
            path="/usercabinet/:mode?"
            component={requireAuth(UserCabinetPage)}
          />
          <Route
            exact
            path="/usercabinet/:mode?/:action"
            component={requireAuth(UserCabinetPage)}
          />
          <Route
            exact
            path="/usercabinet/:mode?/:action/:type"
            component={requireAuth(UserCabinetPage)}
          />
          <Route
            exact
            path="/adminpage/:mode?"
            component={requireAdminAuth(AdminPage)}
          />
          <Route
            exact
            path="/adminpage/:mode?/:action"
            component={requireAdminAuth(AdminPage)}
          />
          <Route
            exact
            path="/adminpage/:mode?/:action/:type"
            component={requireAdminAuth(AdminPage)}
          />
          <Route exact path="/notfound" component={NotFoundPage} />
        </Switch>
      </Content>
    </Router>
  );
}
