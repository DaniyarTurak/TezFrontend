import React, { useState, useEffect } from "react";
import { Field, reduxForm, initialize } from "redux-form";

import { InputField, SelectField } from "../fields";
import { RequiredField } from "../../validation";
import Alert from "react-s-alert";
import Axios from "axios";
import { modifyToSelect } from "../../actions/helpers/utils";

let AddAttributeForm = ({
  dispatch,
  location,
  history,
  handleSubmit,
  pristine,
  reset,
  submitting,
}) => {
  const [isSubmiting, setSubmitting] = useState(false);
  const [toFormatOptions, setToFormatOptions] = useState([]);

  const attributeData = location.state ? location.state.attributeData : null;

  useEffect(() => {
    getFormats();
    if (attributeData) {
      let attributeDataChanged = attributeData;
      attributeDataChanged.format = modifyToSelect(
        attributeDataChanged.format,
        attributeDataChanged.format
      );
      dispatch(initialize("addattributeform", attributeDataChanged));
    }
    return () => {
      dispatch(reset("addattributeform"));
    };
  }, []);

  const handleSubmitFunction = (item) => {
    setSubmitting(true);
    submit(item);
  };

  const getFormats = () => {
    Axios.get("/api/attributes/getformat")
      .then((res) => res.data)
      .then((options) => {
        const toFormatOptionsChanged = options.map((option) => {
          return {
            label: option.description,
            value: option.name,
          };
        });
        setToFormatOptions(toFormatOptionsChanged);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFormatChange = (f) => {
    getFormats(f.description);
  };

  const submit = (item) => {
    item.deleted = false;
    const attributenames = {
      attributes: {
        id: item.id,
        name: item.values,
        deleted: item.deleted,
        format: item.format.label,
      },
    };
    Axios.post("/api/adminpage/updateattributeslist", attributenames)
      .then(() => {
        attributeData
          ? history.push({
              pathname: "../updateattribute",
              state: {
                fromEdit: true,
              },
            })
          : Alert.success("атрибут успешно создан", {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            });
        setSubmitting(false);
        dispatch(reset("addattributeform"));
      })
      .catch((err) => {
        Alert.error(
          err.response.data.code === "internal_error"
            ? "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже"
            : err.response.data.text,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          }
        );
        setSubmitting(false);
      });
  };

  return (
    <div id="addAttribute">
      <div className="row">
        <div className="col-md-8">
          <h6 className="btn-one-line">
            {!attributeData
              ? "Добавить новый атрибут"
              : "Редактировать информацию об атрибуте"}{" "}
          </h6>
        </div>

        <div className="col-md-4 text-right">
          <button
            className="btn btn-link btn-sm"
            onClick={() => history.push("../updateattribute")}
          >
            Список атрибутов
          </button>
        </div>
      </div>

      <div className="empty-space" />

      <form onSubmit={handleSubmit(handleSubmitFunction)}>
        <dl>
          <dt>Наименование атрибута</dt>
          <dd>
            <Field
              name="values"
              component={InputField}
              type="text"
              className="form-control"
              placeholder="Введите наименование атрибута"
              validate={[RequiredField]}
            />
          </dd>
          <dt>Тип</dt>
          <dd>
            <Field
              name="format"
              component={SelectField}
              type="text"
              className="form-control"
              onChange={onFormatChange}
              options={toFormatOptions}
              placeholder="Выберите тип атрибута"
              noOptionsMessage={() => "тип не найден"}
            />
          </dd>
        </dl>

        <button
          type="submit"
          className="btn btn-success"
          disabled={isSubmiting || pristine || submitting}
        >
          {isSubmiting
            ? "Пожалуйста подождите..."
            : !attributeData
            ? "Добавить"
            : "Сохранить изменения"}
        </button>

        {!attributeData && (
          <button
            type="button"
            className="btn btn-secondary ml-10"
            disabled={isSubmiting || pristine || submitting}
            onClick={reset}
          >
            Очистить
          </button>
        )}
      </form>
    </div>
  );
};

export default AddAttributeForm = reduxForm({
  form: "addattributeform",
})(AddAttributeForm);
