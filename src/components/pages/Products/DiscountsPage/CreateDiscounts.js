import React, { useState, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Axios from "axios";
import Searching from "../../../Searching";
import alert from "react-s-alert";
import Select from "react-select";
import Moment from "moment";
import "./create-discounts.sass";
import { Alert, AlertTitle } from "@material-ui/lab";
import ShowInactive from "../../ClosedListPages/ShowInactive";
import Paper from "@material-ui/core/Paper";
import ReactTooltip from "react-tooltip";
import Checkbox from '@material-ui/core/Checkbox';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#bdbdbd",
    color: theme.palette.common.white,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  button: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
  },
  notFountd: {
    opacity: "60%",
    display: "flex",
    justifyContent: "center",
  },
});

const GreenCheckbox = withStyles({
  root: {
    color: 'green',
    '&$checked': {
      color: 'green',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default function CreateDiscounts() {
  const classes = useStyles();
  const [avgPrice, setAvgPrice] = useState(0);
  const [avgDiscount, setAvgDiscount] = useState(0);
  const [avgDiscountAmount, setAvgDiscountAmount] = useState(0);
  const [barcode, setBarcode] = useState("");
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [timeFrom, setTimeFrom] = useState('00:00');
  const [timeTo, setTimeTo] = useState('00:00');
  const [disc, setDisc] = useState(0);
  const [discountsum, setDiscountSum] = useState({
    label: "не суммировать",
    value: false,
  });
  const [discounts, setDiscounts] = useState([]);
  const [discountPoints, setDiscountPoints] = useState([
    {
      id: 1,
      object: null,
      discount: null,
      expirationdate: null,
      startdate: null,
      pointid: null,
      pointname: null,
      name: null,
      discountid: null,
    },
  ]);
  const [discountCategories, setDiscountCategories] = useState([
    {
      id: 2,
      object: null,
      discount: null,
      expirationdate: null,
      startdate: null,
      pointid: null,
      pointname: null,
      name: null,
      discountid: null,
    },
  ]);
  const [discountBrands, setDiscountBrands] = useState([
    {
      id: 3,
      object: null,
      discount: null,
      expirationdate: null,
      startdate: null,
      pointid: null,
      pointname: null,
      name: null,
      discountid: null,
    },
  ]);
  const [discountProducts, setDiscountProducts] = useState([
    {
      id: 4,
      object: null,
      discount: null,
      expirationdate: null,
      startdate: null,
      pointid: null,
      pointname: null,
      name: null,
      discountid: null,
    },
  ]);
  const [isLoading, setLoading] = useState(false);
  const [isProductLoading, setProductLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [salesPoint, setSalesPoint] = useState("");
  const [salesPointWithAll, setSalesPointWithAll] = useState("");
  const [productList, setProductList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [productSelectValue, setProductSelectValue] = useState("");
  const [points, setPoints] = useState([]);
  const [pointsWithAll, setPointsWithAll] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectDiscount, setSelectDiscount] = useState({
    label: "Для всех торговых точек",
    value: 0,
  });
  const selectDiscounts = [
    {
      label: "Для всех торговых точек",
      value: 0,
    },
    {
      label: "Для торговых точек по отдельности",
      value: 1,
    },
    {
      label: "По категориям",
      value: 2,
    },
    {
      label: "По брендам",
      value: 3,
    },
    {
      label: "По товарам",
      value: 4,
    },
  ];

  const discountsums = [
    {
      label: "Не суммировать",
      value: false,
    },
    {
      label: "Суммировать данную скидку",
      value: true,
    },
  ];

  const [tag, setTag] = useState(false);

  const tagChange = (event) => {
    setTag(event.target.checked);
  };

  useEffect(() => {
    getProducts();
    getDiscountsInfo();
    setLoading(true);
  }, []);

  const getPoints = () => {
    Axios.get("/api/point")
      .then((res) => res.data)
      .then((res) => {
        const all = { label: "Все", value: 0 };
        const pointsChanged = res.map((p) => {
          return {
            label: p.name,
            value: p.id,
          };
        });
        setLoading(false);
        setPoints([...pointsChanged]);
        setPointsWithAll([...all, ...pointsChanged]);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const getBrands = (inputValue) => {
    Axios.get("/api/brand/search", { params: { brand: inputValue } })
      .then((res) => res.data)
      .then((list) => {
        const brandsWithoutCat = list.filter((brand) => brand.id !== "0");
        const brandsChanged = brandsWithoutCat.map((result) => {
          return {
            label: result.brand,
            value: result.id,
          };
        });
        setBrands([...brandsChanged]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCategories = () => {
    Axios.get("/api/categories/getcategories", { params: { deleted: false } })
      .then((res) => res.data)
      .then((list) => {
        const categoriesWithoutCat = list.filter(
          (category) => category.id !== "0"
        );
        const categoriesChanged = categoriesWithoutCat.map((category) => {
          return {
            label: category.name,
            value: category.id,
          };
        });
        setCategories([...categoriesChanged]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProductByBarcode = (barcode) => {
    Axios.get("/api/products/barcode", { params: { barcode } })
      .then((res) => res.data)
      .then((res) => {
        const product = {
          value: res.id,
          label: res.name,
          code: res.code,
        };
        setProductSelectValue(product);
        searchProducts(product.code);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProducts = (productName) => {
    Axios.get("/api/products", { params: { productName } })
      .then((res) => res.data)
      .then((list) => {
        const productsChanged = list.map((product) => {
          return {
            label: product.name,
            value: product.id,
            code: product.code,
          };
        });

        setProducts([...productsChanged]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onCategoryListInput = (cat) => {
    if (cat.length > 0) getCategories(cat);
  };

  const onBrandListInput = (br) => {
    if (br.length > 0) getBrands(br);
  };

  const onProductListInput = (productName) => {
    if (avgDiscount > 0 || avgDiscountAmount > 0) {
      setAvgDiscountAmount(0);
      setAvgDiscount(0);
    }
    getProducts(productName);
  };

  const dateFromChange = (e) => {
    setDateFrom(e.target.value);
  };

  const dateToChange = (e) => {
    setDateTo(e.target.value);
  };

  const onPointsChange = (sp) => {
    setSalesPoint(sp);
  };

  const onPointsAllChange = (spAll) => {
    setSalesPointWithAll(spAll);
  };

  const onSelectChange = (selected) => {
    getPoints();
    if (selected.value === 2) getCategories();
    else if (selected.value === 3) getBrands();
    else if (selected.value === 4) getProducts();
    setSelectDiscount(selected);
    setProductList([]);
    setProductsList([]);
    setSalesPoint("");
    setSalesPointWithAll({ label: "Все", value: 0 });
    setBrand("");
    setProductSelectValue("");
    setCategory("");
    setDateFrom(Moment().format("YYYY-MM-DD"));
    setDateTo(Moment().format("YYYY-MM-DD"));
  };

  const onCategoryChange = (cat) => {
    setCategory(cat);
  };

  const onBrandChange = (br) => {
    setBrand(br);
  };

  const onBarcodeChange = (e) => {
    let br = e.target.value.toUpperCase();
    if (br) {
      setBarcode(br);
    } else {
      setProductSelectValue({ value: "", label: "Все" });
      setBarcode("");
    }
  };

  const onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) getProductByBarcode(barcode);
  };

  const onDiscountSumChange = (ds) => {
    setDiscountSum(ds);
  };

  const onProductChange = (selected) => {
    setProductSelectValue(selected);
    setAvgDiscountAmount(0);
    setAvgDiscount(0);
    if (!selected.code) {
      setBarcode("");
      return;
    }
    setBarcode(selected.code);
    searchProducts(selected.code);
  };

  const selectAllPoints = (ind, e) => {
    const isChecked = e.target.checked;

    let pl = productsList;

    pl[ind].checked = isChecked;

    pl[ind].info.forEach((product) => {
      product.checked = isChecked;
    });
    setProductsList([...pl]);
    let pl2 = [];
    productsList.forEach((point) => {
      point.info.forEach((product) => {
        if (product.checked) {
          const stock = { point: point.id, object: product.stockcurrentid };
          pl2.push(stock);
        }
      });
    });
    setProductList([...pl2]);
  };

  const handleCheckboxChange = (ind, index, e) => {
    const isChecked = e.target.checked;
    let pl = productsList;
    pl[ind].info[index].checked = isChecked;
    setProductsList([...pl]);
    let pl2 = [];
    productsList.forEach((point) => {
      point.info.forEach((product) => {
        if (product.checked) {
          const stock = { point: point.id, object: product.stockcurrentid };
          pl2.push(stock);
        }
      });
    });
    setProductList([...pl2]);
  };

  const handleDelete = (id) => {
    setLoading(true);
    Axios.post("/api/discount/del", { id })
      .then(() => {
        alert.success("Скидка успешно удалена", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        setLoading(false);
        getDiscountsInfo();
      })
      .catch((err) => {
        alert.error(
          err.response.data.code === "internal_error"
            ? "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже"
            : err.response.data.text,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          }
        );
        setLoading(false);
      });
  };

  const addDiscount = () => {
    if (
      productList.length === 0 &&
      productsList.length > 0 &&
      selectDiscount.value === 4
    ) {
      return alert.warning(
        "Выберите товары, на которые необходимо установить скидку",
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        }
      );
    }
    if (selectDiscount.value === 1 && salesPoint === "") {
      return alert.warning("Выберите торговую точку", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    if (selectDiscount.value === 2 && category === "") {
      return alert.warning("Выберите категорию", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    if (selectDiscount.value === 3 && brand === "") {
      return alert.warning("Выберите бренд", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    if (selectDiscount.value === 4 && productSelectValue === "") {
      return alert.warning("Выберите товар", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    if (
      (selectDiscount.value !== 4 &&
        (disc === 0 || disc === "0" || disc === "00")) ||
      (selectDiscount.value === 4 &&
        (avgDiscountAmount === 0 ||
          avgDiscountAmount === "0" ||
          avgDiscountAmount === "00"))
    ) {
      return alert.warning("Новая скидка не может быть равна 0", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else if (dateTo < Moment().format("YYYY-MM-DD")) {
      return alert.warning("Дата по указана не правильно", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else if (dateTo < dateFrom) {
      return alert.warning("Окончание скидки не может быть раньше начала", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    // object нужен для создания скидок на точку по выбранной категории или товару.c

    const object =
      selectDiscount.value === 0
        ? 0
        : selectDiscount.value === 1
          ? salesPoint.value
          : selectDiscount.value === 2
            ? category.value
            : selectDiscount.value === 3
              ? brand.value
              : 0;

    const point =
      selectDiscount.value === 0
        ? 0
        : selectDiscount.value === 1
          ? salesPoint.value
          : selectDiscount.value === 2
            ? salesPointWithAll.value
            : selectDiscount.value === 3
              ? salesPointWithAll.value
              : 0;

    const type = selectDiscount.value;
    const discount =
      selectDiscount.value !== 4
        ? {
          object: object,
          type: type,
          discountsum: discountsum.value,
          point: point,
          datefrom: dateFrom,
          dateto: dateTo,
          discount: disc,
          tag: tag,
          timefrom: timeFrom,
          timeto: timeTo
        }
        : {
          stock: productList,
          type: type,
          discountsum: discountsum.value,
          datefrom: dateFrom,
          dateto: dateTo,
          discount: avgDiscount,
          tag: tag,
          timefrom: timeFrom,
          timeto: timeTo
        };
    setLoading(true);
    selectDiscount.value !== 4
      ? Axios.post("/api/discount/add", { discount })
        .then(() => {
          setLoading(false);

          alert.success("Скидка успешно добавлена", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          getDiscountsInfo();
        })
        .catch((err) => {
          setLoading(false);
          alert.error(
            err.response.data.code === "internal_error"
              ? "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже"
              : err.response.data.text,
            {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            }
          );
        })
      : Axios.post("/api/discount/addprod", { discount })
        .then(() => {
          setLoading(false);
          setAvgPrice(0);
          setAvgDiscountAmount(0);
          setAvgDiscount(0);
          setBarcode("");
          alert.success("Скидка успешно добавлена", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          getDiscountsInfo();
        })
        .catch((err) => {
          setLoading(false);
          alert.error(
            err.response.data.code === "internal_error"
              ? "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже"
              : err.response.data.text,
            {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            }
          );
        });
  };

  const getDiscountsInfo = () => {
    onSelectChange({
      label: "Для всех торговых точек",
      value: 0,
    });
    let active = 1;
    setLoading(true);
    Axios.get("/api/discount", { params: { active } })
      .then((res) => res.data)
      .then((res) => {
        let dpoints = res.filter((disc) => disc.id === 1);
        let dcategories = res.filter((disc) => disc.id === 2);
        let dbrands = res.filter((disc) => disc.id === 3);
        let dproducts = res.filter((disc) => disc.id === 4);
        setDiscounts(res);
        setDiscountCategories(dcategories);
        setDiscountBrands(dbrands);
        setDiscountPoints(dpoints);
        setDiscountProducts(dproducts);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err);
      });
  };

  const inputChanged = (e) => {
    let d = isNaN(e.target.value) ? 0 : e.target.value;
    if (d > 100) return;
    setDisc(d);
  };

  const avgDiscountChanged = (e) => {
    let a = isNaN(e.target.value) ? 0 : e.target.value;
    if (a > 100) return;
    setAvgDiscount(a);
    setAvgDiscountAmount(parseInt((a * avgPrice) / 100, 0));
  };

  const avgDiscountAmountChanged = (e) => {
    let a = isNaN(e.target.value) ? 0 : e.target.value;
    if (a > avgPrice) return;

    const avgChanged = parseFloat((100 / avgPrice) * a).toLocaleString("ru", {
      maximumFractionDigits: 2,
    });
    var newstr = avgChanged.replace(/,/gi, ".");
    setAvgDiscount(newstr);
    setAvgDiscountAmount(a);
  };

  const searchProducts = (bc) => {
    if (!bc) {
      return alert.info("товары не найдены", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    setProductLoading(true);
    Axios.get("/api/stockcurrent/pointprod", {
      params: {
        barcode: bc,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        //нахождение минимальной цены по данному товару, для расчёта процента.
        let average = [];
        res.forEach((e) => {
          e.info.forEach((el) => {
            average.push(el.price);
          });
        });
        const uniq = [...new Set(average)];
        const min = Math.min(...uniq);
        setAvgPrice(min);
        setProductsList(res);
        setProductLoading(false);
      })
      .catch((err) => {
        setProductLoading(false);
        console.log(err);
      });
  };

  if (isLoading) {
    return <Searching />;
  }

  return (
    <div className="report-cashbox-state">
      <Alert severity="info">
        <AlertTitle>
          <strong>Внимание!</strong>
        </AlertTitle>
        В случае наличия у товара различных общих скидок (по категории/по
        бренду/по товару) все такие скидки будут суммироваться при продаже
        товара.
      </Alert>
      {!isLoading && isError && (
        <div className="row text-center">
          <div className="col-md-12 not-found-text">
            Произошла ошибка. Попробуйте позже.
          </div>
        </div>
      )}
      {!isLoading && !isError && discounts.length === 0 && (
        <div className="row text-center">
          <div className="col-md-12 not-found-text">
            Действующие скидки не найдены
          </div>
        </div>
      )}
      <div className="row mt-20">
        <div className="col-md-12">
          {!isLoading && !isError && !discountPoints[0].discount && (
            <div className="row text-center">
              <div className="col-md-12 not-found-text">
                Скидки по торговым точкам отсутствуют
              </div>
            </div>
          )}
          {!isLoading && !isError && discountPoints[0].discount && (
            <p className="text-center" style={{ color: "#bdbdbd" }}>
              Действующие скидки по торговым точкам:
            </p>
          )}
          {!isLoading && !isError && discountPoints[0].discount && (
            <TableContainer style={{ marginTop: "1rem" }} component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Категория</StyledTableCell>
                    <StyledTableCell align="center">Скидка</StyledTableCell>
                    <StyledTableCell
                      align="center"
                      data-tip="Суммируется со скидками по срокам годности"
                    >
                      Суммировать*
                      <ReactTooltip />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Дата начала
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Время начала
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Дата завершения
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Время завершения
                    </StyledTableCell>
                    <StyledTableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {discountPoints.map((disc, idx) => (
                    <StyledTableRow key={idx}>
                      <StyledTableCell align="center">
                        {disc.pointname}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {disc.discount} %
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {disc.discountsum ? "Да" : "Нет"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {Moment(disc.startdate).format("DD.MM.YYYY")}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {disc.fromtime}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {Moment(disc.expirationdate).format("DD.MM.YYYY")}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {disc.totime}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <button
                          className="btn btn-outline-danger cancel-disc"
                          onClick={() => handleDelete(disc.discountid)}
                        >
                          отменить скидку
                        </button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>

      <div className="row mt-20">
        <div className="col-md-12">
          {!isLoading && !isError && !discountCategories[0].discount && (
            <div className="row text-center">
              <div className="col-md-12 not-found-text">
                Скидки по категориям отсутствуют
              </div>
            </div>
          )}
          {!isLoading && !isError && discountCategories[0].discount && (
            <p className="text-center" style={{ color: "#bdbdbd" }}>
              Действующие скидки по категориям:
            </p>
          )}
          {!isLoading && !isError && discountCategories[0].discount && (
            <TableContainer style={{ marginTop: "1rem" }} component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Категория</StyledTableCell>
                    <StyledTableCell align="center">
                      Торговая точка
                    </StyledTableCell>
                    <StyledTableCell align="center">Скидка</StyledTableCell>
                    <StyledTableCell
                      align="center"
                      data-tip="Суммируется со скидками по срокам годности"
                    >
                      Суммировать*
                      <ReactTooltip />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Период действия
                    </StyledTableCell>
                    <StyledTableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {discountCategories.map((disc, idx) => (
                    <StyledTableRow key={idx}>
                      <StyledTableCell align="center">
                        {disc.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {disc.pointname}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {disc.discount} %
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {disc.discountsum ? "Да" : "Нет"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {Moment(disc.startdate).format("DD.MM.YYYY")} -{" "}
                        {Moment(disc.expirationdate).format("DD.MM.YYYY")}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <button
                          className="btn btn-outline-danger cancel-disc"
                          onClick={() => handleDelete(disc.discountid)}
                        >
                          отменить скидку
                        </button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>

      <div className="row mt-20">
        <div className="col-md-12">
          {!isLoading && !isError && !discountBrands[0].discount && (
            <div className="row text-center">
              <div className="col-md-12 not-found-text">
                Скидки по брендам отсутствуют
              </div>
            </div>
          )}
          {!isLoading && !isError && discountBrands[0].discount && (
            <p className="text-center" style={{ color: "#bdbdbd" }}>
              Действующие скидки по брендам:
            </p>
          )}

          {!isLoading && !isError && discountBrands[0].discount && (
            <TableContainer style={{ marginTop: "1rem" }} component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Бренд</StyledTableCell>
                    <StyledTableCell align="center">
                      Торговая точка
                    </StyledTableCell>
                    <StyledTableCell align="center">Скидка</StyledTableCell>
                    <StyledTableCell
                      align="center"
                      data-tip="Суммируется со скидками по срокам годности"
                    >
                      Суммировать*
                      <ReactTooltip />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Период действия
                    </StyledTableCell>
                    <StyledTableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {discountBrands.map((disc, idx) => (
                    <StyledTableRow key={idx}>
                      <StyledTableCell align="center">
                        {disc.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {disc.pointname}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {disc.discount} %
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {disc.discountsum ? "Да" : "Нет"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {Moment(disc.startdate).format("DD.MM.YYYY")} -{" "}
                        {Moment(disc.expirationdate).format("DD.MM.YYYY")}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <button
                          className="btn btn-outline-danger cancel-disc"
                          onClick={() => handleDelete(disc.discountid)}
                        >
                          отменить скидку
                        </button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>

      <div className="row mt-20">
        <div className="col-md-12">
          {!isLoading && !isError && !discountProducts[0].discount && (
            <div className="row text-center">
              <div className="col-md-12 not-found-text">
                Скидки по товарам отсутствуют
              </div>
            </div>
          )}
          {!isLoading && !isError && discountProducts[0].discount && (
            <p className="text-center">Действующие скидки по товарам:</p>
          )}

          {!isLoading && !isError && discountProducts[0].discount && (
            <TableContainer style={{ marginTop: "1rem" }} component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Товар</StyledTableCell>
                    <StyledTableCell align="center">
                      Торговая точка
                    </StyledTableCell>
                    <StyledTableCell align="center">Скидка</StyledTableCell>
                    <StyledTableCell align="center">
                      Суммировать*
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Период действия
                    </StyledTableCell>
                    <StyledTableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {discountProducts.map((disc, idx) => (
                    <StyledTableRow key={idx}>
                      <StyledTableCell align="center">
                        {disc.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {disc.pointname}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {disc.discount} %
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {disc.discountsum ? "Да" : "Нет"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {Moment(disc.startdate).format("DD.MM.YYYY")} -{" "}
                        {Moment(disc.expirationdate).format("DD.MM.YYYY")}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <button
                          className="btn btn-outline-danger cancel-disc"
                          onClick={() => handleDelete(disc.discountid)}
                        >
                          отменить скидку
                        </button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>

      <div className="col-md-12 create-discounts-container">
        <hr />

        <div className="row">
          <div className="col-md-4">
            <label>Применить новую скидку:</label>
            <Select
              name="selectDiscount"
              value={selectDiscount}
              onChange={onSelectChange}
              noOptionsMessage={() => "Выберите торговую точку из списка"}
              options={selectDiscounts}
              placeholder="Выберите торговую точку"
            />
          </div>
          {selectDiscount.value === 1 && (
            <div className="row col-md-8">
              <div className="col-md-5">
                <label>Торговая точка</label>
                <Select
                  name="salesPoint"
                  value={salesPoint}
                  onChange={onPointsChange}
                  noOptionsMessage={() => "Выберите торговую точку из списка"}
                  options={points}
                  placeholder="Выберите торговую точку"
                />
              </div>
            </div>
          )}
          {selectDiscount.value === 2 && (
            <div className="row col-md-8">
              <div className="col-md-5">
                <label>Категории</label>
                <Select
                  name="category"
                  value={category}
                  onChange={onCategoryChange}
                  options={categories}
                  placeholder="Выберите Категорию"
                  onInputChange={onCategoryListInput.bind(this)}
                  noOptionsMessage={() => "Категория не найдена"}
                />
              </div>
              <div className="col-md-7">
                <label>Торговая точка</label>
                <Select
                  name="salesPointWithAll"
                  value={salesPointWithAll}
                  onChange={onPointsAllChange}
                  noOptionsMessage={() => "Выберите торговую точку из списка"}
                  options={pointsWithAll}
                  placeholder="Выберите торговую точку"
                />
              </div>
            </div>
          )}
          {selectDiscount.value === 3 && (
            <div className="row col-md-8">
              <div className="col-md-5">
                <label>Бренды</label>
                <Select
                  name="brand"
                  value={brand}
                  onChange={onBrandChange}
                  options={brands}
                  placeholder="Выберите Бренд"
                  onInputChange={onBrandListInput.bind(this)}
                  noOptionsMessage={() => "Бренд не найден"}
                />
              </div>
              <div className="col-md-7">
                <label>Торговая точка</label>
                <Select
                  name="salesPointWithAll"
                  value={salesPointWithAll}
                  onChange={onPointsAllChange}
                  noOptionsMessage={() => "Выберите торговую точку из списка"}
                  options={pointsWithAll}
                  placeholder="Выберите торговую точку"
                />
              </div>
            </div>
          )}
          {selectDiscount.value === 4 && (
            <div className="row col-md-8">
              <div className="col-md-5">
                <label>Штрихкод</label>
                <input
                  name="barcode"
                  value={barcode}
                  placeholder="Введите или отсканируйте штрих код"
                  onChange={onBarcodeChange}
                  onKeyDown={onBarcodeKeyDown}
                  type="text"
                  className="form-control"
                />
                <p className="barcode">Нажмите "Enter" для поиска</p>
              </div>
              <div className="col-md-7">
                <label>Наименование Товара</label>
                <Select
                  name="product"
                  value={productSelectValue}
                  onChange={onProductChange}
                  options={products}
                  placeholder="Выберите товар"
                  onInputChange={onProductListInput.bind(this)}
                  noOptionsMessage={() => "Товар не найден"}
                />
              </div>
            </div>
          )}
        </div>

        {isProductLoading && (
          <div className="is-product-loading">
            <div className="icon" />
          </div>
        )}
        {!isLoading && !isProductLoading && productsList.length > 0 && (
          <Fragment>
            <div className="row">
              <div className="col-md-12 pt-30 products-list">
                {productsList.map((point, ind) => {
                  return (
                    <Fragment key={point.id}>
                      <div className="mt-10">
                        {point.name} ({point.address})
                      </div>
                      <table className="table table-hover ml-10 products-table">
                        <thead>
                          <tr>
                            <th style={{ width: "60%" }} className="mt-10">
                              Наименование товара
                            </th>
                            <th
                              style={{ width: "15%" }}
                              className="mt-10 text-center"
                            >
                              Остаток
                            </th>
                            <th
                              style={{ width: "15%" }}
                              className="mt-10 text-center"
                            >
                              Цена
                            </th>
                            {productsList.length > 1 && (
                              <th className="text-right">
                                <input
                                  className="checkbox-double"
                                  type="checkbox"
                                  title={"Выбрать все"}
                                  checked={
                                    point.checked ? point.checked : false
                                  }
                                  onChange={(e) => selectAllPoints(ind, e)}
                                />
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {point.info.map((product, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  {product.name +
                                    `${product.attributescaption
                                      ? " " + product.attributescaption
                                      : ""
                                    }`}
                                </td>
                                <td className="text-center">
                                  {product.amount}
                                </td>
                                <td className="text-center">
                                  {product.price} тг.
                                </td>
                                <td className="text-right">
                                  <input
                                    type="checkbox"
                                    className="checkbox-double"
                                    name={product.name + ind}
                                    checked={
                                      product.checked ? product.checked : false
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChange(ind, index, e)
                                    }
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </Fragment>
        )}
        <div className="row">
          {selectDiscount.value !== 4 && (
            <div className="col-md-1 discounts">
              <div>
                <label>Скидка</label>
                <input
                  name="bonusCategory"
                  value={disc}
                  className="form-control input-discount"
                  onChange={inputChanged}
                  type="text"
                />
              </div>
            </div>
          )}

          {selectDiscount.value === 4 && (
            <div className="row col-md-12 justify-content-center">
              <div className="col-md-1 discounts">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <label>%</label>
                  <input
                    name="avgDiscount"
                    value={avgDiscount}
                    className="form-control input-discount"
                    onChange={avgDiscountChanged}
                    type="text"
                  />
                </div>
              </div>
              <div className="col-md-2 discounts">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <label>Скидка</label>
                  <input
                    name="avgDiscountAmount"
                    value={avgDiscountAmount}
                    className="form-control"
                    onChange={avgDiscountAmountChanged}
                    type="text"
                  />
                  <p className="barcode">Макс:{avgPrice}</p>
                </div>
              </div>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "0.2rem",
                }}
              >
                тг.
              </p>
            </div>
          )}

          <div className={`col-md-${selectDiscount.value === 4 ? "4" : "3"}`}>
            <label>Дата с</label>
            <input
              type="date"
              value={dateFrom}
              className="form-control"
              name="dateFrom"
              onChange={dateFromChange}
            />
          </div>
          <div className="col-md-3">
            <label>Дата по</label>
            <input
              type="date"
              value={dateTo}
              className="form-control"
              name="dateTo"
              onChange={dateToChange}
            />
          </div>
          <div className="row col-md-12">
            <div className="col-md-2">
              <label>Учитывать время</label> <br />
              <GreenCheckbox
                checked={tag}
                onChange={tagChange}
              />&nbsp;
              {tag ? "Да" : "Нет"}

            </div>
            <div className="col-md-3">
              <label>Время с</label>
              <input
                disabled={!tag}
                type="time"
                className="form-control"
                value={timeFrom}
                onChange={(e) => setTimeFrom(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label>Время по</label>
              <input
                disabled={!tag}
                type="time"
                className="form-control"
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
              />
            </div>
          </div>
          <div className="row col-md-12">
            <div className="col-md-6">
              <label>В случае наличия у товара скидки по сроку годности:</label>
              <Select
                name="discountsum"
                value={discountsum}
                onChange={onDiscountSumChange}
                options={discountsums}
                placeholder="Выберите опцию"
              />
            </div>
            <div className="col-md-6 add-discount-button">
              <button
                className=" btn btn-block btn-outline-info"
                disabled={isLoading}
                onClick={addDiscount}
              >
                добавить
              </button>
            </div>
          </div>
        </div>
        <div className="row justify-content-center add-discount-button">
          <p className="discount-hints">
            Ориентировочно скидка начнёт действовать через 30 сек.
          </p>
        </div>
      </div>
      {!isLoading && <ShowInactive mode="discount" />}
    </div>
  );
}
