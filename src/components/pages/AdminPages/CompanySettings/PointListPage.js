import React, { Component, Fragment } from "react";
import Axios from "axios";

import ShowInactive from "../../ClosedListPages/ShowInactive";
import AddPointForm from "../../../forms/AddPointForm";
import AlertBox from "../../../AlertBox";
import SweetAlert from "react-bootstrap-sweetalert";
import Alert from "react-s-alert";
import Searching from "../../../Searching";

class PointList extends Component {
  state = {
    points: this.props.points,
    isLoading: true,
    label: {
      list: "Список активных торговых точек",
      add: "Добавить новую торговую точку",
      empty: "Cписок торговых точек пуст",
      name: "Наименование",
      address: "Адрес",
      is_minus: "Отрицательный учет",
      title: {
        edit: "Редактировать",
        delete: "Удалить",
        detail: "Детали",
      },
    },
    alert: {
      confirmDelete: "Вы действительно хотите удалить торговую точку?",
      successDelete: "Торговая точка успешно удалена",
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
    edit: false,
    pointData: null,
  };

  componentDidMount() {
    console.log(this.props.points)
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
    const newPointsList = this.state.points.filter((pointsList) => {
      console.log(pointsList);
      console.log(item.status);
      return pointsList !== item;
    });
    Axios.delete(`/api/companysettings/storepoint/delete?id=${item.id}`)
      .then(() => {
        this.setState({
          points: newPointsList,
        });
        Alert.success(this.state.alert.successDelete, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        // Alert.error(
        //   err.response.data.code === "internal_error"
        //     ? this.state.alert.raiseError
        //     : err.response.data.text,
        //   {
        //     position: "top-right",
        //     effect: "bouncyflip",
        //     timeout: 2000,
        //   }
        // );
        console.log(err);
      });

    this.hideAlert();
  };

  handleEdit = (pointData) => {
    // this.props.history.push({
    //   state: { pointData },
    // });
    this.setState({ pointData: pointData });
    this.setState({ edit: true });
  };

  handleRollback = (newPoint) => {
    let list = this.state.points;
    list.push(newPoint);

    this.setState({
      points: list,
    });
  };

  handleDetail = (point) => {
    this.props.history.push({
      pathname: "point/page",
      state: { point },
    });
  };
  
  render() {
    const { points, label, sweetalert } = this.state;
    const { isLoading } = this.props;

    return (
      <div className="point-list">
        {sweetalert}
        {this.state.edit ? (
          <AddPointForm
            pointData={this.state.pointData}
            company={this.props.companySelect}
          />
        ) : (
          <Fragment>
            <div className="row">
              <div className="col-md-6">
                <h6 className="btn-one-line">{label.list}</h6>
              </div>

              <div className="col-md-6 text-right">
                <button
                  className="btn btn-link btn-sm"
                  onClick={() => this.setState({ edit: true })}
                >
                  {label.add}
                </button>
              </div>
            </div>

            {isLoading && <Searching />}

            {!isLoading && <div className="empty-space" />}

            {!isLoading && points.length === 0 && (
              <AlertBox text={label.empty} />
            )}

            {!isLoading && points.length > 0 && (
              <div>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: "1%" }} />
                      <th style={{ width: "30%" }}>{label.name}</th>
                      <th style={{ width: "30%" }}>{label.address}</th>
                      <th style={{ width: "18%" }}>{label.is_minus}</th>
                      <th style={{ width: "15%" }} />
                    </tr>
                  </thead>
                  <tbody>
                    {points.map((point, idx) => (
                      <tr key={point.id}>
                        <td>{idx + 1}</td>
                        <td>{point.name}</td>
                        <td>{point.address}</td>
                        <td>{point.is_minus ? "Да" : "Нет"}</td>
                        <td className="text-right"></td>
                        <td className="text-right">
                          {point.point_type !== 0 ? (
                            <button
                              className="btn btn-w-icon edit-item"
                              title={label.title.edit}
                              onClick={() => {
                                this.handleEdit(point);
                              }}
                            />
                          ) : null}
                        </td>
                        <td>
                          {point.point_type !== 0 ? (
                            <button
                              className="btn btn-w-icon delete-item"
                              title={label.title.delete}
                              onClick={() => {
                                this.handleDelete(point);
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!isLoading && (
              <ShowInactive callback={this.handleRollback} mode="point" />
            )}
          </Fragment>
        )}
      </div>
    );
  }
}

export default PointList;
