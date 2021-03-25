import React, { Component } from "react";
import Axios from "axios";
import Searching from "../../../../Searching";

import Alert from "react-s-alert";
import Select from "react-select";
import Moment from "moment";
import "./add-promotions.sass";
import ReactModal from "react-modal";
import AddPromotionAlert from "./AddPromotionAlert";
import SetItems from "./SetItems";
import PositionItems from "./PositionItems";

ReactModal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "60%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    zIndex: 11,
  },
  overlay: { zIndex: 10 },
};

export default class AddPromotions extends Component {
  maxSetId = 100;
  maxPositionId = 100;
  state = {
    barcode: "",
    checkDates: [],
    condition: { value: 1, label: "За комплект" },
    conditions: [],
    dateFrom: Moment().format("YYYY-MM-DD"),
    dateTo: Moment().format("YYYY-MM-DD"),
    details: false,
    disableNextButton: true,
    discount: { value: 1, label: "Скидка на позицию" },
    discounts: [],
    discountsWithoutTotal: [],
    discountsWithoutPosition: [],
    finalResult: {},
    isLoading: false,
    gift: false,
    point: "",
    points: [],
    positionProduct: "",
    positionProducts: [],
    positionItems: [this.createNewPositionItem()],
    product: { label: "", value: "", code: "" },
    products: [],
    promotionName: "",
    setItems: [this.createNewSetItem()],
    totalSum: "",
    totalDiscount: "",
  };

  componentDidMount() {
    this.getPoints();
    this.getSprDiscounts();
    this.getSprConditions();
    this.getCurrentPromotionDates();
  }

  getCurrentPromotionDates = () => {
    Axios.get("/api/promotions/dates")
      .then((res) => res.data)
      .then((dates) => {
        let checkDates = {};
        dates.forEach((value) => {
          checkDates = {
            bdate: Moment(value.bdate).format("YYYY-MM-DD"),
            edate: Moment(value.edate).format("YYYY-MM-DD"),
            point: value.point,
          };
        });

        this.setState({
          checkDates,
          isLoading: false,
          isError: false,
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false, isError: true });
        console.log(err);
      });
  };

  closeAlert = (isSubmit) => {
    const { finalResult } = this.state;
    if (isSubmit) {
      this.createPromotion(finalResult);
    }
    this.setState({ modalIsOpenAlert: false });
  };

  getSprDiscounts = () => {
    const name = "discounts";
    Axios.get("/api/promotions/getspr", { params: { name } })
      .then((res) => res.data)
      .then((res) => {
        const discounts = res.map((d) => {
          return {
            label: d.name,
            value: d.id,
          };
        });
        const discountsWithoutTotal = [
          ...discounts.slice(0, 1),
          ...discounts.slice(1 + 1),
        ];
        const discountsWithoutPosition = [...discounts.slice(1, 3)];

        const discountsWithTotal = [...discounts];

        this.setState({
          discounts: [...discountsWithoutTotal],
          discountsWithoutTotal: [...discountsWithoutTotal],
          discountsWithTotal: [...discountsWithTotal],
          discountsWithoutPosition: [...discountsWithoutPosition],
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  getSprConditions = () => {
    const name = "conditions";
    Axios.get("/api/promotions/getspr", { params: { name } })
      .then((res) => res.data)
      .then((res) => {
        const conditions = res.map((d) => {
          return {
            label: d.name,
            value: d.id,
          };
        });
        this.setState({
          conditions: [...conditions],
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  getPoints = () => {
    Axios.get("/api/point")
      .then((res) => res.data)
      .then((res) => {
        const all = [{ label: "Все", value: 0 }];
        const points = res.map((salesPoint) => {
          return {
            label: salesPoint.name,
            value: salesPoint.id,
          };
        });

        this.setState({
          points: [...all, ...points],
        });
        this.getProducts();
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  getProducts = (productName) => {
    let point = this.state.point.value;
    Axios.get("/api/products/mixedsearch", { params: { productName, point } })
      .then((res) => res.data)
      .then((list) => {
        const products = list.map((product) => {
          const mix = product.code + " " + product.name;
          return {
            label: mix,
            value: product.id,
            code: product.code,
          };
        });

        this.setState({
          products: [...products],
          positionProducts: [...products],
          isLoading: false,
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };

  createNewSetItem() {
    return {
      id: this.maxSetId++,
      value: 0,
      product: "",
      barcode: "",
    };
  }

  createNewPositionItem() {
    return {
      id: this.maxPositionId++,
      value: 0,
      product: "",
      barcode: "",
    };
  }

  dateFromChange = (e) => {
    const dateFrom = e.target.value;
    this.setState({ dateFrom });
  };

  dateToChange = (e) => {
    const dateTo = e.target.value;
    this.setState({ dateTo });
  };

  promotionNameChange = (e) => {
    const promotionName = e.target.value;
    const { point } = this.state;

    this.setState({ promotionName });
    if (point && promotionName) {
      this.setState({ disableNextButton: false });
    } else if (!point || !promotionName) {
      this.setState({ disableNextButton: true });
    }
  };

  totalSumChange = (e) => {
    const totalSum = e.target.value;
    this.setState({ totalSum });
  };

  onConditionChange = (condition) => {
    this.maxSetId = 100;

    if (condition.value === 1) {
      this.setState({
        discounts: this.state.discountsWithoutTotal,
        discount: { value: 1, label: "Скидка на позицию" },
      });
    } else if (condition.value === 2) {
      this.setState({
        discount: { value: 2, label: "Скидка(в тенге) на общую сумму чека" },
        discounts: this.state.discountsWithoutPosition,
      });
    }
    this.setState({
      condition,
      setItems: [this.createNewSetItem()],
      totalSum: "",
    });
  };

  onDiscountChange = (discount) => {
    this.maxPositionId = 100;
    let gift = false;
    if (discount.value === 3) {
      gift = true;
    } else {
      gift = false;
    }
    this.setState({
      discount,
      gift,
      positionItems: [this.createNewPositionItem()],
      totalDiscount: "",
    });
  };

  totalDiscountChange = (e) => {
    const totalDiscount = e.target.value;
    this.setState({ totalDiscount });
  };

  onPointChange = (point) => {
    const { promotionName } = this.state;
    this.setState({ point });
    if (promotionName) {
      this.setState({ disableNextButton: false });
    } else if (!promotionName) {
      this.setState({ disableNextButton: true });
    }
    this.onClear();
    this.getProducts();
  };

  onClear = () => {
    this.maxSetId = 100;
    this.maxPositionId = 100;
    this.setState({
      discount: { value: 1, label: "Скидка на позицию" },
      condition: { value: 1, label: "За комплект" },
      positionItems: [this.createNewPositionItem()],
      setItems: [this.createNewSetItem()],
      totalDiscount: "",
      totalSum: "",
    });
  };

  onQuantityChange = (id, e) => {
    const { setItems } = this.state;
    let quantity = isNaN(e.target.value) ? 0 : e.target.value;
    setItems.forEach((q) => {
      q.value = q.id === id ? quantity : q.value;
    });
    this.setState((oldState) => {
      const newQuantities = [...oldState.setItems];
      return {
        setItems: newQuantities,
      };
    });
  };

  onProductChange = (id, product) => {
    const { setItems } = this.state;

    if (product.length === 0) {
      setItems.forEach((q) => {
        q.product = q.id === id ? product : q.product;
        q.barcode = q.id === id ? "" : q.barcode;
      });
      this.setState((oldState) => {
        const newProducts = [...oldState.setItems];
        return {
          setItems: newProducts,
        };
      });
    } else {
      setItems.forEach((q) => {
        q.product = q.id === id ? product : q.product;
        q.barcode = q.id === id ? product.code : q.barcode;
      });

      let check = [];
      setItems.forEach((a) => {
        if (check.indexOf(a.barcode) >= 0) {
          Alert.warning(`Этот товар уже есть в списке!`, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
          a.product = "";
          return;
        } else {
          check.push(a.barcode);
        }
      });

      this.setState((oldState) => {
        const newProducts = [...oldState.setItems];
        return {
          setItems: newProducts,
        };
      });
    }
  };

  onPositionProductChange = (id, product) => {
    const { positionItems } = this.state;

    if (product.length === 0) {
      positionItems.forEach((q) => {
        q.product = q.id === id ? product : q.product;
        q.barcode = q.id === id ? "" : q.barcode;
      });
      this.setState((oldState) => {
        const newProducts = [...oldState.positionItems];
        return {
          positionItems: newProducts,
        };
      });
    } else {
      positionItems.forEach((q) => {
        q.product = q.id === id ? product : q.product;
        q.barcode = q.id === id ? product.code : q.barcode;
      });

      let check = [];
      positionItems.forEach((a) => {
        if (check.indexOf(a.barcode) >= 0) {
          Alert.warning(`Этот товар уже есть в списке!`, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
          a.product = "";
          return;
        } else {
          check.push(a.barcode);
        }
      });
      this.setState((oldState) => {
        const newProducts = [...oldState.positionItems];
        return {
          positionItems: newProducts,
        };
      });
    }
  };

  onProductListInput = (productName) => {
    this.getProducts(productName);
  };

  onPositionProductListInput = (productName) => {
    this.getProducts(productName);
  };

  onPositionDiscountChange = (id, e) => {
    const { positionItems } = this.state;
    let discount = isNaN(e.target.value) ? 0 : e.target.value;
    positionItems.forEach((q) => {
      q.value = q.id === id ? discount : q.value;
    });
    this.setState((oldState) => {
      const newDiscounts = [...oldState.positionItems];
      return {
        positionItems: newDiscounts,
      };
    });
  };

  handleDetails = (details) => {
    this.setState({ details });
  };

  handleAddSet = () => {
    const newItem = this.createNewSetItem();
    this.setState(({ setItems }) => {
      const newArray = [...setItems, newItem];
      return {
        setItems: newArray,
      };
    });
  };

  handleAddPosition = () => {
    const newItem = this.createNewPositionItem();
    this.setState(({ positionItems }) => {
      const newArray = [...positionItems, newItem];

      return {
        positionItems: newArray,
      };
    });
  };

  handleDeleteSet = (id) => {
    this.setState(({ setItems }) => {
      const idx = setItems.findIndex((el) => el.id === id);

      const newArray = [...setItems.slice(0, idx), ...setItems.slice(idx + 1)];

      return {
        setItems: newArray,
      };
    });
  };

  handleDeletePosition = (id) => {
    this.setState(({ positionItems }) => {
      const idx = positionItems.findIndex((el) => el.id === id);

      const newArray = [
        ...positionItems.slice(0, idx),
        ...positionItems.slice(idx + 1),
      ];

      return {
        positionItems: newArray,
      };
    });
  };

  handleCreatePromotion = () => {
    const {
      dateFrom,
      dateTo,
      checkDates,
      setItems,
      positionItems,
      point,
      promotionName,
      discount,
      condition,
      totalSum,
      totalDiscount,
    } = this.state;

    if (!dateFrom || !dateTo) {
      const text = !dateFrom
        ? "Дата начала акции"
        : !dateTo
        ? "Дата окончания акции"
        : "Фильтр";
      Alert.warning(`Заполните поле  ${text}`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
      return;
    } else if (dateFrom > dateTo) {
      Alert.warning(`Заполните дату правильно`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
      return;
    }

    if (!promotionName) {
      Alert.warning("Введите название акции", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }

    if (!point) {
      Alert.warning("Выберите торговую точку", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }
    if (
      condition.value === 2 &&
      discount.value === 2 &&
      point.value === checkDates.point &&
      !(
        (dateFrom < checkDates.bdate && dateTo < checkDates.edate) ||
        (dateFrom > checkDates.bdate && dateTo > checkDates.edate)
      )
    ) {
      Alert.warning("За выбранный период уже существует подобная акция.", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }

    let ifValue = [];
    let noSetProduct = false;
    let noSetQuantity = false;
    setItems.forEach((set) => {
      if (!set.product) {
        noSetProduct = true;
        return;
      }
      if (set.value === 0 || set.value === "0") {
        noSetQuantity = true;
        return;
      }
      const values = { id: set.product.value, value: set.value };
      ifValue.push(values);
    });

    if (noSetQuantity && condition.value === 1) {
      return Alert.warning("Количество не может быть 0!", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    let setList = { id: condition.value, values: ifValue };
    const setListSum = { id: condition.value, values: [{ value: totalSum }] };
    setList = condition.value === 1 ? setList : setListSum;

    if (noSetProduct && condition.value === 1) {
      Alert.warning("Выберите товар за комплект", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }

    if (!totalSum && condition.value === 2) {
      Alert.warning("Введите сумму за комплект", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }

    let thenValue = [];
    let noPositionProduct = false;
    let noConditionDiscount = false;
    positionItems.forEach((set) => {
      if (!set.product || !set.barcode) {
        noPositionProduct = true;
        return;
      }
      if (set.value === 0 || set.value === "0") {
        noConditionDiscount = true;
        return;
      }
      const values = { id: set.product.value, value: set.value };
      thenValue.push(values);
    });
    let positionList = { id: discount.value, values: thenValue };
    const positionListSum = {
      id: discount.value,
      values: [{ value: totalDiscount }],
    };
    positionList =
      discount.value === 1 || discount.value === 3
        ? positionList
        : positionListSum;

    if (noPositionProduct && discount.value === 1) {
      Alert.warning("Выберите товар на позицию", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }
    if (noConditionDiscount && discount.value === 1) {
      return Alert.warning("Скидка не может быть 0%!", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    if (!totalDiscount && discount.value === 2) {
      return Alert.warning("Введите скидку на позицию", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    if (positionList.values.length === 0) {
      return Alert.warning("Введите количество подарка", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    const finalResult = {
      startdate: dateFrom,
      expirationdate: dateTo,
      point: point.value,
      promotionName: promotionName,
      if: setList,
      then: positionList,
    };

    this.setState({
      modalIsOpenAlert: true,
      finalResult,
      setItems,
      positionItems,
    });
  };

  createPromotion = (finalResult) => {
    Axios.post("/api/promotions/add", finalResult)
      .then((res) => res.data)
      .then((promotions) => {
        this.onClear();
        Alert.success("Акция успешно создана", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        this.setState({ details: false });
      })
      .catch((err) => {
        Alert.error(
          err.response.data.code === "internal_error"
            ? this.state.alert.raiseError
            : err.response.data.text,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          }
        );
        console.log(err);
      });
  };

  render() {
    const {
      condition,
      conditions,
      dateFrom,
      dateTo,
      details,
      disableNextButton,
      discount,
      discounts,
      discountsWithoutTotal,
      finalResult,
      gift,
      isLoading,
      modalIsOpenAlert,
      points,
      point,
      positionItems,
      positionProduct,
      positionProducts,
      product,
      products,
      promotionName,
      setItems,
      totalSum,
      totalDiscount,
    } = this.state;

    return (
      <div className="add-promotions">
        <ReactModal isOpen={modalIsOpenAlert} style={customStyles}>
          <AddPromotionAlert
            history={this.props.history}
            closeAlert={this.closeAlert}
            finalResult={finalResult}
            point={point}
            setItems={setItems}
            positionItems={positionItems}
          />
        </ReactModal>

        {isLoading && <Searching />}
        {!details && (
          <div>
            <div className="row">
              <div className="col-md-3">
                <label htmlFor="">Дата начала акции</label>
                <input
                  type="date"
                  value={dateFrom}
                  className="form-control"
                  name="dateFrom"
                  onChange={this.dateFromChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="">Дата окончания акции</label>
                <input
                  type="date"
                  value={dateTo}
                  className="form-control"
                  name="dateTo"
                  onChange={this.dateToChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="">Торговая точка</label>
                <Select
                  name="point"
                  value={point}
                  onChange={this.onPointChange}
                  options={points}
                  placeholder="Выберите торговую точку"
                  noOptionsMessage={() => "Торговые точки не найдены"}
                />
              </div>
            </div>

            <div style={{ paddingTop: "2rem" }} className="row">
              <div className="col-md-6">
                <input
                  type="text"
                  value={promotionName}
                  placeholder="Введите название акции"
                  className="form-control"
                  name="promotionName"
                  onChange={this.promotionNameChange}
                />
              </div>

              <button
                className="btn btn-outline-success col-md-3"
                onClick={() => this.handleDetails(true)}
                disabled={disableNextButton}
              >
                Далее
              </button>
            </div>
          </div>
        )}

        {details && (
          <div>
            <div style={{ paddingTop: "2rem" }} className="row">
              <button
                style={{ marginLeft: "1rem", height: "50%" }}
                className="btn btn-outline-secondary col-md-3"
                onClick={() => this.handleDetails(false)}
              >
                Назад
              </button>
            </div>
            <div style={{ paddingTop: "1rem" }} className="row">
              <div
                style={{ display: "flex", flexDirection: "column" }}
                className=" col-md-12"
              >
                <label style={{ opacity: "50%" }}>
                  Дата проведения акции: {dateFrom} - {dateTo}
                </label>
                <label style={{ opacity: "50%" }}>
                  Торговая точка: {point.label}
                </label>
                <label style={{ opacity: "50%" }}>
                  Название акции: {promotionName}
                </label>
              </div>
            </div>
            <div style={{ paddingTop: "1rem" }} className="row">
              <div className="col-md-6">
                <Select
                  name="condition"
                  value={condition}
                  onChange={this.onConditionChange}
                  options={conditions}
                  placeholder="Выберите условие акции"
                />
              </div>
              <div className="col-md-6">
                <Select
                  name="discount"
                  value={discount}
                  onChange={this.onDiscountChange}
                  options={discounts}
                  placeholder="Выберите результат"
                />
              </div>
            </div>
            <hr />
            <div className="row">
              {condition.value === 1 && (
                <div className="col-md-6">
                  <SetItems
                    product={product}
                    products={products}
                    setItems={setItems}
                    handleDeleteSet={this.handleDeleteSet}
                    onProductChange={this.onProductChange}
                    onProductListInput={this.onProductListInput}
                    onQuantityChange={this.onQuantityChange}
                  />
                </div>
              )}
              {condition.value === 2 && discountsWithoutTotal.length !== 0 && (
                <div style={{ paddingTop: "1.86rem" }} className="col-md-6">
                  <input
                    type="text"
                    value={totalSum}
                    placeholder="Введите сумму"
                    className="form-control"
                    name="totalSum"
                    onChange={this.totalSumChange}
                  />
                </div>
              )}
              {(discount.value === 1 || discount.value === 3) && (
                <div className="col-md-6">
                  <PositionItems
                    gift={gift}
                    positionProduct={positionProduct}
                    positionProducts={positionProducts}
                    positionItems={positionItems}
                    handleDeletePosition={this.handleDeletePosition}
                    onPositionProductChange={this.onPositionProductChange}
                    onPositionDiscountChange={this.onPositionDiscountChange}
                    onPositionProductListInput={this.onPositionProductListInput}
                  />
                </div>
              )}
              {discount.value === 2 && (
                <div style={{ paddingTop: "1.86rem" }} className="col-md-6">
                  <input
                    type="text"
                    value={totalDiscount}
                    placeholder="Введите скидку(в тенге)"
                    className="form-control"
                    name="totalDiscount"
                    onChange={this.totalDiscountChange}
                  />
                </div>
              )}
            </div>
            <div className="row justify-content-center">
              {condition.value === 1 && (
                <div className="col-md-6">
                  <button
                    className="btn btn-outline-info add-point col-md-4"
                    onClick={this.handleAddSet}
                  >
                    Добавить еще один товар
                  </button>
                </div>
              )}
              {condition.value === 2 && <div className="col-md-6" />}
              {(discount.value === 1 || discount.value === 3) && (
                <div className="col-md-6">
                  <button
                    className="btn btn-outline-info add-point col-md-4"
                    onClick={this.handleAddPosition}
                  >
                    Добавить еще
                    {discount.value === 1
                      ? "одну скидку"
                      : discount.value === 3
                      ? "один подарок"
                      : ""}
                  </button>
                </div>
              )}
              {discount.value === 2 && <div className="col-md-6" />}
            </div>

            <div className="row justify-content-center">
              <button
                className="btn btn-outline-success cert-create"
                onClick={this.handleCreatePromotion}
              >
                Создать
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
