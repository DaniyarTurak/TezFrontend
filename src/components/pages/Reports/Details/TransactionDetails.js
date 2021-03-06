import React, { useState, useEffect, Fragment } from "react";
import Searching from "../../../Searching";
import Axios from "axios";
import Moment from "moment";
import ReactModal from "react-modal";
import ProductDetails from "../../Products/ProductDetails";
import "moment/locale/ru";
Moment.locale("ru");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    zIndex: 11,
  },
  overlay: { zIndex: 10 },
};

export default function TransactionDetails({
  closeDetail,
  companyProps,
  holding,
  parentDetail,
  transaction,
  consignmentDetails,
  nds,
}) {
  const [details, setDetails] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [product, setProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [shop, setShop] = useState("");
  const [modalIsOpen, setModalOpen] = useState(false);
  const company = companyProps ? companyProps : "";

  useEffect(() => {
    if (parentDetail !== "consignment") {
      getTransactionDetails();
    } else {
      setDetails(consignmentDetails);
      Object.keys(consignmentDetails).length > 0 && consignmentDetails.details
        ? setProducts([...consignmentDetails.details])
        : setProducts([...consignmentDetails]);
    }
  }, []);

  const getTransactionDetails = () => {
    const id = transaction.id;
    const h =
      (parentDetail === 2 || parentDetail === 1) && holding ? true : false;
    setLoading(true);
    Axios.get("/api/report/transactions/fulldetails", {
      params: { company, transactionid: id, holding: h },
    })
      .then((res) => res.data)
      .then((detailsList) => {
        const nds = detailsList.details.reduce((prev, curr) => {
          return prev + curr.nds; //curr.nds
        }, 0);
        detailsList.nds = nds;
        setDetails(detailsList);
        setProducts([...detailsList.details]);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const closeModal = () => {
    closeDetail(true);
  };

  const handleProductDtl = (p, s) => {
    setProduct(p);
    setShop(s);
    setModalOpen(true);
  };

  const closeProductDetail = () => {
    setModalOpen(false);
  };

  const summDiscounts = () => {
    let summ = 0;
    if (products.length > 0) {
      products.forEach(element => {
        summ = summ + element.discount;
      });
    }
    return summ;
  };

  return (
    <div className="transaction-details">
      <ReactModal isOpen={modalIsOpen} style={customStyles}>
        <ProductDetails
          transaction={transaction}
          companyProps={company}
          product={product}
          shop={shop}
          closeDetail={closeProductDetail}
          parentDetail={parentDetail}
          invoiceNumber={false}
        />
      </ReactModal>
      {isLoading && <Searching />}
      {!isLoading && (
        <Fragment>
          <div className="row">
            <div className="col-md-6">
              <h6 className="tenge">
                {parseFloat(
                  details.price + details.discount + details.bonuspay
                ).toLocaleString("ru", { minimumFractionDigits: 2 })}
              </h6>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-12 hint">
              <span>
                {transaction.tickettype === "0" ? "??????????????" : "??????????????"}{" "}
                {parentDetail !== "consignment"
                  ? Moment(transaction.date).format("DD MMMM YYYY hh:mm:ss")
                  : transaction.date}
              </span>
              {(parentDetail === 1 || parentDetail === "consignment") && (
                <div>
                  <span>{`????????????: ${!details.customerid || details.customerid === "0" ? '??????. ????????':'????. ????????' }`}</span>
                  <br />
                  <span>{`????????????: ${details.cashier}`}</span>
                  <br />
                  <span>{`??????????: ${details.pointname}`}</span>
                  <br />
                  <span>{`??????????: ${details.cashboxname}`}</span>
                  <br />
                  {details.consultant && details.consultant !== "" &&
                    <Fragment>
                      <span>{`??????????????????????: ${details.consultant}`}</span>
                      <br />
                    </Fragment>
                  }
                  {details.fio && details.fio !== "" &&
                    <Fragment>
                      <span>{`????????????: ${details.fio}`}</span>
                      <br />
                    </Fragment>
                  }
                </div>
              )}
              {parentDetail === 3 && (
                <div>
                  <span>{details.pointname}</span>
                  <br />
                  <span>{`????????????: ${details.cashier}`}</span>
                </div>
              )}
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-12">
              <table className="table table-sm table-check-detail">
                <thead>
                  <tr>
                    <th>????????????????????????</th>
                    <th>????????????????????</th>
                    <th>????????</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(details).length > 0 &&
                    products.map((detail, idx) => (
                      <tr key={idx}>
                        <td
                          className="link-row"
                          onClick={() => {
                            handleProductDtl(detail, transaction.pointid);
                          }}
                        >
                          {detail.name} [{detail.unitspr_shortname}]
                          {detail.discount !== 0 &&
                            <Fragment >
                              <br />
                              &#10551; ????????????
                            </Fragment>
                          }
                        </td>
                        <td className="tenge">{`${detail.units} x ${parseFloat(
                          detail.price
                        ).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}`}</td>
                        <td>
                          {parseFloat(detail.totalprice).toLocaleString("ru", {
                            minimumFractionDigits: 2,
                          })} &#8376;
                          {detail.discount !== 0 &&
                            <Fragment >
                              <br />
                              {detail.discount} &#8376;
                            </Fragment>
                          }
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-6">?????????? ??????????</div>
            <div className="col-md-6 text-right tenge">
              {parseFloat(
                details.price + details.discount + details.bonuspay
              ).toLocaleString("ru", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">???????????? ???? ??????</div>
            <div className="col-md-6 text-right tenge">
              {parseFloat(details.discount).toLocaleString("ru", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">???????????????????????? ??????????????</div>
            <div className="col-md-6 text-right tenge">
              {parseFloat(details.bonuspay).toLocaleString("ru", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">?????????? ????????????</div>
            <div className="col-md-6 text-right tenge">
              {parseFloat(summDiscounts() + details.discount).toLocaleString("ru", {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="col-md-6">?????????? ?? ????????????</div>
            <div className="col-md-6 text-right tenge">
              {parseFloat(details.price).toLocaleString("ru", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">?? ?????? ?????????? ??????</div>
            <div className="col-md-6 text-right tenge">
              {parseFloat(
                parentDetail !== "consignment" ? details.nds : nds
              ).toLocaleString("ru", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">?????????????????? ??????????????</div>
            <div className="col-md-6 text-right tenge">
              {parseFloat(details.bonusadd).toLocaleString("ru", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <hr />
          <div className="row mt-30">
            <div className="col-md-6">??????????????????:</div>
            <div className="col-md-6 text-right tenge">
              {parseFloat(details.cashpay).toLocaleString("ru", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">????????????:</div>
            <div className="col-md-6 text-right tenge">
              {parseFloat(details.cardpay).toLocaleString("ru", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">????????????????????????:</div>
            <div className="col-md-6 text-right tenge">
              {parseFloat(details.certpay).toLocaleString("ru", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">????????????????:</div>
            <div className="col-md-6 text-right tenge">
              {parseFloat(details.bonuspay).toLocaleString("ru", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">?????????????????????? ??????????????????:</div>
            <div className="col-md-6 text-right tenge">
              {parseFloat(details.debitpay).toLocaleString("ru", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">?? ????????:</div>
            <div className="col-md-6 text-right tenge">
              {parseFloat(details.debtpay).toLocaleString("ru", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="row mt-30">
            <div className="col-md-12 text-right">
              <button className="btn btn-success" onClick={closeModal}>
                ????????????
              </button>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
