import React, { Fragment } from "react";

import AddBrandForm from "../../forms/AddBrandForm";
import AddAttributeForm from "../../forms/AddAttributeForm";
import CreateInvoicePage from "./CreateInvoicePage";
import CreatePrefix from "../ProductsWeight/CreatePrefix";
import BrandListPage from "../ListPages/BrandListPage";
import CompanyListPage from "../ListPages/CompanyListPage";
import InfoCompanyPage from "../InfoCompanyPage";
import ChangePassword from "../ChangePassword";
import UploadFile from "../UploadFile";
import PosPage from "./PosPage";
import UpdateAttributePage from "../Updates/UpdateAttributePage";
import NotAllowed from "../../NotAllowed";
import AdminNews from "./AdminNews";
import NewsInformation from "../News/NewsInformation";
import ReportAdminPage from "./ReportAdminPage";
import PointListPage from "../ListPages/PointListPage";
import Cashbox from "../ListPages/Cashbox";

import ImpNomenclature from "./ImpNomenclature";
import ConsolidatedReports from "./ConsolidatedReports";

export default function AdminRightBar({
  mode,
  action,
  type,
  user,
  history,
  location,
}) {
  const Can = (login, mode) => {
    const modeAllowList = { adminreport: 1 };
    if (login === "admin") return true;
    if (modeAllowList[mode] === 1) return false;
    else return true;
  };

  const getBody = (mode, action, type, user) => {
    if (Can(user.login, mode)) {
      switch (mode) {
        case "changepass":
          return <ChangePassword history={history} location={location} />;
        case "uploadfile":
          return <UploadFile history={history} location={location} />;
        case "nomenclature":
          return <ImpNomenclature history={history} location={location} />;
        case "createinvoice":
          return (
            user.login === "admin" ?
              <CreateInvoicePage history={history} location={location} />
              :
              <NotAllowed />);
        case "createprefix":
          return <CreatePrefix history={history} location={location} />

        case "point":
          return <PointListPage history={history} location={location} />
        case "cashbox":
          return <Cashbox history={history} location={location} />

        case "consolidated":
          return (user.login === "admin" ?
            <ConsolidatedReports history={history} location={location} />
            :
            <NotAllowed />);
        case "updateattribute":
          switch (action) {
            case "manage":
              return <AddAttributeForm history={history} location={location} />;
            default:
              return (
                <UpdateAttributePage history={history} location={location} />
              );
          }
        case "companies":
          switch (action) {
            case "info":
              return <InfoCompanyPage history={history} location={location} />;
            default:
              return <CompanyListPage history={history} location={location} />;
          }
        case "posPage":
          return <PosPage history={history} location={location} />;
        case "adminreport":
          return (
            <ReportAdminPage
              user={user.login}
              history={history}
              location={location}
            />
          );
        case "news":
          switch (action) {
            case `${action}`:
              return (
                <NewsInformation
                  history={history}
                  location={location}
                  action={action}
                  isAdmin={true}
                />
              );
            default:
              return (
                user.login === "admin" ?
                  <AdminNews
                    history={history}
                    location={location}
                    isAdmin={true}
                  />
                  :
                  <NotAllowed />
              );
          }
        case "references":
          switch (action) {
            case "brand":
              switch (type) {
                case "manage":
                  return <AddBrandForm history={history} location={location} />;
                default:
                  return (
                    <BrandListPage history={history} location={location} />
                  );
              }
            default:
              return <BrandListPage history={history} location={location} />;
          }
        default:
          return (
            user.login === "admin" ?
              <AdminNews history={history} location={location} isAdmin={true} />
              :
              <CompanyListPage history={history} location={location} />
          );
      }
    } else {
      return <NotAllowed />;
    }
  };

  return (
    <Fragment>
      {(mode === "changepass" && getBody(mode, action, type, user)) || (
        <div className="b-cab-right">
          <div className="b-cab-right-menu">
            {getBody(mode, action, type, user)}
          </div>
        </div>
      )}
    </Fragment>
  );
}
