import React, { Fragment, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from "react-s-alert";
import Axios from "axios";

function AddUserAccessForm({reset, dispatch, handleSubmit,setSubmitting, isSubmitting, pristine, submitting, userData, setAccessForm, history }) {

  const [checked, setChecked] = useState([true, false]);
  const [accessFunctions, setAccessFunctions] = useState([]);

  
  useEffect(() => {
    getAccessFunctions()
  }, [])

  
  const getAccessFunctions = () => {
    Axios.get("/api/get_categories")
    .then((res) => res.data)
    .then((data) => {
      console.log(data);
      setAccessFunctions(data)
    })
  }

  const handleSubmitFunction = (data) => {
    if (!userData && !data.user_password) {
      return Alert.error("Заполните все необходимые поля", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
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
    delete data.role;
    const reqdata = { erpusr: data };

    Axios.post("/api/erpuser/manage", reqdata)
      .then(() => {
        userData
          ? history.push({
            pathname: "/usercabinet/erpuser",
            state: {
              fromEdit: true,
            },
          })
          : Alert.success("Пользователь ERP успешно создан", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
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

  const handleChange1 = (event) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event) => {
    setChecked([checked[0], event.target.checked]);
  };

  const children = (
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
      <FormControlLabel
        label="Child 1"
        control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
      />
      <FormControlLabel
        label="Child 2"
        control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
      />
    </Box>
  );
  return (
    <div>
      <FormControlLabel
        label="Parent"
        control={
          <Checkbox
            checked={checked[0] && checked[1]}
            indeterminate={checked[0] !== checked[1]}
            onChange={handleChange1}
          />
        }
      />
      {children}


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
        disabled={isSubmitting || pristine || submitting}
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

