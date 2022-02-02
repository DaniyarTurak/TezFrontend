import React, { Fragment, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from "react-s-alert";
import Axios from "axios";

function AddUserAccessForm({ reset, dispatch, handleSubmit, setSubmitting, isSubmitting, pristine, submitting, userData, setAccessForm, history }) {

  const [checkedCheckboxes, setCheckedCheckboxes] = useState(userData ? userData.accesses : []);
  const [accessFunctions, setAccessFunctions] = useState([]);


  useEffect(() => {
    getAccessFunctions()
  }, [])

  const getAccessFunctions = () => {
    Axios.get("/api/erpuser/getaccesses")
      .then((res) => res.data)
      .then((data) => {
        setAccessFunctions(data)
      })
  }

  const handleSubmitFunction = (data) => {
    setSubmitting(true);
    submit(data);
  };

  const submit = (data) => {
    data.pass = data.user_password || null;
    delete data.user_password;
    delete data.confirmUserPassword;

    data.roles = [];
    data.role.forEach((role) => {
      data.roles.push({ id: role.value });
    });
    data.accesses = [];
    checkedCheckboxes.forEach((access) => {
      data.accesses.push({ id: access.id, code: access.code })
    })

    delete data.role;
    const reqdata = { erpusr: data };

    Axios.post("/api/erpuser/new-manage", reqdata)
      .then(() => {
        if (userData) {
          history.push({
            pathname: "/usercabinet/options/erpuser",
            state: {
              fromEdit: true,
            },
          })
        } else {
          history.push({
            pathname: "/usercabinet/options/erpuser"
          })
          Alert.success("Пользователь ERP успешно создан", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        }
        setSubmitting(false);
        dispatch(reset("AddErpUserForm"));
      })
      .catch((err) => {
        Alert.error(
          err.response.data.code === "internal_error"
            ? "Возникла ошибка при обработке вашего запроса. Мы уже работаем над решением. Попробуйте позже"
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

  const handleCheckboxChange = (data) => {
    const isChecked = checkedCheckboxes.some(checkedCheckbox => checkedCheckbox.id === data.id)
    if (isChecked) {
      setCheckedCheckboxes(
        checkedCheckboxes.filter(
          (checkedCheckbox) => checkedCheckbox.id !== data.id
        )
      );
    } else {
      setCheckedCheckboxes(checkedCheckboxes.concat({ id: data.id, code: data.code }));
    }
  };


  const children = (data) => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }} key={data.id}>
        <FormControlLabel
          label={data.name}
          control={
            <Checkbox
              checked={checkedCheckboxes.some(checkedCheckbox => checkedCheckbox.id === data.id)
              }
              onChange={() => handleCheckboxChange(data)} />}
        />
      </Box>
    )

  };
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row", margin: "15px", flexWrap:"wrap", gap: "15px" }}>
        {accessFunctions.map((category) => {
          return (
            <Fragment key={category.category}>
              <div>
                <p style={{ fontWeight: "bold" }}>{category.category}</p>
                <div>
                  {category.functions.map(fn => children(fn))}
                </div>
              </div>
            </Fragment>
          )
        })}
      </div>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => {
          setAccessForm(false)
        }}
      >
        Назад
      </button>

      <button
        type="submit"
        className="btn btn-success"
        disabled={isSubmitting || submitting}
        style={{ marginLeft: "10px" }}
        onClick={handleSubmit(handleSubmitFunction)}
      >
        {isSubmitting
          ? "Пожалуйста подождите..."
          : !userData
            ? "Добавить"
            : "Сохранить изменения"}
      </button>
    </div>
  )
}

export default AddUserAccessForm;

