import Loadable from "react-loadable";
import Loading from "./Loading";

const UserCabinetPage = Loadable({
  loader: () => import("./pages/UserCabinetPage"),
  loading: Loading,
});

const EsfInvoiceDetails = Loadable({
  loader: () => import("./pages/ESF/EsfInvoiceDetails"),
  loading: Loading,
});

const SignOut = Loadable({
  loader: () => import("./pages/SignOut"),
  loading: Loading,
});

const SignUpPage = Loadable({
  loader: () => import("./pages/SignUpPage"),
  loading: Loading,
});

const SignInPage = Loadable({
  loader: () => import("./pages/SignInPage"),
  loading: Loading,
});

const AdminPage = Loadable({
  loader: () => import("./pages/AdminPages/AdminPage"),
  loading: Loading,
});

const Revision = Loadable({
  loader: () => import("./pages/Revision"),
  loading: Loading,
});

const RevisionParams = Loadable({
  loader: () => import("./pages/revision/RevisionParams"),
  loading: Loading,
});

const RevisionSignIn = Loadable({
  loader: () => import("./pages/revision/RevisionSignIn"),
  loading: Loading,
});

const RevisionEdit = Loadable({
  loader: () => import("./pages/revision/RevisionEdit"),
  loading: Loading,
});

export {
  UserCabinetPage,
  EsfInvoiceDetails,
  SignOut,
  SignUpPage,
  SignInPage,
  AdminPage,
  Revision,
  RevisionParams,
  RevisionSignIn,
  RevisionEdit,
};
