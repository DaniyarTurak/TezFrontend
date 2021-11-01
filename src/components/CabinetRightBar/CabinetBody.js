import React from "react";

import AddCashboxUserForm from "../forms/AddCashboxUserForm";
import AddCashboxForm from "../forms/AddCashboxForm";
import AddPointForm from "../forms/AddPointForm";
import AddStockForm from "../forms/AddStockForm";
import AddErpUserForm from "../forms/AddErpUserForm";
import AddSalesPlanForm from "../forms/AddSalesPlanForm";
import AddCounterpartiesForm from "../forms/AddCounterpartiesForm";
import AddBuyersForm from "../forms/AddBuyersForm";

import InvoiceBarcodes from "../pages/PrintBarcode/InvoiceBarcodes";
import GeneralInfo from "../pages/GeneralInfo";
import ChartsPage from "../pages/ChartsPage";
import AttrSprPage from "../pages/AttrSprPage";
import PointPage from "../pages/PointPage";
import ChangePassword from "../pages/ChangePassword";
import PrintBarcode from "../pages/PrintBarcode";
import SalesPlan from "../pages/SalesPlan";
import ProductsWeight from "../pages/ProductsWeight";

import News from "../pages/News";
import NewsInformation from "../pages/News/NewsInformation";

import ESF from "../pages/ESF/ESF";
import PricingMasterPage from "../pages/PricingMasterPage";
import CreatePrefix from "../pages/ProductsWeight/CreatePrefix";
import WorkorderPage from "../pages/WorkorderPage";


// import UpdateCategoryPage from "../pages/Products/ProductReference/UpdateCategoryPage";
import UpdateBonusPage from "../pages/Updates/UpdateBonusPage";
import UpdateScalesPage from "../pages/Updates/UpdateScalesPage";
import CashboxUserListPage from "../pages/ListPages/CashboxUserListPage";
import Cashbox from "../pages/ListPages/Cashbox";
import PointListPage from "../pages/ListPages/PointListPage";
import StockListPage from "../pages/ListPages/StockListPage";
import ERPUserListPage from "../pages/ListPages/ERPUserListPage";
import CounterpartiesListPage from "../pages/ListPages/CounterpartiesListPage";
import BuyersListPage from "../pages/ListPages/BuyersListPage";
import ReferencesListPage from "../pages/ListPages/ReferencesListPage";

import CreateReceiveInvoice from "../pages/Products/CreateReceiveInvoice";
import ManageInvoice from "../pages/Products/CreateReceiveInvoice/ManageInvoice";
import Products from "../pages/Products/Products";
import ChangePrice from "../pages/Products/ChangePrice";
import CreateTransferInvoice from "../pages/Products/TransferPages/CreateTransferInvoice";
import TransferInvoice from "../pages/Products/TransferPages/InvoiceTransfer";
import ProductWriteoff from "../pages/Products/ProductWriteoff";
// import ProductAddBrand from "../pages/Products/ProductAddBrand";
// import ProductAddCategory from "../pages/Products/ProductAddCategory";
import CreateWriteoffInvoice from "../pages/Products/CreateWriteoffInvoice";
import DiscountsPage from "../pages/Products/DiscountsPage";
import CouponsPage from "../pages/Products/CouponsPage";
import CreateCertificates from "../pages/Products/CreateCertificates";
import PromotionsPage from "../pages/Products/PromotionsPage";
import MarginalPricePage from "../pages/Products/MarginalPricePage";
import ProductReference from "../pages/Products/ProductReference";
import ReconciliationPage from "../pages/Products/ReconciliationPage";
import RecieveByWorkorder from "../pages/Products/RecieveByWorkorder";
import StockMonitoringPage from '../pages/StockMonitoringPage';
import Revision from '../pages/Products/Revision';


import ReportPage from "../pages/Reports/ReportPage";
import NotAllowed from "../NotAllowed";

import Can from "../Can";

export default function getBody({
  mode,
  action,
  userRoles,
  type,
  history,
  location,
}) {
  // const companies_recon = [38, 56, 57, 68, 69, 81, 78, 98, 231, 241, 269, 96, 2];
  // const comp_id = parseInt(JSON.parse(sessionStorage.getItem("isme-company-data")).id);
  if (Can(mode, userRoles, action)) {
    switch (mode) {
      case "general":
        return <GeneralInfo history={history} location={location} />;
      case "report":
        return <ReportPage type={mode} history={history} location={location} />;
      case "stockreport":
        return <ReportPage type={mode} history={history} location={location} />;
      case "options":
        switch (action) {
          case "general":
            return <GeneralInfo history={history} location={location} />;
          case "point":
            switch (type) {
              case "manage":
                return <AddPointForm history={history} location={location} />;
              case "page":
                return <PointPage history={history} location={location} />;
              default:
                return <PointListPage history={history} location={location} />;
            }
          case "stock":
            switch (type) {
              case "manage":
                return <AddStockForm history={history} location={location} />;
              default:
                return <StockListPage history={history} location={location} />;
            }

          case "erpuser":
            switch (type) {
              case "manage":
                return <AddErpUserForm history={history} location={location} />;
              default:
                return (
                  <ERPUserListPage history={history} location={location} />
                );
            }
          case "salesplan":
            switch (type) {
              case "manage":
                return (
                  <AddSalesPlanForm history={history} location={location} />
                );
              default:
                return <SalesPlan history={history} location={location} />;
            }
          case "counterparties":
            switch (type) {
              case "manage":
                return (
                  <AddCounterpartiesForm
                    history={history}
                    location={location}
                  />
                );
              default:
                return (
                  <CounterpartiesListPage
                    history={history}
                    location={location}
                  />
                );
            }
          case "cashbox":
            switch (type) {
              case "manage":
                return <AddCashboxForm history={history} location={location} />;
              default:
                return <Cashbox history={history} location={location} />;
            }
          case "cashboxuser":
            switch (type) {
              case "manage":
                return (
                  <AddCashboxUserForm history={history} location={location} />
                );
              default:
                return (
                  <CashboxUserListPage history={history} location={location} />
                );
            }
          case "buyers":
            switch (type) {
              case "manage":
                return <AddBuyersForm history={history} location={location} />;
              default:
                return <BuyersListPage history={history} location={location} />;
            }
          case "attrspr":
            return <AttrSprPage history={history} location={location} />;
          // case "categories":
          //   return <UpdateCategoryPage history={history} location={location} />;
          case "scales":
            return <UpdateScalesPage history={history} location={location} />;
          case "createprefix":
            return <CreatePrefix history={history} location={location} />;

          default:
            return <ReferencesListPage history={history} location={location} />;
        }
      case "prices":
        switch (action) {
          case "changeprice":
            return <ChangePrice history={history} location={location} />;
          case "marginalpricepage":
            return <MarginalPricePage history={history} location={location} />;
          case "pricingmaster":
            return <PricingMasterPage history={history} location={location} />;
          default: return <ChangePrice history={history} location={location} />;
        }
      case "marketing":
        switch (action) {
          case "couponspage":
            return <CouponsPage history={history} location={location} />;
          case "certificates":
            return <CreateCertificates history={history} location={location} />;
          case "bonus":
            return <UpdateBonusPage history={history} location={location} />;
          case "creatediscounts":
            return <DiscountsPage history={history} location={location} />;
          case "promotionspage":
            return <PromotionsPage history={history} location={location} />;
          default: return <CouponsPage history={history} location={location} />;
        }
      case "product":
        switch (action) {
          case "receive":
            return (
              <CreateReceiveInvoice history={history} location={location} />
            );
          case "workorder":
            return <WorkorderPage history={history} location={location} />;
          case "recievebyworkorder":
            return <RecieveByWorkorder history={history} location={location} />;

          case "invoice":
            return <ManageInvoice history={history} location={location} />;
          case "transfer":
            return (
              <CreateTransferInvoice history={history} location={location} />
            );
          case "invoicetransfer":
            return <TransferInvoice history={history} location={location} />;
          case "writeoff":
            return (
              <CreateWriteoffInvoice history={history} location={location} />
            );
          case "invoicewriteoff":
            return <ProductWriteoff history={history} location={location} />;
          // case "addbrand":
          //   return <ProductAddBrand history={history} location={location} />;
          // case "addcategory":
          //   return <ProductAddCategory history={history} location={location} />;
          case "couponspage":
            return <CouponsPage history={history} location={location} />;
          case "printbarcode":
            switch (type) {
              case "invoice":
                return (
                  <InvoiceBarcodes history={history} location={location} />
                );
              default:
                return <PrintBarcode history={history} location={location} />;
            }
          // case "navbar":
          //   return <NavBar history={history} location={location} />;
          case "productsweight":
            return <ProductsWeight history={history} location={location} />;
          case "reconciliationpage":
            return <ReconciliationPage history={history} location={location} />;
          case "stockmonitoring":
            return <StockMonitoringPage history={history} location={location} />;
          default:
            return <Products history={history} location={location} />;
          case "productreference":
            return <ProductReference history={history} location={location} />;
          case "revision":
            return <Revision history={history} location={location} />;
        }

      case "changepass":
        return <ChangePassword history={history} location={location} />;
      case "esf":
        return <ESF history={history} location={location} />;

      case "news":
        switch (action) {
          case `${action}`:
            return (
              <NewsInformation
                history={history}
                location={location}
                action={action}
                isAdmin={false}
              />
            );

          default:
            return (
              <News history={history} location={location} isAdmin={false} />
            );
        }

      default:
        return Can("stats", userRoles, action) ? (
          <ChartsPage history={history} location={location} />
        ) : (
          <GeneralInfo history={history} location={location} />
        );
    }
  } else {
    return <NotAllowed />;
  }
}
