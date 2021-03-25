import React, { Component } from "react";
import Axios from "axios";

import Alert from "react-s-alert";
import Searching from "../../Searching";
import SweetAlert from "react-bootstrap-sweetalert";

class UpdateCategoryPage extends Component {
  state = {
    spr: [],
    categories: [],
    categoryDeleted: [],
    caption: "",
    isHidden: true,
    categoryNotDeleted: [],
    isEdit: true,
    isLoading: true,
    addNewValue: "",
    expandedSpr: [],
    categoryTypes: [],
    isSubmiting: false,
    isUpdating: false,
    label: {
      list: "Корректировка категорий",
      add: "Добавить новую категорию",
      empty: "Cписок категорий пуст",
      name: "Наименование категории",
      nameAdd: "Добавить новую категорию",
      deletedName: "Удаленные категории",
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
      raiseEditError: "Вы пытаетесь добавить пустое значение",
      confirmDelete: "Вы действительно хотите удалить бренд?",
      success: "Успешно",
      successDelete: "Бренд успешно удален",
      successEdit: "Изменения сохранены",
      raiseError:
        "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже",
      label: {
        ok: "Хорошо",
        buttonLabel: "Создать категория",
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
    caption = "Показать список неактивных категорий";
    this.setState({
      caption: caption,
    });
    this.getCategories();
  }

  hideAlert = () => {
    this.setState({
      sweetalert: null,
    });
  };

  handleEdit = (categoryNotDeleted) => {
    this.sendInfo(categoryNotDeleted.name, false, categoryNotDeleted.id);
  };

  handleAddNew = () => {
    const { addNewValue, alert } = this.state;
    if (addNewValue === "") {
      Alert.error(alert.raiseEditError, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }
    this.sendInfo(addNewValue, false);
    this.setState({
      addNewValue: "",
    });
  };

  handleDelete = (categoryNotDeleted) => {
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
            this.sendInfo(categoryNotDeleted.name, true, categoryNotDeleted.id)
          }
          onCancel={() => this.hideAlert()}
        >
          {this.state.alert.confirmDelete}
        </SweetAlert>
      ),
    });
  };

  handleRollback = (categoryDeleted) => {
    this.sendInfo(categoryDeleted.name, false, categoryDeleted.id);
  };

  sendInfo = (name, deleted, id) => {
    const newCategoryList = this.state.categories.filter((pointsList) => {
      return pointsList !== (name, deleted, id);
    });

    const category = {
      name: name,
      deleted: deleted,
      id: id,
    };
    Axios.post("/api/categories/updatecategories", { category })
      .then(() => {
        this.setState({
          categories: newCategoryList,
          isEdit: true,
          sweetalert: null,
        });
        this.getCategories();
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
      caption = captionType + " список неактивных категорий";

    this.setState({
      isHidden: !this.state.isHidden,
      caption,
    });
  };

  CategoryValidation = (e) => {
    const { name } = e.target;
    if (name === "" || name === null) {
      this.setState({ isEdit: true });
    }
  };

  inputChanged = (index, e) => {
    const { categoryNotDeleted } = this.state;
    categoryNotDeleted.forEach((point) => {
      point.name = point.id === index ? e.target.value : point.name;
    });
    this.setState({ categoryNotDeleted, isEdit: false, isUpdating: true });
  };

  inputChangedNew = (index, e) => {
    this.setState({
      addNewValue: e.target.value,
      isEdit: false,
      isLoading: false,
      isUpdating: true,
    });
  };

  getCategories = () => {
    Axios.get("/api/categories/getcategories")
      .then((res) => res.data)
      .then((categories) => {
        let categoryDeleted = [];
        let categoryNotDeleted = [];
        categories.forEach((sp) => {
          if (sp.deleted === true) {
            categoryDeleted.push({
              name: sp.name,
              id: sp.id,
              deleted: sp.deleted,
            });
          } else
            categoryNotDeleted.push({
              name: sp.name,
              id: sp.id,
              deleted: sp.deleted,
            });
          this.setState({
            categories,
            categoryDeleted,
            categoryNotDeleted,
            isLoading: false,
            isUpdating: false,
          });
        });
        this.setState({
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false,
          isUpdating: false,
        });
      });
  };

  onCategoryChange = (category) => {
    this.setState({
      category,
    });
    if (category.value) {
      this.setState({ isLoading: false });
    }
    this.getCategories(category.value);
  };

  AttributeValidation = (e) => {
    const { value } = e.target;
    if (value === "" || value === null) {
      this.setState({ isEdit: true });
    }
  };

  render() {
    const {
      isLoading,
      categoryDeleted,
      categoryNotDeleted,
      label,
      isHidden,
      caption,
      addNewValue,
      sweetalert,
      isEdit,
    } = this.state;
    return (
      <div className="brand-list">
        {sweetalert}

        <div className="row">
          <div className="col-md-12">
            <h6 className="btn-one-line">{label.list}</h6>
          </div>
        </div>

        {isLoading && <Searching />}

        {!isLoading && <div className="empty-space" />}

        {!isLoading && categoryNotDeleted.length > 0 && (
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
                {categoryNotDeleted.map((category, idx) => (
                  <tr key={category.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <input
                        type="email"
                        className="form-control"
                        value={category.name}
                        onKeyDown={this.CategoryValidation}
                        onChange={this.inputChanged.bind(this, category.id)}
                      />
                    </td>
                    <td />
                    <td className="text-right">
                      <button
                        className="btn  btn-w-icon edit-item"
                        title={label.title.edit}
                        disabled={isEdit}
                        onClick={() => {
                          this.handleEdit(category);
                        }}
                      />

                      <button
                        className="btn btn-w-icon delete-item"
                        title={label.title.delete}
                        onClick={() => {
                          this.handleDelete(category);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: "2%" }} />
                <th style={{ width: "40%" }} />
                <th style={{ width: "15%" }} />
                <th style={{ width: "43%" }} />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td />
                <td>
                  <input
                    type="text"
                    className="form-control"
                    onKeyDown={this.AttributeValidation}
                    value={addNewValue}
                    onChange={this.inputChangedNew.bind(this, "")}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      this.handleAddNew();
                    }}
                  >
                    Добавить
                  </button>
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        {!isLoading && categoryDeleted.length > 0 && (
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
                    {categoryDeleted.map((categoryDeleted, idx) => (
                      <tr key={categoryDeleted.id}>
                        <td>{idx + 1}</td>
                        <td>{categoryDeleted.name}</td>
                        <td />
                        <td className="text-right">
                          <button
                            className="btn btn-w-icon rollback-item"
                            title={label.title.rollback}
                            onClick={() => {
                              this.handleRollback(categoryDeleted);
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

export default UpdateCategoryPage;
