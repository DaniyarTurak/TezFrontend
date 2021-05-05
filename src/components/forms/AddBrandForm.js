import React, { useState, useEffect, Fragment } from "react";
import { Field, reduxForm, initialize } from "redux-form";
import { InputField } from "../fields";
import { RequiredField } from "../../validation";
import Alert from "react-s-alert";
import Axios from "axios";
import { Progress } from "reactstrap";
import { utils, read } from "xlsx";
import ErrorAlert from "../ReusableComponents/ErrorAlert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton";
import InputBase from '@material-ui/core/InputBase';
import SaveIcon from '@material-ui/icons/Save';
import TablePagination from "@material-ui/core/TablePagination";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import PropTypes from "prop-types";
const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

//вся эта функция TablePaginationActions используется исключительно для того чтобы иметь возможность
//перепригивать между последней и первой страницей в пагинации. Ridiculous.
function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
};

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const BrandInput = withStyles((theme) => ({
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    width: '150px',
    padding: '5px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: "#17a2b8",
    },
  },
}))(InputBase);

const ManufacturerInput = withStyles((theme) => ({
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    width: '150px',
    padding: '5px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: "#17a2b8",
    },
  },
}))(InputBase);

let AddBrandForm = ({
  location,
  dispatch,
  history,
  handleSubmit,
  pristine,
  reset,
  submitting,
}) => {
  const brandData = location.state ? location.state.brandData : null;
  const [loaded, setLoaded] = useState(0);
  const [selectedFile, setSelectedFile] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isChanging, setChanging] = useState(false);
  const [brand, setBrand] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [isSending, setSending] = useState(false);

  useEffect(() => {
    if (brandData) {
      const brandDataChanged = brandData;
      dispatch(initialize("addbrandform", brandDataChanged));
    }
  }, []);

  const handleSelectedFile = (event) => {
    setSelectedFile(event.target.files[0]);
    setLoaded(0);
  };

  const handleFetchFromExcel = () => {
    if (!selectedFile) {
      return Alert.info("Выберите файл", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    };
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const prods = utils.sheet_to_json(
        ws,
        { raw: true },
        { skipUndfendVale: false, defaultValue: null }
      );
      let arr = [];
      if (!prods[0].Brand || !prods[0].Manufacturer) {
        ErrorAlert("Ошибка в документе. Проверьте правильность заполнения документа")
      }
      else {
        prods.forEach(element => {
          arr.push({
            brand: element.Brand,
            manufacturer: element.Manufacturer,
            changed: false,
            deleted: false,
            brandChanging: false,
            manufacturerChanging: false
          })
        });
        setBrands(arr);
      }
    }
    reader.readAsBinaryString(selectedFile);
    setLoading(false)
  };

  const StyledTableCell = withStyles((theme) => ({
    head: {
      background: "#17a2b8",
      color: theme.palette.common.white,
      fontSize: ".875rem",
    },
    body: {
      fontSize: ".875rem",
    },
    footer: {
      fontSize: ".875rem",
      fontWeight: "bold",
    },
  }))(TableCell);

  const deleteBrand = (idx) => {
    let array = brands;
    let arr = [];
    array.forEach((element, i) => {
      if (i !== idx) {
        arr.push(element);
      }
    });
    setBrands(arr);
    brandChanging();
  };

  const saveBrands = (id) => {
    setSending(true);
    let reqdata;
    if (id.id === 1) {
      reqdata = { brand: [{ brand: brand, manufacturer: manufacturer, deleted: false }] };
    }
    if (id.id === 2) {
      let brnds = [];
      brands.forEach((brnd, i) => {
        brnds.push({ brand: brnd.brand, manufacturer: brnd.manufacturer, deleted: false });
      });
      reqdata = { brand: brnds };
    }
    Axios.post("/api/brand/manage", reqdata)
      .then((result) => {
        Alert.success("Бренд успешно создан", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        dispatch(reset("addbrandform"));
        setSending(false);
        history.push({
          pathname: "../brand",
        })
      })
      .catch((err) => {
        Alert.error(
          err.response.data.code === "internal_error"
            ? "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже"
            : err.response.data.text,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          }
        );
        setSending(false);
      });
  };

  const editBrand = (idx, state) => {
    setBrands(prevState => {
      let obj = prevState[idx];
      obj.changed = !state;
      obj.brandChanging = true;
      return [...prevState];
    })
    brandChanging();
  };

  const brandChange = (value, idx) => {
    setBrands(prevState => {
      let obj = prevState[idx];
      obj.brandChanging = true;
      obj.manufacturerChanging = false;
      obj.brand = value;
      return [...prevState];
    })
  };

  const manufacturerChange = (value, idx) => {
    setBrands(prevState => {
      let obj = prevState[idx];
      obj.brandChanging = false;
      obj.manufacturerChanging = true;
      obj.manufacturer = value;
      return [...prevState];
    })

  };

  const brandChanging = () => {
    setChanging(false);
    for (let i of brands) {
      if (i.changed === true) {
        setChanging(true);
        break;
      }
      else {
        setChanging(false);
      }
    };
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDownload = (file) => {
    setLoading(true);
    Axios.get("/api/files/download", { responseType: "blob", params: { file } })
      .then((res) => res.data)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file);
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      });
  };

  return (
    <div id="addBrand">
      <div className="row">
        <div className="col-md-8">
          <h6 className="btn-one-line">
            {!brandData
              ? "Добавить новый бренд"
              : "Редактировать информацию о бренде"}{" "}
          </h6>
        </div>
        <div className="col-md-4 text-right">
          <button
            className="btn btn-link btn-sm"
            onClick={() => history.push("../brand")}
          >
            Список брендов
          </button>
        </div>
        <div
          className="col-md-9"
          style={{ display: "flex", justifyContent: "right" }}
        ></div>
        <div
          className="col-md-3"
        >
          <button
            style={{
              marginBottom: "5px",
            }}
            className="btn btn-info form-control"
            onClick={() => handleDownload("template_brands.xlsx")}
          >
            Скачать шаблон
          </button>
        </div>
        <div className="col-md-12 text-center">
          <div className="form-group files download-files">
            <input
              style={{ color: "#2ea591" }}
              type="file"
              className="form-control"
              name="file"
              onChange={handleSelectedFile}
            />
          </div>
          {isLoading && loaded !== 0 &&
            <div className="form-group">
              <Progress max="100" color="success" value={loaded}>
                {Math.round(loaded, 2)}%
            </Progress>
            </div>
          }
          <button
            className="btn btn-info form-control"
            onClick={handleFetchFromExcel}
          >
            Выгрузить
      </button>
          {brands.length > 0 &&
            <Fragment>
              <TableContainer
                component={Paper}
                style={{ boxShadow: "0px -1px 1px 1px white", paddingTop: "20px", paddingBottom: "20px" }}
              >
                <Table id="table-to-xls">
                  <TableHead>
                    <TableRow style={{ fontWeight: "bold" }} >
                      <StyledTableCell>
                      </StyledTableCell>
                      <StyledTableCell>
                        Наименование
                    </StyledTableCell>
                      <StyledTableCell>
                        Компания
                    </StyledTableCell>
                      <StyledTableCell>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {brands
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((brand, idx) => (
                        <TableRow key={idx}>
                          <StyledTableCell>{idx + 1}</StyledTableCell>
                          <StyledTableCell>
                            {brand.changed === true ?
                              <BrandInput
                                autoFocus={brand.brandChanging}
                                variant="outlined"
                                value={brand.brand}
                                onChange={(e) => brandChange(e.target.value, idx)}
                              /> : brand.brand
                            }
                          </StyledTableCell>
                          <StyledTableCell>
                            {brand.changed === true ?
                              <ManufacturerInput
                                autoFocus={brand.manufacturerChanging}
                                variant="outlined"
                                value={brand.manufacturer}
                                onChange={(e) => manufacturerChange(e.target.value, idx)}
                              /> : brand.manufacturer
                            }
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <IconButton
                              onClick={() => {
                                editBrand(idx, brand.changed);
                              }}
                            > {brand.changed === true ?
                              <SaveIcon
                                fontSize="small"
                                title="Сохранить"
                              />
                              :
                              <EditIcon
                                fontSize="small"
                                title="Изменить цену"
                              />
                              }
                            </IconButton>
                            <IconButton
                              disabled={brand.changed}
                              onClick={() => { deleteBrand(idx); }}
                            >
                              <DeleteIcon
                                fontSize="small"
                                title="Удалить"
                              />
                            </IconButton>
                          </StyledTableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {!isChanging ?
                <TablePagination
                  rowsPerPageOptions={[10, 20, 50]}
                  component="div"
                  count={brands.length}
                  backIconButtonText="Предыдущая страница"
                  labelRowsPerPage="Строк в странице"
                  nextIconButtonText="Следующая страница"
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                /> : ""}
              <button
                className="btn btn-info form-control"
                onClick={() => saveBrands({ id: 2 })}
                disabled={isSending}
              >
                Сохранить
                </button>
            </Fragment>
          }
        </div>
      </div>
      <div className="empty-space" />
      {brands.length === 0 &&
        < Fragment >
          <dl>
            <dt>Наименование бренда</dt>
            <dd>
              <Field
                value={brand}
                onChange={(e) => { setBrand(e.target.value) }}
                name="brand"
                component={InputField}
                type="text"
                className="form-control"
                placeholder="Введите наименование бренда"
                validate={[RequiredField]}
              />
            </dd>
            <dt>Компания</dt>
            <dd>
              <Field
                value={manufacturer}
                onChange={(e) => { setManufacturer(e.target.value) }}
                name="manufacturer"
                component={InputField}
                type="text"
                className="form-control"
                placeholder="Введите компанию бренда"
                validate={[RequiredField]}
              />
            </dd>
          </dl>
          <button
            onClick={() => saveBrands({ id: 1 })}
            className="btn btn-success"
            disabled={isSending || pristine || submitting}
          >
            {isSending
              ? "Пожалуйста подождите..."
              : !brandData
                ? "Добавить"
                : "Сохранить изменения"}
          </button>
          {!brandData && (
            <button
              type="button"
              className="btn btn-secondary ml-10"
              disabled={isSending || pristine || submitting}
              onClick={reset}
            >
              Очистить
            </button>
          )}
        </Fragment>
      }
    </div>
  );
};

export default AddBrandForm = reduxForm({
  form: "addbrandform",
})(AddBrandForm);
