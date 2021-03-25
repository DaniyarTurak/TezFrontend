import React, { Component } from "react";
import Axios from "axios";

import ShowInactive from "../ClosedListPages/ShowInactive";

import AlertBox from "../../AlertBox";
import SweetAlert from "react-bootstrap-sweetalert";
import Alert from "react-s-alert";
import Searching from "../../Searching";

class UpdateAttributePage extends Component {
  state = {
    attributes: [],
    isLoading: true,
    label: {
      list: "Список активных атрибутов",
      add: "Добавить новый атрибут",
      empty: "Cписок атрибутов пуст",
      name: "Наименование",
      attributeType: "Тип",
      title: {
        edit: "Редактировать",
        delete: "Удалить",
        detail: "Детали",
      },
    },
    alert: {
      confirmDelete: "Вы действительно хотите удалить атрибут?",
      successDelete: "Атрибут успешно удален",
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
    this.getAttributes();

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

  getAttributes = () => {
    Axios.get("/api/attributes", { params: { deleted: false } })
      .then((res) => res.data)
      .then((attributes) => {
        this.setState({
          attributes,
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
    const newAttributesList = this.state.attributes.filter((attributesList) => {
      return attributesList !== item;
    });

    item.deleted = true;
    const attributenames = {
      attributes: {
        id: item.id,
        name: item.values,
        deleted: item.deleted,
        format: item.format,
      },
    };

    Axios.post("/api/adminpage/updateattributeslist", attributenames)
      .then(() => {
        this.setState({
          attributes: newAttributesList,
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

  handleEdit = (attributeData) => {
    this.props.history.push({
      pathname: "updateattribute/manage",
      state: { attributeData },
    });
  };

  handleRollback = (newAttribute) => {
    let list = this.state.attributes;
    list.push(newAttribute);

    this.setState({
      attributes: list,
    });
  };

  render() {
    const { attributes, isLoading, label, sweetalert } = this.state;
    return (
      <div className="attribute-list">
        {sweetalert}

        <div className="row">
          <div className="col-md-6">
            <h6 className="btn-one-line">{label.list}</h6>
          </div>

          <div className="col-md-6 text-right">
            <button
              className="btn btn-link btn-sm"
              onClick={() => this.props.history.push("updateattribute/manage")}
            >
              {label.add}
            </button>
          </div>
        </div>

        {isLoading && <Searching />}

        {!isLoading && <div className="empty-space" />}

        {!isLoading && attributes.length === 0 && (
          <AlertBox text={label.empty} />
        )}

        {!isLoading && attributes.length > 0 && (
          <div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{ width: "1%" }} />
                  <th style={{ width: "39%" }}>{label.name}</th>
                  <th style={{ width: "39%" }}>{label.attributeType}</th>
                  <th style={{ width: "15%" }} />
                </tr>
              </thead>
              <tbody>
                {attributes.map((attribute, idx) => (
                  <tr key={attribute.id}>
                    <td>{idx + 1}</td>
                    <td>{attribute.values}</td>
                    <td>{attribute.format}</td>
                    <td className="text-right">
                      <button
                        className="btn btn-w-icon edit-item"
                        title={label.title.edit}
                        onClick={() => {
                          this.handleEdit(attribute);
                        }}
                      />
                      <button
                        className="btn btn-w-icon delete-item"
                        title={label.title.delete}
                        onClick={() => {
                          this.handleDelete(attribute);
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
          <ShowInactive callback={this.handleRollback} mode="attributeupdate" />
        )}
      </div>
    );
  }
}

export default UpdateAttributePage;
