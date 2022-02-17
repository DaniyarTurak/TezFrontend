import React, { Fragment, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import alert from "react-s-alert";
import Axios from "axios";
import Alert from "@mui/material/Alert";
import Grid from "@material-ui/core/Grid";
import { Select } from "antd";
import "../styles/AddUserAccessForm.css";

const { Option } = Select;

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
  const [role, setRole] = useState({ value: "", label: "Шаблон" });
  const [roles, setRoles] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getAccessFunctions();
    getRoles();
  }, []);

  const getRoles = () => {
    Axios.get("/api/erpuser/roles")
      .then((res) => res.data)
      .then((data) => {
        setRoles(data);
        let newOptions = [];
        data.forEach((role) => {
          newOptions.push({ value: role.id, label: role.name });
        });
        setOptions(newOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAccessFunctions = () => {
    let id = "";
    if (userData) {
      id = userData.id;
    }
    Axios.get(`/api/erpuser/getaccesses?id=${id}`)
      .then((res) => res.data)
      .then((data) => {
        setAccessFunctions(data);
        const accesses = data
          .map((item) => item.access_functions)
          .filter((item) => item.length > 0)
          .flat(2);
        setCheckedCheckboxes(accesses);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmitFunction = (data) => {
    setSubmitting(true);
    submit(data);
  };

  const handleEditFunction = (data) => {
    setSubmitting(true);
    edit(data);
  };

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

  const submit = (data) => {
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

  const handleUpdateRole = () => {
    if (role.label !== "Шаблон") {
      const updatedData = {
        id: role.value,
        accesses: checkedCheckboxes,
        name: role.label,
      };
      Axios.put("/api/erpuser/updaterole", { role: updatedData })
        .then((res) => res.data)
        .then((data) => {
          alert.success("Шаблон успешно сохранен", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleCheckboxChange = (data) => {
    const isChecked = checkedCheckboxes.some(
      (checkedCheckbox) => checkedCheckbox.id == data.id
    );
    if (isChecked) {
      setCheckedCheckboxes(
        checkedCheckboxes.filter(
          (checkedCheckbox) => checkedCheckbox.id != data.id
        )
      );
    } else {
      setCheckedCheckboxes(
        checkedCheckboxes.concat({ id: data.id, code: data.code })
      );
    }
  };

  const roleSelectChangeHandler = (e, item) => {
    if (e !== undefined) {
      setRole({ value: item.value, label: item.label });
      const selectedRole = roles.find((role) => role.id == item.value);
      //console.log("SelectedRoles: ", selectedRole.accesses); // [{id, code}]
      setCheckedCheckboxes(selectedRole.accesses);
    }
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
                (checkedCheckbox) => checkedCheckbox.id == data.id
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
      <Alert severity="info" style={{ padding: "0 10px" }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <p>
              Укажите галочками доступы или выберите из списка готовый шаблон
            </p>{" "}
          </Grid>
          <Grid item xs={4}>
            <Select
              allowClear
              value={role}
              options={options}
              onChange={roleSelectChangeHandler}
              placeholder={"Набор"}
              onClear={() => {
                setRole({ value: "", label: "Шаблон" });
                setCheckedCheckboxes(userData ? userData.accesses : []);
              }}
              style={{ width: "100%", minWidth: "266px" }}
            />
          </Grid>
        </Grid>
      </Alert>
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
      <button
        type="submit"
        className="btn btn-success"
        disabled={isSubmitting || submitting}
        style={{ marginLeft: "10px" }}
        onClick={
          userData
            ? handleSubmit(handleEditFunction)
            : handleSubmit(handleSubmitFunction)
        }
      >
        {isSubmitting
          ? "Пожалуйста подождите..."
          : "Сохранить доступы для выбранного пользователя"}
      </button>
      <button
        type="submit"
        className="btn btn-success"
        disabled={role.label === "Шаблон"}
        style={{ marginLeft: "10px" }}
        onClick={handleUpdateRole}
      >
        {`Сохранить шаблон ${role.label !== "Шаблон" ? `"${role.label}"` : ""}`}
      </button>
    </div>
  );
}

export default AddUserAccessForm;
