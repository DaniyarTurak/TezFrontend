import React, { Component } from "react";
import Axios from "axios";

import ShowInactive from "../ClosedListPages/ShowInactive";

import AlertBox from "../../AlertBox";
import SweetAlert from "react-bootstrap-sweetalert";
import Alert from "react-s-alert";
import Searching from "../../Searching";

class PointList extends Component {
  state = {
    points: [],
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
  };

  componentDidMount() {
    this.getPoints();

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

  getPoints = () => {
    Axios.get("/api/point")
      .then((res) => res.data)
      .then((points) => {
        this.setState({
          points,
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
    const newPointsList = this.state.points.filter((pointsList) => {
      console.log(pointsList);
      console.log(item.status);
      return pointsList !== item;
    });
    //  console.log(newPointsList);
    item.status = "CLOSE";
    const req = { point: item };

    Axios.post("/api/point/change", req)
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

  handleEdit = (pointData) => {
    this.props.history.push({
      pathname: "point/manage",
      state: { pointData },
    });
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
    const { points, isLoading, label, sweetalert } = this.state;
    return (
      <div className="point-list">
        {sweetalert}

        <div className="row">
          <div className="col-md-6">
            <h6 className="btn-one-line">{label.list}</h6>
          </div>

          <div className="col-md-6 text-right">
            <button
              className="btn btn-link btn-sm"
              onClick={() => this.props.history.push("point/manage")}
            >
              {label.add}
            </button>
          </div>
        </div>

        {isLoading && <Searching />}

        {!isLoading && <div className="empty-space" />}

        {/* <div className={`active-content ${isLoading ? 'is-loading' : ''}`}>
					<div className="loader">
						<div className="icon"></div>
					</div> */}

        {!isLoading && points.length === 0 && <AlertBox text={label.empty} />}

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
                    <td className="text-right">
                      {/* <button className="btn btn-w-icon detail-item" title={label.title.detail}
													onClick={() => { this.handleDetail(point) }}>
												</button> */}
                      {point.point_type !== 0 ? (
                        <button
                          className="btn btn-w-icon edit-item"
                          title={label.title.edit}
                          onClick={() => {
                            this.handleEdit(point);
                          }}
                        />
                      ) : (
                        ""
                      )}
                      {/* {point.point_type !== 0 ? (
                        <button
                          className="btn btn-w-icon delete-item"
                          title={label.title.delete}
                          onClick={() => {
                            this.handleDelete(point);
                          }}
                        />
                      ) : (
                        ""
                      )} */}
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
      </div>
    );
  }
}

export default PointList;
