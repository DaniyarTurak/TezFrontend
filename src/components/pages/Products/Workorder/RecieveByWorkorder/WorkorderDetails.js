import React, { useState, useEffect, Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import Axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Breadcrumb from "../../../../Breadcrumb";
import LinearProgress from "@material-ui/core/LinearProgress";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Modal from "react-modal";
import AttributeWindow from "./AttributeWindow";
import Alert from "react-s-alert";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 5,
    borderRadius: 2,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 2,
    backgroundColor: "#17a2b8",
  },
}))(LinearProgress);

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

export default function WorkorderDetails({
  onlyView,
  setOnlyView,
  setActivePage,
  workorderId,
  getWorkorders,
}) {
  // const getInfo = () => {
  //     Axios.get("/api/workorder/info", { params: { workorder_id: workorderId } })
  //         .then((res) => res.data)
  //         .then((info) => {
  //             setInfo(info[0])
  //         })
  //         .catch((err) => {
  //             console.log(err);
  //         });
  // };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      minHeight: "400px",
      maxWidth: "700px",
      maxHeight: "700px",
      overlfow: "scroll",
      zIndex: 11,
    },
    overlay: { zIndex: 10 },
  };

  const [isLoading, setLoading] = useState(false);
  const [workorderProducts, setWorkorderProducts] = useState([]);
  const [counterparties, setCounterparties] = useState([]);
  const [modalWindow, setModalWindow] = useState(null);

  useEffect(() => {
    getWorkorderProducts();
    getCounterparties();
  }, []);

  const getWorkorderProducts = () => {
    setLoading(true);
    Axios.get("/api/workorder/details", { params: { workorderId } })
      .then((res) => res.data)
      .then((list) => {
        setWorkorderProducts(list);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const getCounterparties = () => {
    Axios.get("/api/workorder/cpsinworkorder", { params: { workorderId } })
      .then((res) => res.data)
      .then((cps) => {
        setCounterparties(cps);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const showModal = (product) => {
    setModalWindow(
      <Modal isOpen={true} style={customStyles}>
        <AttributeWindow
          product={product}
          setModalWindow={setModalWindow}
          workorderId={workorderId}
        />
      </Modal>
    );
  };

  useEffect(() => {
    if (modalWindow === null) {
      getWorkorderProducts();
    }
  }, [modalWindow]);

  const recieveWorkorder = (counterparty) => {
    console.log(workorderId, counterparty);
    Axios.post("/api/workorder/invoice", {
      workorder_id: workorderId,
      counterparty,
    })
      .then((res) => res.data)
      .then((res) => {
        if (res.code === "success") {
          Alert.success("Товары успешно приняты на склад", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          getWorkorders();
          getCounterparties();
          getWorkorderProducts();
        } else {
          Alert.error(res.text, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        Alert.error(err, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      });
  };

  return (
    <Fragment>
      {modalWindow}
      <Grid container spacing={1}>
        <Grid item xs={10} style={{ paddingBottom: "0px" }}>
          <Breadcrumb
            content={[
              { caption: "Управление товарами" },
              { caption: "Прием товара по наряд-заказу" },
              { caption: "Список наряд-заказов" },
              {
                caption: onlyView
                  ? "Просмотр наряд-заказа"
                  : "Прием наряд-заказа",
                active: true,
              },
            ]}
          />
        </Grid>
        <Grid item xs={2} style={{ paddingBottom: "0px", textAlign: "right" }}>
          <button
            className="btn btn-link btn-sm"
            onClick={() => {
              setOnlyView(false);
              setActivePage(1);
            }}
          >
            Назад
          </button>
        </Grid>
        {isLoading && (
          <Grid item xs={12}>
            <BorderLinearProgress />
          </Grid>
        )}
        {workorderProducts.length === 0 && !isLoading && (
          <Grid item xs={12} style={{ textAlign: "center", color: "#6c757d" }}>
            В наряд-заказе пока нет товаров
          </Grid>
        )}

        {!isLoading && workorderProducts.length > 0 && (
          <Fragment>
            <Grid item xs={12}>
              <TableContainer
                component={Paper}
                style={{ boxShadow: "0px -1px 1px 1px white" }}
              >
                <Table id="table-to-xls">
                  <TableHead>
                    <TableRow style={{ fontWeight: "bold" }}>
                      <StyledTableCell align="center">
                        Штрих-код
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Наименование
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Партийные характеристики
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Количество
                      </StyledTableCell>
                      <StyledTableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {counterparties.map((cp, id) => (
                      <Fragment key={id}>
                        <TableRow>
                          <StyledTableCell colSpan={4} align="left">
                            Контрагент &emsp; <b>{cp.name}</b>
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {!cp.status && !onlyView ? (
                              <button
                                className="btn btn-success"
                                onClick={() =>
                                  recieveWorkorder(cp.counterparty)
                                }
                              >
                                Принять
                              </button>
                            ) : !onlyView ? (
                              "Товары приняты"
                            ) : (
                              ""
                            )}
                          </StyledTableCell>
                        </TableRow>
                        {workorderProducts.map((product, idx) => (
                          <Fragment key={idx}>
                            {product.counterparty === cp.counterparty && (
                              <TableRow key={idx}>
                                <StyledTableCell>
                                  {product.code}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {product.name}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {product.attr_json
                                    ? product.attr_json.map((attr, id) => (
                                        <Fragment key={id}>
                                          <span>
                                            {attr.name + ": " + attr.value}
                                          </span>
                                          <br />
                                        </Fragment>
                                      ))
                                    : "Нет партийных характеристик"}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {product.accepted_units === null
                                    ? product.units
                                    : product.accepted_units}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {!cp.status && !onlyView && (
                                    <button
                                      className="btn btn-link btn-sm"
                                      onClick={() => showModal(product)}
                                    >
                                      {product.attributes === "0"
                                        ? "Добавить атрибуты"
                                        : "Изменить атрибуты"}
                                    </button>
                                  )}
                                </StyledTableCell>
                              </TableRow>
                            )}
                          </Fragment>
                        ))}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            {/* {workorderProducts.length !== 0 &&
                            <Grid item xs={6} style={{ textAlign: 'left' }}>
                                <ReactHTMLTableToExcel
                                    className="btn btn-sm btn-outline-success"
                                    table="table-to-xls"
                                    filename={`Заказа-наряд`}
                                    sheet="tablexls"
                                    buttonText="Выгрузить в Excel"
                                />
                            </Grid>} */}
          </Fragment>
        )}
      </Grid>
    </Fragment>
  );
}
