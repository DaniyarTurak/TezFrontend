import React, { Component, Fragment } from "react";
import Axios from "axios";

import ShowInactive from "../ClosedListPages/ShowInactive";

import AlertBox from "../../AlertBox";
import SweetAlert from "react-bootstrap-sweetalert";
import Alert from "react-s-alert";
import Searching from "../../Searching";
import Pagination from "react-js-pagination";

class BuyersListPage extends Component {
  state = {
    buyers: [],
    searchKey: "",
    isLoading: true,
    label: {
      list: "Список активных покупателей",
      add: "Добавить нового покупателя",
      empty: "Cписок покупателей пуст",
      name: "Наименование",
      bin: "БИН",
      address: "Адрес",
      title: {
        edit: "Редактировать",
        delete: "Удалить",
      },
    },
    alert: {
      confirmDelete: "Вы действительно хотите удалить покупателя?",
      successDelete: "Покупатель успешно удален",
      successEdit: "Изменения сохранены",
      raiseError:
        "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже",
      label: {
        ok: "Хорошо",
        sure: "Да, я уверен",
        cancel: "Нет, отменить",
        areyousure: "Вы уверены?",
        success: "Отлично",
        error: "Упс...Ошибка!",
      },
    },
    sweetalert: null,
    activePage: 1,
    itemsPerPage: 15,
    pageRangeDisplayed: 5,
    currentRange: { first: 0, last: 0 },
  };

  componentDidMount() {
    this.getBuyers();

    if (this.props.location.state && this.props.location.state.fromEdit) {
      Alert.success(this.state.alert.successEdit, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    this.setState({
      currentRange: {
        first:
          this.state.activePage * this.state.itemsPerPage -
          this.state.itemsPerPage,
        last: this.state.activePage * this.state.itemsPerPage - 1,
      },
    });
  }

  hideAlert = () => {
    this.setState({
      sweetalert: null,
    });
  };

  getBuyers = () => {
    Axios.get("/api/buyers")
      .then((res) => res.data)
      .then((buyers) => {
        this.setState({
          buyers,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handlePageChange(pageNumber) {
    this.setState({
      activePage: pageNumber,
      currentRange: {
        first: pageNumber * this.state.itemsPerPage - this.state.itemsPerPage,
        last: pageNumber * this.state.itemsPerPage - 1,
      },
    });
  }

  handleDelete = (item) => {
    this.setState({
      sweetalert: (
        <SweetAlert
          warning
          showCancel
          confirmBtnText={this.state.alert.label.sure}
          cancelBtnText={this.state.alert.label.cancel}
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="default"
          title={this.state.alert.label.areyousure}
          onConfirm={() => this.delete(item)}
          onCancel={() => this.hideAlert()}
        >
          {this.state.alert.confirmDelete}
        </SweetAlert>
      ),
    });
  };

  delete = (item) => {
    const newBuyersList = this.state.buyers.filter((BuyersList) => {
      return BuyersList !== item;
    });

    item.deleted = true;
    const req = { customers: item };

    Axios.post("/api/buyers/manage", req)
      .then(() => {
        this.setState({
          buyers: newBuyersList,
        });

        Alert.success(this.state.alert.successDelete, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
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
      });

    this.hideAlert();
  };

  handleEdit = (buyerData) => {
    this.props.history.push({
      pathname: "buyers/manage",
      state: { buyerData },
    });
  };

  handleRollback = (newBuyer) => {
    let list = this.state.buyers;
    list.push(newBuyer);

    this.setState({
      buyers: list,
    });
  };

  onSearchChange = (e) => {
    const searchKey = e.target.value;
    this.setState({ searchKey });
  };

  render() {
    const {
      buyers,
      isLoading,
      label,
      sweetalert,
      activePage,
      itemsPerPage,
      pageRangeDisplayed,
      currentRange,
      searchKey,
    } = this.state;

    let filteredBuyers =
      buyers.length > 0 &&
      buyers.filter((buyer) => {
        let bin = buyer.bin.toLowerCase().trim().replace(/ /g, "");
        let searchBin = searchKey.toLowerCase().trim().replace(/ /g, "");
        return bin.indexOf(searchBin) !== -1;
      });
    return (
      <div className="buyers-list">
        {sweetalert}

        <div className="row">
          <div className="col-md-6">
            <h6 className="btn-one-line">{label.list}</h6>
          </div>

          <div className="col-md-6 text-right">
            <button
              className="btn btn-link btn-sm"
              onClick={() => this.props.history.push("buyers/manage")}
            >
              {label.add}
            </button>
          </div>
        </div>

        {isLoading && <Searching />}

        {!isLoading && <div className="empty-space"></div>}

        {!isLoading && buyers.length === 0 && <AlertBox text={label.empty} />}

        {!isLoading && buyers.length > 0 && (
          <div className="row mt-10 pb-10">
            <div className="col-md-6">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <span className="ico-mglass"></span>
                  </span>
                </div>
                <input
                  name="search"
                  value={searchKey}
                  type="text"
                  placeholder="Введите БИН компании"
                  className="form-control"
                  onChange={this.onSearchChange}
                />
              </div>
            </div>
          </div>
        )}

        {!isLoading && filteredBuyers.length > 0 && (
          <Fragment>
            <Fragment>
              <div className="row">
                <div className="col-md-12">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th style={{ width: "1%" }}></th>
                        <th style={{ width: "10%" }}>{label.bin}</th>
                        <th style={{ width: "20%" }}>{label.name}</th>
                        <th style={{ width: "30%" }}>{label.address}</th>
                        <th style={{ width: "15%" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBuyers.map((buyer, idx) => (
                        <tr
                          className={`${
                            currentRange.first <= idx &&
                            idx <= currentRange.last
                              ? ""
                              : "d-none"
                          }`}
                          key={idx}
                        >
                          <td>{idx + 1}</td>
                          <td>{buyer.bin}</td>
                          <td>{buyer.name}</td>
                          <td>{buyer.address}</td>
                          <td className="text-right">
                            <button
                              className="btn btn-w-icon edit-item"
                              title={label.title.edit}
                              onClick={() => {
                                this.handleEdit(buyer);
                              }}
                            ></button>
                            {
                              <button
                                className="btn btn-w-icon delete-item"
                                title={label.title.delete}
                                onClick={() => {
                                  this.handleDelete(buyer);
                                }}
                              ></button>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Fragment>

            {filteredBuyers.length > itemsPerPage && (
              <div className="row">
                <div className="col-md-12 text-right">
                  <Pagination
                    hideDisabled
                    hideNavigation={
                      filteredBuyers.length / itemsPerPage < pageRangeDisplayed
                    }
                    hideFirstLastPages={
                      filteredBuyers.length / itemsPerPage < pageRangeDisplayed
                    }
                    activePage={activePage}
                    itemsCountPerPage={itemsPerPage}
                    totalItemsCount={filteredBuyers.length}
                    pageRangeDisplayed={pageRangeDisplayed}
                    innerClass="pagination justify-content-center"
                    itemClass="page-item"
                    linkClass="page-link"
                    onChange={this.handlePageChange.bind(this)}
                  />
                </div>
              </div>
            )}
          </Fragment>
        )}

        {!isLoading && (
          <ShowInactive callback={this.handleRollback} mode="buyers" />
        )}
      </div>
    );
  }
}

export default BuyersListPage;
