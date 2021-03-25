import React, { Component } from "react";
import Axios from "axios";

import AlertBox from "../AlertBox";
import Alert from "react-s-alert";
import Searching from "../Searching";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";

class AttrSprPage extends Component {
  state = {
    spr: [],
    attributes: [],
    sprDeleted: [],
    caption: "",
    isHidden: true,
    sprNotDeleted: [],
    isEdit: true,
    addNewValue: "",
    expandedSpr: [],
    attributeTypes: [],
    isSubmiting: false,
    isUpdating: false,
    noAttributes: false,
    label: {
      list: "Корректировка атрибутов",
      add: "Добавить новое значение",
      pickAttribute: "Выберите атрибут",
      empty: "Cписок атрибутов пуст",
      name: "Наименование атрибута",
      nameAdd: "Добавить новый атрибут",
      deletedName: "Удаленные атрибуты",
      company: "Значения",
      title: {
        edit: "Изменить",
        delete: "Удалить",
        detail: "Детали",
        add: "Добавить",
        rollback: "Вернуть в список",
      },
    },
    alert: {
      confirmDelete: "Вы действительно хотите удалить это значение?",
      success: "Успешно",
      successDelete: "Атрибут успешно удален",
      successEdit: "Изменения сохранены",
      raiseEditError: "Вы пытаетесь добавить пустое значение",
      raiseError:
        "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже",
      label: {
        ok: "Хорошо",
        buttonLabel: "Создать атрибут",
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
    let caption = "";
    caption = "Показать список неактивных атрибутов";
    this.setState({
      caption: caption,
    });
    this.getAttributes();
  }

  hideAlert = () => {
    this.setState({
      sweetalert: null,
    });
  };

  handleEdit = (attribute) => {
    this.sendInfoOnEdit(attribute);
  };

  handleAddNew = (attribute) => {
    const { addNewValue, alert } = this.state;
    if (addNewValue === "") {
      Alert.error(alert.raiseEditError, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }
    this.sendInfo(attribute, addNewValue, false);
    this.setState({
      addNewValue: "",
    });
  };

  handleDelete = (attribute, sprNotDeleted) => {
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
          onConfirm={() =>
            this.sendInfo(
              attribute,
              sprNotDeleted.value,
              true,
              sprNotDeleted.id
            )
          }
          onCancel={() => this.hideAlert()}
        >
          {this.state.alert.confirmDelete}
        </SweetAlert>
      ),
    });
  };

  handleRollback = (attribute, sprDeleted) => {
    this.sendInfo(attribute, sprDeleted.value, false, sprDeleted.id);
  };

  sendInfoOnEdit = (attrID) => {
    const { sprNotDeleted, alert } = this.state;
    const attributespr = sprNotDeleted.map((pointsList) => {
      return {
        attribute: attrID,
        value: pointsList.value,
        rowid: pointsList.id,
        deleted: pointsList.deleted,
      };
    });

    Axios.post("/api/attributes/updatespr", { attributespr })
      .then(() => {
        this.setState({
          sprNotDeleted: attributespr,
          isEdit: true,
          sweetalert: null,
        });
        this.getAttributeTypes(attrID);
        Alert.success(this.state.alert.success, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        const alertText = err.response
          ? err.response.data
            ? err.response.data.text
              ? err.response.data.text
              : alert.raiseError
            : alert.raiseError
          : alert.raiseError;
        Alert.error(alertText, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      });
  };

  sendInfo = (attrID, value, deleted, id) => {
    const { sprNotDeleted } = this.state;
    const newAttrsList = sprNotDeleted.filter((pointsList) => {
      return pointsList !== (value, id, deleted);
    });

    const attributespr = [
      {
        attribute: attrID,
        value: value,
        rowid: id,
        deleted: deleted,
      },
    ];
    Axios.post("/api/attributes/updatespr", { attributespr })
      .then(() => {
        this.setState({
          sprNotDeleted: newAttrsList,
          isEdit: true,
          sweetalert: null,
        });
        this.getAttributeTypes(attrID);
        Alert.success(this.state.alert.success, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        const alertText = err.response
          ? err.response.data
            ? err.response.data.text
              ? err.response.data.text
              : this.state.alert.raiseError
            : this.state.alert.raiseError
          : this.state.alert.raiseError;
        Alert.error(alertText, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      });
  };

  handleHide = () => {
    let captionType = !this.state.isHidden ? "Показать" : "Скрыть",
      caption = captionType + " список неактивных атрибутов";

    this.setState({
      isHidden: !this.state.isHidden,
      caption,
    });
  };

  AttributeValidation = (e) => {
    const { value } = e.target;
    if (value === "" || value === null) {
      this.setState({ isEdit: true });
    }
  };

  inputChanged = (index, e) => {
    const { sprNotDeleted } = this.state;
    sprNotDeleted.forEach((point) => {
      point.value = point.id === index ? e.target.value : point.value;
    });
    this.setState({ sprNotDeleted, isEdit: false, isUpdating: true });
  };

  inputChangedNew = (index, e) => {
    this.setState({
      addNewValue: e.target.value,
      isEdit: false,
      isUpdating: true,
    });
  };

  getAttributes = () => {
    Axios.get("/api/attributes/getspr")
      .then((res) => res.data)
      .then((attributes) => {
        const attr = attributes.map((point) => {
          return {
            value: point.id,
            label: point.values,
          };
        });
        this.setState({
          attributes: attr,
          isUpdating: false,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false,
        });
      });
  };

  getAttributeTypes = (sprid) => {
    Axios.get("/api/attributes/getsprattr", { params: { sprid } })
      .then((res) => res.data)
      .then((attributeTypes) => {
        if (attributeTypes === "") {
          this.setState({
            noAttributes: true,
          });
        }
        let sprDeleted = [];
        let sprNotDeleted = [];
        attributeTypes.forEach((sp) => {
          if (sp.deleted === true) {
            sprDeleted.push({
              value: sp.value,
              id: sp.id,
              deleted: sp.deleted,
            });
          } else
            sprNotDeleted.push({
              value: sp.value,
              id: sp.id,
              deleted: sp.deleted,
            });

          const attrtype = attributeTypes.map((point) => {
            return { id: point.id, label: point.value };
          });
          this.setState({
            isUpdating: false,
            sprDeleted,
            sprNotDeleted,
            attributeTypes: attrtype,
            isLoading: false,
          });
        });
        this.setState({
          isUpdating: false,
          sprDeleted,
          sprNotDeleted,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false,
        });
      });
  };

  onAttributeChange = (attribute) => {
    this.setState({
      attribute,
    });
    if (attribute.value) {
      this.setState({ isLoading: true });
    }
    this.getAttributeTypes(attribute.value);
  };

  render() {
    const {
      sprDeleted,
      sprNotDeleted,
      isLoading,
      label,
      isHidden,
      caption,
      sweetalert,
      isEdit,
      attributeSelectValue,
      addNewValue,
      attributes,
    } = this.state;
    return (
      <div className="brand-list">
        {sweetalert}
        <div className="row">
          <div className="col-md-12">
            <h6 className="btn-one-line">{label.list}</h6>
          </div>
        </div>
        <div className="col-md-3 point-block pb-2">
          <Select
            name="attribute"
            value={attributeSelectValue}
            onChange={this.onAttributeChange}
            options={attributes}
            placeholder="Выберите Атрибут"
            noOptionsMessage={() => "Атрибут не найден"}
          />
        </div>

        {isLoading && <Searching />}
        {!isLoading && <div className="empty-space" />}

        {!isLoading &&
          !attributeSelectValue &&
          sprNotDeleted.length === 0 &&
          sprDeleted.length === 0 && <AlertBox text={label.pickAttribute} />}

        {!isLoading &&
          attributeSelectValue &&
          sprNotDeleted.length === 0 &&
          sprDeleted.length === 0 && <AlertBox text={label.empty} />}

        {!isLoading && sprNotDeleted.length > 0 && (
          <div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{ width: "2%" }} />
                  <th style={{ width: "40%" }}>{label.name}</th>
                  <th style={{ width: "15%" }} />
                  <th style={{ width: "43%" }} />
                </tr>
              </thead>
              <tbody>
                {sprNotDeleted.map((sprNotDeleted, idx) => (
                  <tr key={sprNotDeleted.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <input
                        type="email"
                        className="form-control"
                        value={sprNotDeleted.value}
                        onKeyDown={this.AttributeValidation}
                        onChange={this.inputChanged.bind(
                          this,
                          sprNotDeleted.id
                        )}
                      />
                    </td>
                    <td />
                    <td />
                    <td className="text-bottom">
                      <button
                        className="btn btn-w-icon delete-item"
                        title={label.title.delete}
                        // disabled={isEdit}
                        onClick={() => {
                          this.handleDelete(
                            this.state.attribute.value,
                            sprNotDeleted
                          );
                        }}
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td />
                  <td>
                    <button
                      className="btn btn-success ml-10"
                      title={label.title.edit}
                      disabled={isEdit}
                      onClick={() => {
                        this.handleEdit(this.state.attribute.value);
                      }}
                    >
                      сохранить изменения
                    </button>
                  </td>
                  <td />
                  <td />
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {!isLoading &&
          sprNotDeleted.length >= 0 &&
          this.state.attribute !== undefined && (
            <table>
              <tbody>
                <tr>
                  <td />
                  <td>
                    <input
                      type="text"
                      className="form-control ml-10"
                      onKeyDown={this.AttributeValidation}
                      value={addNewValue}
                      onChange={this.inputChangedNew.bind(this, "")}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        this.handleAddNew(this.state.attribute.value);
                      }}
                    >
                      Добавить
                    </button>
                  </td>
                  <td />
                  <td />
                </tr>
              </tbody>
            </table>
          )}

        {!isLoading && sprDeleted.length > 0 && (
          <div>
            <div className="empty-space" />

            <div className="inactive-items">
              <span className="btn-show" onClick={this.handleHide}>
                {caption}
              </span>
            </div>

            <div className={`inactive-items-list ${isHidden ? "d-none" : ""}`}>
              {
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: "2%" }} />
                      <th style={{ width: "40%" }}>{label.deletedName}</th>
                      <th style={{ width: "43%" }} />
                      <th style={{ width: "15%" }} />
                    </tr>
                  </thead>
                  <tbody>
                    {sprDeleted.map((sprDeleted, idx) => (
                      <tr key={sprDeleted.id}>
                        <td>{idx + 1}</td>
                        <td>{sprDeleted.value}</td>
                        <td />
                        <td className="text-right">
                          <button
                            className="btn btn-w-icon rollback-item"
                            title={label.title.rollback}
                            onClick={() => {
                              this.handleRollback(
                                this.state.attribute.value,
                                sprDeleted
                              );
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              }
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default AttrSprPage;
