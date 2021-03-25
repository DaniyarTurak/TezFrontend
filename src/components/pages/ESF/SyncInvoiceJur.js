import React, { Component, Fragment } from "react";
import Axios from "axios";
import Alert from "react-s-alert";
import Moment from "moment";

import ReactModal from "react-modal";

import { parseString } from "xml2js";

import EsfDetailsJur from "./EsfDetailsJur";
import EsfCreateJur from "./EsfCreateJur";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxHeight: "80vh",
    overlfow: "hidden",
    zIndex: 102,
  },
  overlay: { zIndex: 101 },
};

const customStylesCreate = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxHeight: "80vh",
    overlfow: "hidden",
    zIndex: 102,
    height: "50%",
  },
  overlay: { zIndex: 101 },
};

ReactModal.setAppElement("#root");

const createXmlToSend = (invoice) => {
  const sessionId = localStorage.getItem("isme-session");
  const invoiceHashList = invoice["invoiceHashList"]["invoiceHash"];
  let invoiceUploadInfoList = "";

  invoiceHashList.forEach((invoiceHash) => {
    invoiceUploadInfoList =
      invoiceUploadInfoList +
      `<invoiceUploadInfo>
		<invoiceBody><![CDATA[${invoiceHash.hash[0]}]]></invoiceBody>
		<version>InvoiceV2</version>
		<signature>${invoiceHash.signature[0]}</signature>
		<signatureType>OPERATOR</signatureType>
	</invoiceUploadInfo>`;
  });

  return `<esf:syncInvoiceRequest>
		<sessionId>${sessionId}</sessionId>
		<invoiceUploadInfoList>
			${invoiceUploadInfoList}
		</invoiceUploadInfoList>
		<x509Certificate>${invoice.pem}</x509Certificate>
	</esf:syncInvoiceRequest>`;
};

export default class SyncInvoiceJur extends Component {
  state = {
    dateFrom: Moment().format("YYYY-MM-DD"),
    dateTo: Moment().format("YYYY-MM-DD"),
    esf: {},
    formations: [],
    point: "",
    points: [],
    transactions: [],
    syncInvoice: false,
  };

  componentDidMount() {
    this.getFormationJurEsf();
  }

  getFormationJurEsf = () => {
    Axios.get("/api/esf/getFormationJurEsf")
      .then((res) => res.data)
      .then((formations) => {
        this.setState({ formations });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleCheckboxChange(index, e) {
    const isChecked = e.target.checked;
    let transactions = this.state.transactions;

    transactions[index].checked = isChecked;

    this.setState({ transactions });
  }

  // XML formation**************BEGIN***************************
  createXmlToSign = (esf) => {
    const userData = JSON.parse(sessionStorage.getItem("isme-user-data"));
    const companyData = JSON.parse(sessionStorage.getItem("isme-company-data"));

    // const { details } = esf;
    // this.setState({ esf });
    console.log(esf);
    const xmlToSign = esf
      .filter((detail) => {
        const allowed = ["FORMATION", "FAILED"];
        return allowed.includes(detail.esfstatus);
      })
      .map((detail, idx) => {
        return `<v2:invoice xmlns:a="abstractInvoice.esf" xmlns:v2="v2.esf">
			<date>${detail.date}</date>
			<invoiceType>${detail.invoiceType}</invoiceType>
			<num>${detail.num}</num>
			<operatorFullname>${userData.name}</operatorFullname>
			<turnoverDate>${detail.turnoverDate}</turnoverDate>
			<customers>
				<customer>
					<address>${detail.address}</address>
					<countryCode>${detail.countryCode}</countryCode>
					<name>${detail.name}</name>
					<statuses>
						<status>${detail.CustomerType}</status>
					</statuses>
				</customer>
      </customers>
      ${
        detail.consignortin || detail.сonsignorname || detail.consignoraddress
          ? ` <consignor>
                ${
                  detail.consignortin ? `<tin>${detail.consignortin}</tin>` : ""
                }
                ${
                  detail.сonsignorname
                    ? `<name>${detail.сonsignorname}</name>`
                    : ""
                }
                ${
                  detail.consignoraddress
                    ? `<address>${detail.consignoraddress}</address>`
                    : ""
                }
              </consignor>`
          : ""
      }    
      ${
        detail.consigneetin ||
        detail.consigneename ||
        detail.consigneeaddress ||
        detail.countryCode
          ? `<consignee>
                ${
                  detail.consigneetin ? `<tin>${detail.consigneetin}</tin>` : ""
                }
                ${
                  detail.consigneename
                    ? `<name>${detail.consigneename}</name>`
                    : ""
                }
                ${
                  detail.consigneeaddress
                    ? `<address>${detail.consigneeaddress}</address>`
                    : ""
                }      
                ${
                  detail.countryCode
                    ? `<countryCode>${detail.countryCode}</countryCode>`
                    : ""
                }
             </consignee>`
          : ""
      }
      ${
        detail.contractDate ||
        detail.contractNum ||
        detail.hasContract ||
        detail.term ||
        detail.transportTypeCode ||
        detail.warrant ||
        detail.warrantDate ||
        detail.destination ||
        detail.deliveryConditionCode
          ? `<deliveryTerm>
          ${
            detail.contractDate
              ? ` <contractDate>${detail.contractDate}</contractDate>`
              : ""
          }
          ${
            detail.contractNum
              ? `<contractNum>${detail.contractNum}</contractNum>`
              : ""
          }
            ${
              detail.hasContract
                ? `<hasContract>${detail.hasContract}</hasContract>`
                : ""
            }
        ${detail.term ? `<term>${detail.term}</term>` : ""}
        ${
          detail.transportTypeCode
            ? ` <transportTypeCode>${detail.transportTypeCode}</transportTypeCode>`
            : ""
        }
        ${detail.warrant ? ` <warrant>${detail.warrant}</warrant>` : ""}
        ${
          detail.warrantDate
            ? `<warrantDate>${detail.warrantDate}</warrantDate>`
            : ""
        }
        ${
          detail.destination
            ? ` <destination>${detail.destination}</destination>`
            : ""
        }
        ${
          detail.deliveryConditionCode
            ? `<deliveryConditionCode>${detail.deliveryConditionCode}</deliveryConditionCode>`
            : ""
        }
      </deliveryTerm>`
          : ""
      } 
			<productSet>
				<currencyCode>KZT</currencyCode>
				<products>${detail.products.map(
          (product) => `
					<product>
						<additional>-</additional>
						<catalogTruId>${product.catalogtruId}</catalogTruId>
						<description>${product.description}</description>
						<ndsAmount>${product.ndsAmount}</ndsAmount>
						${product.ndsRate ? `<ndsRate>${product.ndsRate}</ndsRate>` : ""}
						<priceWithTax>${product.priceWithTax}</priceWithTax>
						<priceWithoutTax>${product.priceWithoutTax}</priceWithoutTax>
						${
              product.productDeclaration
                ? `<productDeclaration>${product.productDeclaration}</productDeclaration>`
                : ""
            }
						${
              product.productNumberInDeclaration
                ? `<productNumberInDeclaration>${product.productNumberInDeclaration}</productNumberInDeclaration>`
                : ""
            }
						<quantity>${product.quantity}</quantity>
						<tnvedName>${product.description}</tnvedName>
						<truOriginCode>${product.truOriginCode}</truOriginCode>
						<turnoverSize>${product.turnoverSize}</turnoverSize>
						${product.unitCode ? `<unitCode>${product.unitCode}</unitCode>` : ""}
						<unitNomenclature>796</unitNomenclature>
						<unitPrice>${product.unitPrice}</unitPrice>
					</product>`
        )}
				</products>
				<totalExciseAmount>0</totalExciseAmount><totalNdsAmount>${+detail.products
          .reduce((prev, cur) => {
            return prev + parseFloat(+cur.ndsAmount);
          }, 0)
          .toFixed(2)
          .toString()}</totalNdsAmount><totalPriceWithTax>${+detail.products
          .reduce((prev, cur) => {
            return prev + parseFloat(+cur.priceWithTax);
          }, 0)
          .toFixed(2)
          .toString()}</totalPriceWithTax><totalPriceWithoutTax>${+detail.products
          .reduce((prev, cur) => {
            return prev + parseFloat(+cur.priceWithoutTax);
          }, 0)
          .toFixed(2)
          .toString()}</totalPriceWithoutTax><totalTurnoverSize>${+detail.products
          .reduce((prev, cur) => {
            return prev + parseFloat(+cur.turnoverSize);
          }, 0)
          .toFixed(2)
          .toString()}</totalTurnoverSize>
			</productSet>
			<sellers>
				<seller>
					<address>${companyData.address}</address>
					${
            companyData.certificatenum
              ? `<certificateNum>${companyData.certificatenum}</certificateNum>`
              : ""
          }
					${
            companyData.certificateseries
              ? `<certificateSeries>${companyData.certificateseries}</certificateSeries>`
              : ""
          }
					<name>${companyData.name}</name>
					<tin>${companyData.bin}</tin>
				</seller>
			</sellers></v2:invoice>`.replace(/>,/g, ">");
      });
    // console.log(xmlToSign);
    return xmlToSign;
  };

  signXmlClick = () => {
    const passwords = JSON.parse(sessionStorage.getItem("isme-passwords"));
    const signCertPassword = passwords
      ? passwords.find((password) => password.type === "signCertPassword")
      : "";
    if (signCertPassword) {
      const { formations } = this.state;
      this.setState({ syncInvoice: true });
      const xmlToSign = this.createXmlToSign(formations.details);
      this.signXml(xmlToSign, signCertPassword.value);
    } else {
      Alert.warning("Введите пароль от ЭЦП для подписи", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
  };

  signXml = (xmlToSign, certPassword) => {
    const req = {
      xmls: xmlToSign,
      certPassword,
    };

    Axios.post("/api/esf/generateSignature", req)
      .then((res) => res.data)
      .then((result) => {
        const { pem } = result;
        this.setState({ pem });
        parseString(result.invoicelist, this.syncInvoice);
      })
      .catch((err) => {
        console.log(err);
        Alert.warning("Возникла ошибка при регистрации счет-фактур", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
        this.setState({ syncInvoice: false });
      });
  };

  // createSessionFailed = () => {
  //   Alert.warning("Возникла ошибка при регистрации счет-фактур", {
  //     position: "top-right",
  //     effect: "bouncyflip",
  //     timeout: 3000,
  //   });
  //   this.setState({ syncInvoice: false });
  // };

  syncInvoice = (err, result) => {
    try {
      let { pem } = this.state;
      const invoiceHashList =
        result["soap:Envelope"]["soap:Body"][0]["ns2:signatureResponse"][0][
          "invoiceHashList"
        ][0];
      const req = {
        xml: createXmlToSend({ invoiceHashList, pem }),
      };
      Axios.post("/api/esf/syncInvoice", req)
        .then((res) => res.data)
        .then((xml) => {
          parseString(xml, this.callBackSyncInvoice);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      Alert.warning("Возникла ошибка при регистрации счет-фактур", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
      this.setState({ syncInvoice: false });
    }
  };

  callBackSyncInvoice = (err, result) => {
    const sessionId = localStorage.getItem("isme-session");
    try {
      let idNums = new Map();
      const acceptedSet =
        result["soap:Envelope"]["soap:Body"][0]["esf:syncInvoiceResponse"][0][
          "acceptedSet"
        ][0];
      const declinedSet =
        result["soap:Envelope"]["soap:Body"][0]["esf:syncInvoiceResponse"][0][
          "declinedSet"
        ][0];

      const ids = acceptedSet.standardResponse.map((accepted) => {
        idNums.set(accepted["id"][0], accepted["num"][0]);
        return accepted["id"][0];
      });

      localStorage["isme-idNums"] = JSON.stringify(
        Array.from(idNums.entries())
      );
      localStorage["isme-declined-set"] = JSON.stringify(declinedSet);
      this.queryInvoiceById(sessionId, ids);
    } catch (e) {
      try {
        const faultstring =
          result["soap:Envelope"]["soap:Body"][0]["soap:Fault"][0][
            "faultstring"
          ][0];
        const matchingWord = "No open session associated with user.";
        if (faultstring.includes(matchingWord)) {
          this.props.createSession("syncInvoice");
        } else {
          Alert.warning("Возникла ошибка при регистрации счет-фактур", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
          this.setState({ syncInvoice: false });
        }
      } catch (e) {
        Alert.warning("Возникла ошибка при регистрации счет-фактур", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
        this.setState({ syncInvoice: false });
      }
    }
  };

  queryInvoiceById = (sessionId, ids) => {
    Axios.get("/api/esf/queryInvoiceById", { params: { sessionId, ids } })
      .then((res) => res.data)
      .then((result) => {
        parseString(result, this.callbackQueryInvoiceById);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  callbackQueryInvoiceById = (err, result) => {
    try {
      const queryInvoiceByIdResponse =
        result["soap:Envelope"]["soap:Body"][0][
          "esf:queryInvoiceByIdResponse"
        ][0];
      const rsCount = queryInvoiceByIdResponse["rsCount"][0];
      const invoiceInfoList =
        queryInvoiceByIdResponse["invoiceInfoList"][0]["invoiceInfo"];

      const idNums = new Map(JSON.parse(localStorage["isme-idNums"]));

      let statuses = [];
      if (rsCount > 0) {
        statuses = invoiceInfoList.map((invoiceInfo) => {
          return {
            esfnum: idNums.get(invoiceInfo["invoiceId"][0]),
            status: invoiceInfo["invoiceStatus"]
              ? invoiceInfo["invoiceStatus"][0]
              : null,
            esfid: invoiceInfo["invoiceId"]
              ? invoiceInfo["invoiceId"][0]
              : null,
            reason: invoiceInfo["cancelReason"]
              ? invoiceInfo["cancelReason"][0]
              : null,
            esfregnum: invoiceInfo["registrationNumber"]
              ? invoiceInfo["registrationNumber"][0]
              : null,
          };
        });
      } else {
        idNums.forEach((key, value) => {
          statuses.push({
            esfnum: key,
            status: "PROCESSING",
            esfid: value,
          });
        });
      }

      this.esfUpdateStatus(statuses);
    } catch (e) {
      this.handleResponse();
    }
  };

  esfUpdateStatus = (statuses) => {
    Axios.post("/api/esf/esfUpdateStatus", { statuses })
      .then((res) => res.data)
      .then((result) => {
        this.handleResponse();
      })
      .catch((err) => {
        console.log(err);
        this.handleResponse();
      });
  };

  handleResponse = () => {
    const declinedSet = JSON.parse(localStorage.getItem("isme-declined-set"));
    const idNums = new Map(JSON.parse(localStorage["isme-idNums"]));
    let ids = [];
    idNums.forEach((key, value) => {
      ids.push(key);
    });
    const text =
      declinedSet && declinedSet.standardResponse.length > 0
        ? this.handleDeclained(declinedSet)
        : "";

    localStorage.removeItem("isme-idNums");
    localStorage.removeItem("isme-declined-set");

    Alert.info(
      `Счет-фактуры <b>${ids.join(
        ", "
      )}</b> отправлены успешно. ${text}Детали будут доступны во вкладке отчеты`,
      {
        position: "top-right",
        effect: "bouncyflip",
        html: true,
        timeout: 1000000,
      }
    );
    this.setState({ syncInvoice: false, esf: {} });
    this.props.closeSession(true);
  };

  handleDeclained = (declinedSet) => {
    let text = "<br>Ошибки при отправке следующих счет-фактур:<ul>";

    declinedSet.standardResponse.forEach((declined) => {
      let errors = "";
      declined.errors.forEach((error) => {
        errors = errors + error.error[0].text[0];
      });
      text =
        text +
        `<li type="disc">Счет-фактура номер: <b>${declined.num[0]}</b><br> Текст ошибки: <b>${errors}</b><br> ID: <b>${declinedSet.products.productNumberInDeclaration}</b></li>`;
    });

    return text + "</ul>";
  };

  // XML formation**************END***************************

  openEsfDetailForm = (product) => {
    this.setState({ product, modalIsOpen: true });
  };

  closeEsfDetailForm = () => {
    this.setState({ product: null, modalIsOpen: false });
  };

  handleDetails = (selectedEsf) => {
    if (selectedEsf.warrantDate) {
      let poaDate = selectedEsf.warrantDate.replace(/\./g, "/");
      const poaDateMomentObject = Moment(poaDate, "DD/MM/YYYY");
      const poaDateObject = poaDateMomentObject.toDate();
      poaDate = Moment(poaDateObject).format("YYYY-MM-DD");
      this.setState({ poaDate });
    }
    if (selectedEsf.contractDate) {
      let cDate = selectedEsf.contractDate.replace(/\./g, "/");
      const cDateMomentObject = Moment(cDate, "DD/MM/YYYY");
      const cDateObject = cDateMomentObject.toDate();
      cDate = Moment(cDateObject).format("YYYY-MM-DD");
      this.setState({ cDate });
    }
    this.setState({ selectedEsf, modalIsOpen: true });
  };

  handleDelete = (esf) => {
    Axios.post("/api/esf/removeEsf", { esf })
      .then((res) => res.data)
      .then((result) => {
        Alert.success("ЭСФ успешно удален", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
        this.getFormationJurEsf();
      })
      .catch((err) => {
        Alert.error(`Возникла ошибка при удалении: ${err}`, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
        console.log(err);
      });
  };

  openJurEsf = () => {
    this.setState({ modalJurIsOpen: true });
  };

  closeEsfCreateForm = () => {
    this.setState({ modalJurIsOpen: false });
  };

  render() {
    const {
      poaDate,
      cDate,
      formations,
      modalIsOpen,
      modalJurIsOpen,
      selectedEsf,
      syncInvoice,
    } = this.state;
    return (
      <Fragment>
        <ReactModal
          onRequestClose={() => {
            this.setState({ modalIsOpen: false });
          }}
          isOpen={modalIsOpen}
          style={customStyles}
        >
          <EsfDetailsJur
            getFormationJurEsf={this.getFormationJurEsf}
            esf={selectedEsf}
            poaDate={poaDate}
            cDate={cDate}
            closeDetail={this.closeEsfDetailForm}
            addEsfNewProduct={this.addEsfNewProduct}
          />
        </ReactModal>

        <ReactModal
          onRequestClose={() => {
            this.setState({ modalJurIsOpen: false });
          }}
          isOpen={modalJurIsOpen}
          style={customStylesCreate}
        >
          <EsfCreateJur closeEsfCreateForm={this.closeEsfCreateForm} />
        </ReactModal>
        <div className="empty-space"></div>

        <div className="row mt-20">
          <div className="col-md-12">
            <button className="btn btn-success ml-19" onClick={this.openJurEsf}>
              создать ЭСФ
            </button>
          </div>
        </div>

        {Object.keys(formations).length === 0 && (
          <div className="row">
            <div className="col-md-12 text-center not-found-text">
              Данных не найдено
            </div>
          </div>
        )}
        {Object.keys(formations).length > 0 && formations.details && (
          <div className="row pt-20">
            <div className="col-md-12">
              <table className="table table-striped table-bordered">
                <thead className="bg-info text-white">
                  <tr>
                    <td>Исходящий номер ЭСФ в бухгалтерии</td>
                    <td>Клиент</td>
                    <td className="text-center">Дата совершения оборота</td>
                    <td className="text-center">
                      Стоимость товаров, работ, услуг с учетом косвенных налогов
                    </td>
                    <td className="text-center">
                      Стоимость товаров, работ, услуг без косвенных налогов
                    </td>
                    <td className="text-center">НДС</td>
                    <td className="text-center">Статус</td>
                    <td className="text-center">Детали</td>
                    <td className="text-center" />
                  </tr>
                </thead>
                <tbody>
                  {formations.details.map((formation, idx) => (
                    <tr key={idx}>
                      <td>{formation.num}</td>
                      <td>
                        {formation.name}({formation.tin})
                      </td>
                      <td className="text-center">{formation.turnoverDate}</td>
                      <td className="text-center tenge">
                        {formation.totalPriceWithTax.toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-center tenge">
                        {formation.totalPriceWithoutTax.toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-center tenge">
                        {formation.totalNdsAmount.toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-center">{formation.esfstatusname}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-w-icon detail-item"
                          title={formation.num}
                          onClick={() => {
                            this.handleDetails(formation);
                          }}
                        ></button>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            this.handleDelete(formation.num);
                          }}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-info text-white">
                  <tr>
                    <td colSpan="3">Итого</td>
                    <td className="text-center tenge">
                      {formations.details
                        .reduce((prev, cur) => {
                          return prev + parseFloat(+cur.totalPriceWithTax);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-center tenge">
                      {formations.details
                        .reduce((prev, cur) => {
                          return prev + parseFloat(+cur.totalPriceWithoutTax);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-center tenge">
                      {formations.details
                        .reduce((prev, cur) => {
                          return prev + parseFloat(+cur.totalNdsAmount);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan="3" />
                  </tr>
                </tfoot>
              </table>

              <div className="row mt-20">
                <div className="col-md-12">
                  <button
                    className="btn btn-success"
                    onClick={this.signXmlClick}
                    disabled={syncInvoice}
                  >
                    {syncInvoice
                      ? "Идет регистрация счет-фактуры в ИС ЭСФ"
                      : "Отправить счет-фактуру в ИС ЭСФ"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}
