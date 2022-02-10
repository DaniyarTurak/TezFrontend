import React, { Fragment, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CustomSelect from "../ReusableComponents/CustomSelect";
import alert from "react-s-alert";
import Axios from "axios";
import Alert from "@mui/material/Alert";

function AddUserAccessForm({
  reset,
  dispatch,
  handleSubmit,
  setSubmitting,
  isSubmitting,
  submitting,
  userData,
  setAccessForm,
  history,
  userName,
}) {
  const [checkedCheckboxes, setCheckedCheckboxes] = useState(
    userData ? userData.accesses : []
  );
  const [accessFunctions, setAccessFunctions] = useState([]);
  const [role, setRole] = useState({ value: "", label: "Набор" });
  const [roles, setRoles] = useState([]);

  const options = roles.map((role) => {
    return { value: role.id, label: role.name };
  });

  useEffect(() => {
    getAccessFunctions();
    getRoles();
  }, []);

  const getAccessFunctions = () => {
    Axios.get("/api/erpuser/getaccesses")
      .then((res) => res.data)
      .then((data) => {
        setAccessFunctions(data);
      });
  };

  const handleSubmitFunction = (data) => {
    setSubmitting(true);
    submit(data);
  };

  const handleEditFunction = (data) => {
    setSubmitting(true);
    edit(data)
  }

  const edit = (data) => {
    data.accesses = [];
    checkedCheckboxes.forEach((access) => {
      data.accesses.push({ id: access.id, code: access.code });
    });
    const reqdata = { erpusr: data };
    Axios.put("/api/erpuser/updateuser", reqdata)
      .then(() => {
        if (userData) {
          history.push({
            pathname: "/usercabinet/options/erpuser",
            state: {
              fromEdit: true,
            },
          });
        } 
        setSubmitting(false);
        dispatch(reset("AddErpUserForm"));
        if (role.label !== "Набор") {
          const updatedData = {
            id: role.value,
            accesses: checkedCheckboxes,
            name: role.label,
          };
          Axios.put("/api/erpuser/updaterole", { role: updatedData })
            .then((res) => res.data)
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        alert.error(
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
  }

  const submit = (data) => {
    // data.pass = data.user_password || null;
    // delete data.user_password;
    // delete data.confirmUserPassword;

    data.accesses = [];
    checkedCheckboxes.forEach((access) => {
      data.accesses.push({ id: access.id, code: access.code });
    });

    const reqdata = { erpusr: data };

    Axios.post("/api/erpuser/new-manage", reqdata)
      .then(() => {
        if (userData) {
          history.push({
            pathname: "/usercabinet/options/erpuser",
            state: {
              fromEdit: true,
            },
          });
        } else {
          history.push({
            pathname: "/usercabinet/options/erpuser",
          });
          alert.success("Пользователь ERP успешно создан", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        }
        setSubmitting(false);
        dispatch(reset("AddErpUserForm"));
        if (role.label !== "Набор") {
          const updatedData = {
            id: role.value,
            accesses: checkedCheckboxes,
            name: role.label,
          };
          Axios.put("/api/erpuser/updaterole", { role: updatedData })
            .then((res) => res.data)
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        alert.error(
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
  const getRoles = () => {
    Axios.get("/api/erpuser/roles")
      .then((res) => res.data)
      .then((data) => {
        setRoles(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCheckboxChange = (data) => {
    const isChecked = checkedCheckboxes.some(
      (checkedCheckbox) => checkedCheckbox.id === data.id
    );
    if (isChecked) {
      setCheckedCheckboxes(
        checkedCheckboxes.filter(
          (checkedCheckbox) => checkedCheckbox.id !== data.id
        )
      );
    } else {
      setCheckedCheckboxes(
        checkedCheckboxes.concat({ id: data.id, code: data.code })
      );
    }
  };

  const roleSelectChangeHandler = (e) => {
    setRole({ value: e.value, label: e.label });
    const selectedRole = roles.find((role) => role.id == e.value);
    setCheckedCheckboxes(selectedRole.accesses);
  };

  const children = (data) => {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", ml: 3 }}
        key={data.id}
      >
        <FormControlLabel
          label={data.name}
          control={
            <Checkbox
              checked={checkedCheckboxes.some(
                (checkedCheckbox) => checkedCheckbox.id === data.id
              )}
              onChange={() => handleCheckboxChange(data)}
            />
          }
        />
      </Box>
    );
  };
  return (
    <div style={{ margin: "15px" }}>
      <h6 className="btn-one-line">
        {userData
          ? `Выберите доступы для пользователя ${userData.name}`
          : `Выберите доступы для пользователя ${userName} `}
      </h6>

      <Alert severity="info">
        Укажите галочками доступы или выберите из списка готовый набор
      </Alert>
      <br />
      <CustomSelect
        placeholder={"Набор"}
        options={options}
        value={role}
        onChange={roleSelectChangeHandler}
      />
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "15px",
        }}
      >
        {accessFunctions.map((category) => {
          return (
            <Fragment key={category.category}>
              <div>
                <p style={{ fontWeight: "bold" }}>{category.category}</p>
                <div>{category.functions.map((fn) => children(fn))}</div>
              </div>
            </Fragment>
          );
        })}
      </div>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => {
          setAccessForm(false);
        }}
      >
        Назад
      </button>
      {userData ? (
        <button
          type="submit"
          className="btn btn-success"
          disabled={isSubmitting || submitting}
          style={{ marginLeft: "10px" }}
          onClick={handleSubmit(handleEditFunction)}
        >
          {isSubmitting
            ? "Пожалуйста подождите..."
            : "Сохранить изменения"}
        </button>
      ) : (
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
            ? "Сохранить"
            : "Сохранить изменения"}
        </button>
      )}
    </div>
  );
}

export default AddUserAccessForm;
