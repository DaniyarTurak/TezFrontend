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
  TableBody,
} from "material-ui/Table";

import {
  SortableContainer,
  SortableHandle,
  SortableElement,
} from "react-sortable-hoc";

import Modal from "react-modal";
import Axios from "axios";
import Searching from "../../../../Searching";
import Alert from "react-s-alert";
import Moment from "moment";
//import ReactHTMLTableToExcel from "react-html-table-to-excel";
import PromotionHelpDetails from "./PromotionHelpDetails";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-10%",
    transform: "translate(-30%, -50%)",
    maxWidth: "80%",
    maxHeight: "80vh",
    overlfow: "scroll",
    zIndex: 11,
  },
  overlay: { zIndex: 10 },
};

const theme = getMuiTheme({
  palette: {
    primary1Color: blue500,
    primary2Color: blue700,
  },
});

// Функции для перемещения.
const arrayMoveMutate = (array, from, to) => {
  const startIndex = to < 0 ? array.length + to : to;
  const item = array.splice(from, 1)[0];
  array.splice(startIndex, 0, item);
};

const arrayMove = (array, from, to) => {
  console.log(array, from, to);
  array = array.slice();
  arrayMoveMutate(array, from, to);
  return array;
};

// Компонент который используется активации drag-n-drop при клике внутри компонента
const DragHandle = SortableHandle(({ style }) => (
  <span
    style={{ ...style, ...{ cursor: "pointer" } }}
    className="btn btn-w-icon priority-item"
  ></span>
));

// Универсальный компонент для превращения TableBody в sortable контейнер
const TableBodySortable = SortableContainer(
  ({ children, displayRowCheckbox }) => (
    <TableBody displayRowCheckbox={displayRowCheckbox}>{children}</TableBody>
  )
);

// Строка необходима для того чтобы наш кастомный боди воспринимался как TableBody и в этом случае ошибки не будет
TableBodySortable.muiName = "TableBody";

// Компонент строки таблицы с оберткой в sortable элемент
const Row = SortableElement(
  ({ data, index, promoDetails, handleDelete, ...other }) => {
    const priorities = { priority: other.rowNumber, id: data.id };
    let priority = [];
    priority.push(priorities);

    return (
      <TableRow {...other}>
        {other.children[0]}
        <TableRowColumn style={{ width: "10%" }}>
          <DragHandle />
        </TableRowColumn>
        <TableRowColumn style={{ width: "10%" }}>
          {other.rowNumber + 1}
        </TableRowColumn>
        <TableRowColumn style={{ width: "30%" }}>{data.name}</TableRowColumn>

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
        <TableRowColumn style={{ width: "10%" }}>
          <button
            className="btn btn-w-icon delete-item"
            onClick={handleDelete}
          ></button>
        </TableRowColumn>
      </TableRow>
    );
  }
);

export default class CurrentPromotions extends Component {
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
    detailsThenCondition: [],
    disabledButtons: [],
    modalIsOpen: false,
  };

  componentDidMount() {
    this.getPromotions();
  }

  // Обработчик заверщения перемещения, используется  arrayMove
  onSortEnd = ({ oldIndex, newIndex, collection }) => {
    this.setState((oldState) => {
      const newDisabledButtons = [...oldState.disabledButtons];
      newDisabledButtons[collection] = false;
      return {
        disabledButtons: newDisabledButtons,
      };
    });
    console.log(oldIndex, newIndex, collection);
    this.setState(({ promotionsDetails }) => {
      const newPromotions = [...promotionsDetails];
      newPromotions[collection] = arrayMove(
        promotionsDetails[collection],
        oldIndex,
        newIndex
      );

      return {
        promotionsDetails: newPromotions,
      };
    });
  };

  getPromotions = () => {
    Axios.get("/api/promotions", { params: { active: 1 } })
      .then((res) => res.data)
      .then((promotions) => {
        let promotionsDetails = promotions.map((value) => {
          return value.points;
        });

        this.setState({
          promotions,
          disabledButtons: new Array(promotions.length).fill(true),
          promotionsDetails,
          isLoading: false,
          isError: false,
        });
      })

      .catch((err) => {
        this.setState({ isLoading: false, isError: true });
        console.log(err);
      });
  };

  handlePriority = (collection) => {
    const { promotionsDetails } = this.state;

    let priority = [];
    promotionsDetails[collection].forEach((value, idx) => {
      const p = { priority: idx + 1, id: value.id };
      priority.push(p);
    });

    // {"priority" : [{"priority" : 1, "id" : 1}]}
    Axios.post("/api/promotions/change_priority", { priority })
      .then(() => {
        Alert.success("Приоритеты успешно изменены.", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });

        this.setState((oldState) => {
          const newDisabledButtons = [...oldState.disabledButtons];
          newDisabledButtons[collection] = true;
          return {
            disabledButtons: newDisabledButtons,
          };
        });
        this.getPromotions();
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  handleDetails = () => {
    this.setState({
      modalIsOpen: true,
    });
  };

  closeDetail = () => {
    this.setState({ modalIsOpen: false });
  };

  handleDelete = (id) => {
    Axios.post("/api/promotions/del", { id })
      .then(() => {
        this.setState({ isLoading: false });
        Alert.success("Статус акции успешно изменен.", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        this.getPromotions();
      })
      .catch((err) => {
        console.log(err);
        Alert.error(
          `При изменении приоритетов произошла ошибка. Код ошибки: ${err}`,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          }
        );
        this.setState({ isLoading: false });
      });
  };

  promoDetails = (id, promo_name) => {
    this.setState({ promoName: promo_name });
    Axios.get("/api/promotions/details", {
      params: {
        id,
      },
    })
      .then((res) => res.data)
      .then((details) => {
        if (details.length === 0) {
          Alert.info("Детали отсутствуют", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
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
          isLoading: false,
        });
      })
      .catch((err) => {
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
      disabledButtons,
      modalIsOpen,
      promoName,
      promotionsDetails,
    } = this.state;

    return (
      <div className="report-cashbox-state">
        <Modal
          onRequestClose={() => {
            this.setState({ modalIsOpen: false });
          }}
          isOpen={modalIsOpen}
          style={customStyles}
        >
          <PromotionHelpDetails closeDetail={this.closeDetail} />
        </Modal>

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
          !(detailsIfAll > 0 || detailsIfSet.length > 0) && (
            <div className="row text-center">
              <div className="col-md-4 today-btn">
                <button
                  className="btn btn-block btn-outline-warning mt-30"
                  onClick={() => this.handleDetails()}
                >
                  Пояснения к отчёту
                </button>
              </div>
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
                  borderRadius: "5px",
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
                        <TableHeaderColumn style={{ width: "10%" }}>
                          &nbsp;
                        </TableHeaderColumn>
                        <TableHeaderColumn style={{ width: "10%" }}>
                          Приоритет
                        </TableHeaderColumn>
                        <TableHeaderColumn style={{ width: "30%" }}>
                          Название акции
                        </TableHeaderColumn>
                        <TableHeaderColumn style={{ width: "30%" }}>
                          Срок действия
                        </TableHeaderColumn>
                        <TableHeaderColumn style={{ width: "10%" }}>
                          Детали
                        </TableHeaderColumn>
                        <TableHeaderColumn style={{ width: "10%" }}>
                          Удалить
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
                            handleDelete={() => this.handleDelete(row.id)}
                          />
                        );
                      })}
                    </TableBodySortable>
                  </Table>
                </MuiThemeProvider>

                <button
                  style={{ marginBottom: "1rem" }}
                  className="btn btn-outline-info add-point col-md-4"
                  onClick={() => this.handlePriority(idx)}
                  disabled={disabledButtons[idx]}
                >
                  Изменить приоритет
                </button>
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
