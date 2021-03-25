import React, { useState, useEffect, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Axios from "axios";

export default function OrderForm({ handleCloseDialog, comp_id, isOpenDialog }) {

  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [result, setResult] = useState();
  const [enabled, setEnabled] = useState(false);
  const [tried, setTried] = useState(false);

  const useStyles = makeStyles(theme =>
    createStyles({
      root: {
        '& label.Mui-focused': {
          color: '#17a2b8',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: '#17a2b8',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#17a2b8',
          },
          '&:hover fieldset': {
            borderColor: '#17a2b8',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#17a2b8',
          },
        },
      },
    })
  );
  const classes = useStyles();

  useEffect(() => {
    getUsernames();
    setTried(false);
  }, []);

  const getUsernames = () => {
    Axios.get("/api/adminpage/usernames", {
      params: { comp_id },
    })
      .then((res) => res.data)
      .then((usernamesList) => {
        setUsers(usernamesList);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const resetPassword = () => {
    Axios.get("/api/adminpage/passreset", {
      params: { comp_id, username },
    })
      .then((res) => res.data)
      .then((results) => {
        setResult(results[0].passreset);
        setTried(true);
      })
      .catch((err) => {
        setResult(err);
        setTried(true);
      });
  }

  return (
    <Fragment>
      <Dialog
        maxWidth="xs"
        fullWidth
        disableBackdropClick
        disableEscapeKeyDown
        open={isOpenDialog}
        onClose={handleCloseDialog}
      >
        <DialogContent>
          <h5><strong>Cброс пароля</strong></h5>
          <hr />
          <div style={{ padding: "10px" }}>ID компании: <span style={{ color: "#17a2b8", fontWeight: "bold" }}>{comp_id}</span></div>
          <div style={{ padding: "10px" }}>
            <Autocomplete
              noOptionsText="Загрузка..."
              value={username}
              style={{ width: "100%" }}
              options={users.map((option) => option.login)}
              onInputChange={(event, value) => { setUsername(value); setEnabled(true) }}
              renderInput={params => (
                <TextField
                  classes={{
                    root: classes.root,
                  }}
                  {...params}
                  size="small"
                  variant="outlined"
                  style={{ margin: "auto" }}
                  placeholder="Логин пользователя"
                  InputProps={{ ...params.InputProps }}
                />
              )}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button
              disabled={!enabled}
              style={{ width: "150px" }}
              className="btn btn-success btn-sm btn-block"
              onClick={resetPassword}
            >
              Сбросить пароль
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "10px" }}>
            {tried && result.code && result.code === "success" &&
              <span style={{ color: "#28a745", fontWeight: "bold" }}>Пароль успешно сброшен</span>
            }
            {tried && result.code && result.code === "error" &&
              <span style={{ color: "#dc3545", fontWeight: "bold" }}>{result.text}</span>
            }
            {tried && !result.code &&
              <span style={{ color: "#dc3545", fontWeight: "bold" }}>При сбросе пароля произошла ошибка</span>
            }
          </div>
          <hr style={{ marginTop: "10px", marginBottom: "0px" }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
           {!tried && "Отмена" }
           {tried && "Закрыть" }
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}