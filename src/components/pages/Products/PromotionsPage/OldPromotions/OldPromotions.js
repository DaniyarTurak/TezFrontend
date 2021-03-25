import React, { Component } from "react";

import { MuiThemeProvider } from "material-ui/styles";
import { blue500, blue700 } from "material-ui/styles/colors";
import getMuiTheme from "material-ui/styles/getMuiTheme";

import {
  Table,
  TableRow,
  TableHeader,
  TableHeaderColumn,
  TableRowColumn,
  TableBody
} from "material-ui/Table";

import { SortableElement, SortableContainer } from "react-sortable-hoc";

import Axios from "axios";
import Searching from "../../../../Searching";
import Alert from "react-s-alert";
import Moment from "moment";
//import ReactHTMLTableToExcel from "react-html-table-to-excel";

const theme = getMuiTheme({
  palette: {
    primary1Color: blue500,
    primary2Color: blue700
  }
});

// Универсальный компонент для превращения TableBody в sortable контейнер
const TableBodySortable = SortableContainer(
  ({ children, displayRowCheckbox }) => (
    <TableBody displayRowCheckbox={displayRowCheckbox}>
      {/* {console.log(children)} */}
      {children}
    </TableBody>
  )
);

// Строка необходима для того чтобы наш кастомный боди воспринимался как TableBody и в этом случае ошибки не будет
TableBodySortable.muiName = "TableBody";

// Компонент строки таблицы с оберткой в sortable элемент
const Row = SortableElement(({ data, index, promoDetails, ...other }) => {
  return (
    <TableRow {...other}>
      {other.children[0]}
      <TableRowColumn style={{ width: "20%" }}>
        {other.rowNumber + 1}
      </TableRowColumn>
      <TableRowColumn style={{ width: "40%" }}>{data.name}</TableRowColumn>

      <TableRowColumn style={{ width: "30%" }}>
        {Moment(data.bdate).format("DD-MM-YYYY")} -{" "}
        {Moment(data.edate).format("DD-MM-YYYY")}
      </TableRowColumn>
      <TableRowColumn style={{ width: "10%" }}>
        <button
          className="btn btn-w-icon detail-item"
          onClick={promoDetails}
        ></button>
      </TableRowColumn>
    </TableRow>
  );
});

export default class OldPromotions extends Component {
  state = {
    isLoading: true,
    isError: false,
    promotions: [],
    promotionsDetails: [],
    promoName: "",
    details: [],
    detailsIfAll: 0,
    detailsIfSet: [],
    detailsThenAll: 0,
    detailsThenCondition: []
  };

  componentDidMount() {
    this.getPromotions();
  }

  getPromotions = () => {
    Axios.get("/api/promotions", { params: { active: 0 } })
      .then(res => res.data)
      .then(promotions => {
        let promotionsDetails = promotions.map(value => {
          return value.points;
        });

        this.setState({
          promotions,
          promotionsDetails,
          isLoading: false,
          isError: false
        });
      })
      .catch(err => {
        this.setState({ isLoading: false, isError: true });
        console.log(err);
      });
  };

  promoDetails = (id, promo_name) => {
    this.setState({ promoName: promo_name });
    Axios.get("/api/promotions/details", {
      params: {
        id
      }
    })
      .then(res => res.data)
      .then(details => {
        if (details.length === 0) {
          Alert.info("Детали отсутствуют", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000
          });
        }
        const detailsIfCondition = details.if.id;
        const detailsThenCondition = details.then.id;

        let detailsIfSet = [];
        let detailsIfAll = "";
        let detailsThenSet = [];
        let detailsThenAll = "";

        if (detailsIfCondition === 2) {
          detailsIfAll = details.if.values[0].value;
        } else if (detailsIfCondition === 1) {
          detailsIfSet = details.if.values;
        }

        if (detailsThenCondition === 2) {
          detailsThenAll = details.then.values[0].value;
        } else if (detailsThenCondition === 1 || detailsThenCondition === 3) {
          detailsThenSet = details.then.values;
        }

        this.setState({
          details,
          detailsIfSet,
          detailsIfAll,
          detailsThenSet,
          detailsThenAll,
          detailsThenCondition,
          isLoading: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  backToList = () => {
    this.setState({ detailsIfAll: 0, detailsIfSet: [] });
  };

  render() {
    const {
      promotions,
      isLoading,
      isError,
      detailsIfSet,
      detailsIfAll,
      detailsThenSet,
      detailsThenAll,
      detailsThenCondition,
      promoName,
      promotionsDetails
    } = this.state;

    return (
      <div className="report-cashbox-state">
        {isLoading && <Searching />}

        {!isLoading && isError && (
          <div className="row text-center">
            <div className="col-md-12 not-found-text">
              Произошла ошибка. Попробуйте позже.
            </div>
          </div>
        )}

        {!isLoading && !isError && promotions.length === 0 && (
          <div className="row text-center">
            <div className="col-md-12 not-found-text">Акции не найдены</div>
          </div>
        )}

        {!isLoading &&
          !isError &&
          promotions.length > 0 &&
          !(detailsIfAll > 0 || detailsIfSet.length > 0) &&
          promotions.map((promo, idx) => {
            return (
              <div
                style={{
                  border: "solid #00000021 1px",
                  marginTop: "1rem",
                  borderRadius: "5px"
                }}
                className="col-md-12"
                key={idx}
              >
                {promo.pointname}
                <MuiThemeProvider muiTheme={theme}>
                  <Table>
                    <TableHeader
                      displaySelectAll={false}
                      adjustForCheckbox={false}
                    >
                      <TableRow>
                        <TableHeaderColumn style={{ width: "20%" }}>
                          Приоритет
                        </TableHeaderColumn>
                        <TableHeaderColumn style={{ width: "40%" }}>
                          Название акции
                        </TableHeaderColumn>
                        <TableHeaderColumn style={{ width: "30%" }}>
                          Срок действия
                        </TableHeaderColumn>
                        <TableHeaderColumn style={{ width: "10%" }}>
                          Детали
                        </TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBodySortable
                      onSortEnd={this.onSortEnd}
                      useDragHandle
                      displayRowCheckbox={false}
                    >
                      {promotionsDetails[idx].map((row, index) => {
                        return (
                          <Row
                            index={index}
                            key={index}
                            data={row}
                            collection={idx}
                            promoDetails={() =>
                              this.promoDetails(row.id, row.name)
                            }
                          />
                        );
                      })}
                    </TableBodySortable>
                  </Table>
                </MuiThemeProvider>
              </div>
            );
          })}
        {!isLoading && (detailsIfAll > 0 || detailsIfSet.length > 0) && (
          <div className="mt-20">
            <div className="col-md-8">
              <div>
                {detailsIfAll > 0 && (
                  <b className="btn-one-line">
                    Акция по разовому объёму продаж: {promoName}
                  </b>
                )}

                {detailsIfSet.length > 0 && (
                  <b className="btn-one-line">Акция За комплект: {promoName}</b>
                )}
              </div>
            </div>
            <div className="col-md-12 text-right">
              <button
                className="btn btn-secondary"
                onClick={() => this.backToList()}
              >
                Вернуться назад
              </button>
            </div>

            <div style={{ marginRight: "0px" }} className="row">
              <h4 className="col-md-12">Условие</h4>
              {detailsIfAll > 0 && (
                <div className="col-md-12">
                  Требуемая сумма: <p className="tenge">{detailsIfAll}</p>
                </div>
              )}
              {detailsIfSet.length > 0 && (
                <div className="col-md-12">
                  <table className="table table-hover" id="table-bonus-details">
                    <thead>
                      <tr>
                        <th style={{ width: "2%" }}></th>
                        <th className="text-center" style={{ width: "30%" }}>
                          Наименование товара
                        </th>
                        {(detailsThenCondition === 1 ||
                          detailsThenCondition === 3) && (
                          <th className="text-center" style={{ width: "15%" }}>
                            Количество
                          </th>
                        )}

                        {detailsThenCondition === 2 && (
                          <th className="text-center" style={{ width: "15%" }}>
                            Сумма
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {detailsIfSet.map((detail, idx) => (
                        <tr key={idx}>
                          <td style={{ width: "2%" }}>{idx + 1}</td>
                          <td className="text-center" style={{ width: "30%" }}>
                            {detail.name}
                          </td>
                          <td className="text-center" style={{ width: "15%" }}>
                            {detail.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <h4 className="col-md-12">Акционные товары</h4>
              {detailsThenAll > 0 && (
                <div className="col-md-12 tenge">
                  Скидка на общую сумму чека: {detailsThenAll}
                </div>
              )}
              <div className="col-md-12">
                <table className="table table-hover" id="table-bonus-details">
                  <thead>
                    {detailsThenSet.length > 0 && (
                      <tr>
                        <th style={{ width: "2%" }}></th>
                        <th className="text-center" style={{ width: "30%" }}>
                          Наименование товара
                        </th>

                        <th className="text-center" style={{ width: "15%" }}>
                          Скидка
                        </th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {detailsThenSet.length > 0 &&
                      detailsThenSet.map((detail, idx) => (
                        <tr key={idx}>
                          <td style={{ width: "2%" }}>{idx + 1}</td>

                          <td className="text-center" style={{ width: "30%" }}>
                            {detail.name}
                          </td>
                          <td className="text-center" style={{ width: "15%" }}>
                            {detail.value}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
