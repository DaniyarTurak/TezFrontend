import React, { Component } from "react";
import Axios from "axios";

import ShowInactive from "../ClosedListPages/ShowInactive";

import AlertBox from "../../AlertBox";
import SweetAlert from "react-bootstrap-sweetalert";
import Alert from "react-s-alert";
import Searching from "../../Searching";

class BrandList extends Component {
  state = {
    brands: [],
    isLoading: true,
    label: {
      list: "Список активных брендов",
      add: "Добавить новый бренд",
      empty: "Cписок брендов пуст",
      name: "Наименование",
      company: "Компания",
      title: {
        edit: "Редактировать",
        delete: "Удалить",
        detail: "Детали",
      },
    },
    alert: {
      confirmDelete: "Вы действительно хотите удалить бренд?",
      successDelete: "Бренд успешно удален",
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
  };

  componentDidMount() {
    this.getBrands();

    if (this.props.location.state && this.props.location.state.fromEdit) {
      Alert.success(this.state.alert.successEdit, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
  }

  hideAlert = () => {
    this.setState({
      sweetalert: null,
    });
  };

  getBrands = () => {
    Axios.get("/api/brand", { params: { deleted: false } })
      .then((res) => res.data)
      .then((brands) => {
        this.setState({
          brands,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
    const newBrandsList = this.state.brands.filter((brandsList) => {
      return brandsList !== item;
    });

    item.deleted = true;
    const req = { brand: [item]};

    Axios.post("/api/brand/manage", req)
      .then(() => {
        this.setState({
          brands: newBrandsList,
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

  handleEdit = (brandData) => {
    this.props.history.push({
      pathname: "brand/manage",
      state: { brandData },
    });
  };

  handleRollback = (newBrand) => {
    let list = this.state.brands;
    list.push(newBrand);

    this.setState({
      brands: list,
    });
  };

  render() {
    const { brands, isLoading, label, sweetalert } = this.state;
    return (
      <div className="brand-list">
        {sweetalert}

        <div className="row">
          <div className="col-md-6">
            <h6 className="btn-one-line">{label.list}</h6>
          </div>

          <div className="col-md-6 text-right">
            <button
              className="btn btn-link btn-sm"
              onClick={() => this.props.history.push("brand/manage")}
            >
              {label.add}
            </button>
          </div>
        </div>

        {isLoading && <Searching />}

        {!isLoading && <div className="empty-space" />}

        {!isLoading && brands.length === 0 && <AlertBox text={label.empty} />}

        {!isLoading && brands.length > 0 && (
          <div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{ width: "1%" }} />
                  <th style={{ width: "39%" }}>{label.name}</th>
                  <th style={{ width: "39%" }}>{label.company}</th>
                  <th style={{ width: "15%" }} />
                </tr>
              </thead>
              <tbody>
                {brands.map((brand, idx) => (
                  <tr key={brand.id}>
                    <td>{idx + 1}</td>
                    <td>{brand.brand}</td>
                    <td>{brand.manufacturer}</td>
                    <td className="text-right">
                      <button
                        className="btn btn-w-icon edit-item"
                        title={label.title.edit}
                        onClick={() => {
                          this.handleEdit(brand);
                        }}
                      />
                      <button
                        className="btn btn-w-icon delete-item"
                        title={label.title.delete}
                        onClick={() => {
                          this.handleDelete(brand);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && (
          <ShowInactive callback={this.handleRollback} mode="brand" />
        )}
      </div>
    );
  }
}

export default BrandList;
