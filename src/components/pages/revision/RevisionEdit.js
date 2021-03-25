import React, { Component, Fragment } from "react";
import Axios from "axios";
import Searching from "../../Searching";
import { isMobile } from "react-device-detect";
import Moment from "moment";
import Alert from "react-s-alert";
import ScrollUpButton from "react-scroll-up-button";
import { inherits } from "util";
import ReactModal from "react-modal";
import "../../../sass/revision.sass";
import RevisionDifference from "./RevisionDifference";
import RevisionMessage from "./RevisionMessage";

ReactModal.setAppElement("#root");

export default class RevisionEdit extends Component {
  state = {
    isLoading: true,
    isSubmitting: false,
    isDifferenceSubmitting: false,
    products: [],
    windowIsSmall: false,
    params: JSON.parse(sessionStorage.getItem("revision-params")) || {},
    text: {
      noproducts: "Отсканированных товаров не найдено",
      info:
        "Для проведения ревизии по новым товарам, сначала завершите текущую ревизию. Если во время ревизии были продажи на кассах, то они будут учтены автоматически. Пожалуйста, остановите все продажи с этого момента. Продажи могут быть возобновлены после завершения ревизии.",
      button: {
        endrevision: "Завершить ревизию",
      },
    },
    differenceList: [],
    modalIsOpen: false,
    revtype: "",
    revEndMessage: false,
    shallowDifference: [],
  };

  componentWillMount() {
    if (window.innerWidth < 480 || isMobile)
      this.setState({ windowIsSmall: true });

    if (this.state.params.revType === "cold") this.getColdRevProducts();
    else if (this.state.params.revType === "coldTemp")
      this.getTempColdRevProducts();
    else this.setState({ isLoading: false });
  }

  goToReport = () => {
    sessionStorage.removeItem("revision-params");
    this.props.history.push("/usercabinet/report/reportRevision");
  };

  goToRevision = () => {
    sessionStorage.removeItem("revision-params");
    this.props.history.push("/revision/params");
  };

  getColdRevProducts = () => {
    Axios.get("/api/revision/coldrevproducts", {
      params: { point: this.props.location.state.pointId },
    })
      .then((data) => {
        return data.data;
      })
      .then((products) => {
        this.setState({ products, isLoading: false });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };

  getTempColdRevProducts = () => {
    Axios.get("/api/revision/temprevproducts", {
      params: { point: this.props.location.state.pointId },
    })
      .then((data) => {
        return data.data;
      })
      .then((products) => {
        this.setState({ products: products.revProducts, isLoading: false });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };

  selledUnitsChanged = (idx, e) => {
    let { products } = this.state;
    //проверка чтобы поле могло быть пустым иначе все отвалится на проверки float isNaN
    if (e.target.value === "") {
      products[idx].selledUnits = "";
    } else {
      if (isNaN(parseFloat(e.target.value))) return;
      else if (
        products[idx].selledUnits > parseFloat(e.target.value) &&
        parseFloat(e.target.value) > products[idx].factUnits
      )
        Alert.warning(
          "Отсканированное количество не может быть меньше проданых товаров",
          {
            position: this.state.windowIsSmall ? "top" : "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          }
        );
      else if (
        products[idx].factUnits === "" ||
        parseFloat(e.target.value) > products[idx].factUnits
      )
        return Alert.warning(
          "Отсканированное количество не может быть меньше проданых товаров",
          {
            position: this.state.windowIsSmall ? "top" : "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          }
        );
      //проверяем если точка последний символ то оставляем все как есть, в ином случае парсим в float
      //эта же провека отсекает все прочие точки которые мы пытаемся ставить если одна точка уже есть
      let selledUnits =
        e.target.value.indexOf(".") === e.target.value.length - 1
          ? e.target.value
          : parseFloat(e.target.value);
      if (selledUnits < 0) selledUnits = selledUnits * -1;

      products[idx].selledUnits = selledUnits;
    }
    this.setState(products);
  };

  factUnitsChanged2 = (idx, e) => {
    let { products } = this.state;
    //проверка чтобы поле могло быть пустым иначе все отвалится на проверки float isNaN
    if (e.target.value === "") {
      products[idx].factUnits = "";
    } else {
      if (isNaN(parseFloat(e.target.value))) return;
      //проверяем если точка последний символ то оставляем все как есть, в ином случае парсим в float
      //эта же провека отсекает все прочие точки которые мы пытаемся ставить если одна точка уже есть
      let factUnits =
        e.target.value.indexOf(".") === e.target.value.length - 1
          ? e.target.value
          : parseFloat(e.target.value);
      if (factUnits < 0) factUnits = factUnits * -1;
      products[idx].factUnits = factUnits;
    }
    this.setState(products);
  };

  factUnitsKeyDown = (e) => {
    //38 - arrowUp
    //40 - arrowDown
    //69 - 'e'
    // if(e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 69)
    //     e.preventDefault()

    //позволяем нажимать все клавиши на которых может быть точка
    if (e.keyCode !== 110 && e.keyCode !== 190 && e.keyCode !== 191) {
      //проверяем если число не парсится в float, и поле не пустое то не даем ничего писать
      if (isNaN(parseFloat(e.target.value)) && e.target.value.length > 0)
        e.preventDefault();
    }
  };

  handleDifferenceList = () => {
    const { params } = this.state;
    this.setState({ isSubmitting: true });
    const revtype =
      params.revType === "coldTemp"
        ? 4
        : this.state.params.revType === "cold"
        ? 3
        : null;

    //Если выбрана полная ревизия начинается проверка товаров,
    //которые не были выбраны при ревизии, но присутствуют на складе.
    //При выборе частичной ревизии эта проверка нивелируется.
    if (params.revisionCondition.value === 1 && revtype === 3) {
      Axios.get("/api/revision/comparerevisiontostock", {
        params: { point: this.props.location.state.pointId },
      })
        .then((data) => {
          return data.data;
        })
        .then((df) => {
          if (df.length > 0) {
            const today = Moment(new Date());
            let differenceList = df.map((diff) => {
              return {
                code: diff.code,
                name: diff.name,
                product: diff.product,
                purchaseprice: diff.purchaseprice,
                sellprice: diff.sellprice,
                units: diff.units,
                date: today.format("YYYY-MM-DD HH:mm:ss"),
                attributes: diff.attributes,
                attrvalue: diff.attrvalue,
                unitswas: diff.units, //для сервиса списания
                unitsSelled: 0, //для сервиса списания
                factUnits: 0, //для сервиса списания
              };
            });
            this.setState({
              modalIsOpen: true,
              differenceList,
            });
          } else {
            this.handleSend();
          }
        })
        .catch((err) => {});
    } else if (params.revisionCondition.value === 1 && revtype === 4) {
      Axios.get("/api/revision/comparetemprevision", {
        params: { point: this.props.location.state.pointId },
      })
        .then((data) => {
          return data.data;
        })
        .then((df) => {
          if (df.length > 0) {
            const today = Moment(new Date());
            let differenceList = df.map((diff) => {
              return {
                code: diff.code,
                name: diff.name,
                product: diff.product,
                purchaseprice: diff.purchaseprice,
                sellprice: diff.sellprice,
                units: diff.units,
                date: today.format("YYYY-MM-DD HH:mm:ss"),
                attributes: diff.attributes,
                attrvalue: diff.attrvalue,
                unitswas: diff.units, //для сервиса списания
                unitsSelled: 0, //для сервиса списания
                factUnits: 0, //для сервиса списания
              };
            });
            this.setState({
              modalIsOpen: true,
              differenceList,
            });
          } else {
            this.handleSend();
          }
        })
        .catch((err) => {});
    } else this.handleSend();
  };

  handleSend = (withDifference) => {
    const { products, windowIsSmall, differenceList, params } = this.state;

    if (products.length === 0) {
      return Alert.warning("Для завершения ревизии не выбран ни один товар", {
        position: windowIsSmall ? "top" : "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }

    const revtype =
      params.revType === "coldTemp"
        ? 4
        : this.state.params.revType === "cold"
        ? 3
        : null;
    let minusDifference = false;

    let productsBeforeSend = [];

    if (!withDifference && params.revisionCondition.value === 1) {
      productsBeforeSend = products.concat(differenceList);
    } else productsBeforeSend = products;

    const coldRevStartTime = params.currentTime;
    const today = Moment(new Date());
    const productsToSend = productsBeforeSend.map((selectedProduct) => {
      const factUnits = selectedProduct.factUnits
        ? selectedProduct.factUnits
        : 0;
      const unitsSelled = selectedProduct.selledUnits
        ? selectedProduct.selledUnits
        : 0;
      const factSelledDiff = factUnits - unitsSelled;
      const factUnitsWas = selectedProduct.units - unitsSelled;
      if (factSelledDiff < 0) minusDifference = true;
      return {
        createdate:
          params.revType === "coldTemp"
            ? coldRevStartTime
            : selectedProduct.date,
        prodid: selectedProduct.product,
        unitswas: factUnitsWas,
        time:
          params.revType === "coldTemp"
            ? today.format("MM.DD.YYYY HH:mm:ss")
            : Moment(selectedProduct.date).format("MM.DD.YYYY HH:mm:ss"),
        attribute: selectedProduct.attributes,
        units: factSelledDiff,
        unitsSelled,
      };
    });

    if (minusDifference) {
      return Alert.warning(
        "Отсканированное количество не может быть меньше проданых товаров",
        {
          position: windowIsSmall ? "top" : "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        }
      );
    }
    this.setState({ isDifferenceSubmitting: true });
    if (revtype === 4 || revtype === 3) {
      Axios.post("/api/revision", {
        user: this.props.location.state.username,
        pointid: this.props.location.state.pointId,
        revtype,
        condition: params.revisionCondition.value,
        products: productsToSend,
      })
        .then((data) => {
          return data.data;
        })
        .then((resp) => {
          console.log(resp);
          this.setState({ isSubmitting: false, isDifferenceSubmitting: false });
          if (resp.code === "success") {
            if (
              withDifference &&
              differenceList.length > 0 &&
              params.revisionCondition.value === 1
            ) {
              this.setState({ revtype });
              this.saveDifference(resp);
            }

            this.setState({ revEndMessage: true });
            console.log("revEndMessage", this.state.revEndMessage);
          } else {
            Alert.error(
              resp.code === "error" && resp.text
                ? resp.text
                : "Сервис временно не доступен",
              {
                position: windowIsSmall ? "top" : "top-right",
                effect: "bouncyflip",
                timeout: 3000,
              }
            );
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ isSubmitting: false, isDifferenceSubmitting: false });
          Alert.error("Сервис временно не доступен", {
            position: windowIsSmall ? "top" : "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
        });
    }
  };

  saveDifference = (resp) => {
    const { differenceList, windowIsSmall, revtype } = this.state;
    const date =
      revtype === 3
        ? Moment(resp.submitdate).format("YYYY-MM-DD HH:mm:ss")
        : Moment(resp.revisiondate).format("YYYY-MM-DD HH:mm:ss");
    Axios({
      method: "POST",
      url: "/api/revision/savedifference",
      data: {
        differenceList,
        date,
        user: this.props.location.state.username,
        pointid: this.props.location.state.pointId,
      },
      responseType: "blob",
    })
      .then((data) => {
        return data.data;
      })
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
        Alert.error("Сервис временно не доступен", {
          position: windowIsSmall ? "top" : "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
      });
  };

  closeDetail = () => {
    this.setState({ modalIsOpen: false, isSubmitting: false });
  };

  render() {
    const {
      isLoading,
      products,
      text,
      windowIsSmall,
      modalIsOpen,
      differenceList,
      revEndMessage,
      isSubmitting,
      isDifferenceSubmitting,
    } = this.state;
    return (
      <div className="revision-edit">
        <ReactModal
          onRequestClose={this.closeDetail}
          isOpen={modalIsOpen || revEndMessage}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: !revEndMessage ? "80%" : "30%",
              zIndex: 11,
              height: !revEndMessage ? "100vh" : "25vh",
              overflowY: "auto",
            },
            overlay: { zIndex: 10 },
          }}
          shouldCloseOnOverlayClick={!revEndMessage}
        >
          {!revEndMessage && (
            <RevisionDifference
              differenceList={differenceList}
              isDifferenceSubmitting={isDifferenceSubmitting}
              revisionDate={this.props.location.state.revisionDate}
              handleSend={(withDifference) => this.handleSend(withDifference)}
              closeDetail={this.closeDetail}
            />
          )}
          {revEndMessage && (
            <RevisionMessage
              goToReport={this.goToReport}
              goToRevision={this.goToRevision}
            />
          )}
        </ReactModal>
        <ScrollUpButton
          ToggledStyle={isMobile ? { left: 20, right: inherits } : {}}
          style={
            isMobile
              ? {
                  left: -50,
                  right: inherits,
                  transitionProperty: "opacity, left",
                }
              : {}
          }
        />
        <Alert stack={{ limit: 1 }} offset={windowIsSmall ? 0 : 30} />
        <div
          className={`revision-header ${
            isMobile ? "mobile-revision-header" : "window-width"
          }`}
        >
          <span>TezRevision</span>
          <a href="/revision/signout">
            <li>Выход</li>
          </a>
        </div>
        <div
          className="window-width mb-100"
          style={{ paddingTop: isMobile ? "60px" : "0px" }}
        >
          {isLoading && <Searching />}
          {!isLoading && products.length === 0 && (
            <div className="row text-center">
              <div className="col-md-12 not-found-text">{text.noproducts}</div>
            </div>
          )}
          {!isLoading && products.length > 0 && (
            <Fragment>
              <span style={{ fontSize: "16px" }}>
                <br />
                Для проведения ревизии по новым товарам сначала завершите
                текущую ревизию. <br />
                <br /> <b>ВАЖНО!</b> Если во время ревизии были продажи товаров
                на кассах, то они будут учтены автоматически. <br />{" "}
                <b>ВАЖНО!</b> Для корректного учета продаж в ревизии: <br /> 1)
                пожалуйста, остановите все продажи с этого момента, <br /> 2)
                пожалуйста, убедитесь, что после последней продажи прошло не
                менее 30 секунд, после чего нажмите кнопку "Завершить ревизию".
                <br />
                <br /> Продажи могут быть возобновлены после завершения ревизии.
                <br />
                <br />
              </span>
              <table
                className="data-table editedProductsTable"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>Наименование</th>
                    <th style={{ minWidth: "53px" }}>Было</th>
                    <th style={{ minWidth: "53px" }}>
                      Отсканированное количество
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, idx) => (
                    <tr key={idx}>
                      <td>
                        {product.name} {product.attrvalue}
                      </td>
                      <td>{product.units}</td>
                      <td>
                        {product.factUnits
                          ? product.factUnits
                          : product.factUnits === 0
                          ? product.factUnits
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className="btn btn-sm btn-success mt-10"
                disabled={isSubmitting}
                onClick={this.handleDifferenceList}
              >
                {text.button.endrevision}
              </button>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}
