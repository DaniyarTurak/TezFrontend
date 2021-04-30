import React, { useState, useEffect, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Moment from "moment";
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from "react-s-alert";
import ReconciliationTable from './ReconciliationTable';
import PublishIcon from '@material-ui/icons/Publish';
import { Progress } from "reactstrap";
import CompareTable from "./CompareTable";

const CreateButton = withStyles((theme) => ({
  root: {
    color: "white",
    border: "1px solid #17a2b8",
    backgroundColor: "#17a2b8",
    '&:hover': {
      border: "1px solid #17a2b8",
      color: "#17a2b8",
      backgroundColor: "transparent",
    },
  },
}))(Button);

const CompareButton = withStyles((theme) => ({
  root: {
    color: "white",
    border: "1px solid #28a745",
    backgroundColor: "#28a745",
    '&:hover': {
      border: "1px solid #28a745",
      color: "#28a745",
      backgroundColor: "transparent",
    },
  },
}))(Button);

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 5,
    borderRadius: 2,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 2,
    backgroundColor: '#17a2b8',
  },
}))(LinearProgress);


export default function ReconciliationPage() {

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

  const [points, setPoints] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pointId, setPointId] = useState(0);
  const [reconciliations, setReconciliations] = useState([]);
  const [isReconAllowed, setReconAllowed] = useState(false);
  const [pntName, setPntName] = useState("");
  const [loaded, setLoaded] = useState(0);
  const [summData, setSummData] = useState([]);
  const [textData, setTextData] = useState("");

  useEffect(() => {
    getPoints();
  }, []);

  //загрузка списка торговых точек компании
  const getPoints = () => {
    Axios.get("/api/point", { params: { company: "", holding: false } })
      .then((res) => res.data)
      .then((points) => {
        setPoints(points);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  //проверка наличия активных сверок
  const getReconciliation = (pointName) => {
    let pointid = "";
    setPntName(pointName)
    points.forEach(point => {
      if (point.name === pointName) {
        pointid = point.id
      }
    });
    if (pointid !== "") {
      Axios.get("/api/reconciliation/active", { params: { pointid } })
        .then((res) => res.data)
        .then((recons) => {
          if (recons.length === 0) {
            setReconciliations(recons);
            getStock(pointid);
          }
          else {
            setReconciliations(recons);
          }
        })
        .catch((err) => {
          ErrorAlert(err);
        });
    }
  };

  //запрос списка товаров
  const getStock = (pointid) => {
    setLoading(true);
    let prods = [];
    if (pointid !== "") {
      Axios.get("/api/reconciliation/stock", { params: { pointid } })
        .then((res) => res.data)
        .then((results) => {

          prods = results;
          if (prods.length > 0) {
            setReconAllowed(true);
            setPointId(pointid);
            setProducts(prods);
            setLoading(false);
          }
          else {
            ErrorAlert("На точке нет товаров");
            setLoading(false);
          }
        })
        .catch((err) => {
          ErrorAlert(err);
          setLoading(false);
        });
    }
    else {
      ErrorAlert("Не выбрана торговая точка");
      setLoading(false);
    }
  };

  //создание записи о сверке в базе
  const createReconciliation = () => {
    setLoading(true);
    setReconAllowed(false);
    const reqdata = {
      out_data: products,
      point: pointId
    }
    Axios.post("/api/reconciliation/create", reqdata)
      .then((result) => {
        console.log(result);
        toText();
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
        setLoading(false);
        setReconAllowed(true);
      });
  };

  //выгрузка списка товаров в текстовый файл для ТСД 
  const toText = () => {
    let arr = [];
    const date = `recon_${Moment().format("L").split(".").join("")}.txt`;
    products.map((product, idx) =>
      arr.push(
        Object.values({
          a: product.code,
          b: product.name,
        })
      )
    )
    Axios({
      method: "POST",
      url: "/api/reconciliation/to-text",
      data: {
        arr,
        date,
      },
      responseType: "blob",
    })
      .then((data) => {
        return data.data;
      })
      .then((resp) => {
        return Axios.get("/api/reconciliation/download", {
          responseType: "blob",
          params: { date },
        })
          .then((res) => res.data)
          .then((response) => {
            const url = window.URL.createObjectURL(
              new Blob(
                [
                  "",
                  response,
                ],
              )
            );
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", date);
            document.body.appendChild(link);
            link.click();
            Alert.success("Сверка запущена", {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            });
            setLoading(false);
            setReconAllowed(true);
          });
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
        setReconAllowed(true);
      });
  };

  const loadFile = (event) => {
    setLoaded(0);
    const file = event.target.files[0];
    let reader = new FileReader();

    reader.onload = function (event) {
      const text = event.target.result;
      setTextData(text)
    };
    reader.readAsText(file);
  };

  //творится магия и текстовый файл превращается в массив объектов
  const fetchFile = () => {
    if (textData) {
      let arr = textData.split('\n');
      let arr2 = [];
      arr.forEach(element => {
        if (element !== "") {
          arr2.push(element);
        }
      });
      let arr3 = [];
      arr2.forEach(element => {
        let listIdx = [];
        let lastIndex = -1
        while ((lastIndex = element.indexOf(";", lastIndex + 1)) !== -1) {
          listIdx.push(lastIndex)
        }
        let code = '{ "code":"' + element.slice(0, listIdx[0]) + '", ';
        let units = '"units":' + element.slice(listIdx[0] + 1, listIdx[1]) + '}';
        let obj = JSON.parse(code + units);
        arr3.push(obj);
      });
      uploadData(arr3);
    }
    else {
      ErrorAlert("Выберите файл")
    }
  };

  //загрузка данных из ТСД в базу
  const uploadData = (products) => {
    const reqdata = {
      id: reconciliations[0].id,
      in_data: products
    }
    console.log(reqdata);
    Axios.post("/api/reconciliation/upload", reqdata)
      .then((result) => {
        console.log(result);
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
        setLoading(false);
        setReconAllowed(true);
      });
  }

  return (
    <Fragment>
      <Grid item xs={12}>
        Выберите торговую точку
      </Grid>
      <Grid container style={{ paddingBottom: "15px" }} spacing={3}>
        <Grid item xs={6}>
          <Autocomplete
            id="point"
            style={{ width: "100%" }}
            options={points.map((option) => option.name)}
            onChange={(event, value) => { getReconciliation(value) }}
            renderInput={params => (
              <TextField
                classes={{
                  root: classes.root,
                }}
                {...params}
                size="small"
                variant="outlined"
                style={{ margin: "auto" }}
                placeholder="Торговая точка"
                InputProps={{ ...params.InputProps }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <CreateButton
            disabled={!isReconAllowed}
            onClick={createReconciliation}
          >
            Начать сверку
          </CreateButton>
        </Grid>
      </Grid>
      {isLoading &&
        <Grid item xs={12}>
          <BorderLinearProgress />
        </Grid>
      }
      {reconciliations.length > 0 &&
        <Fragment>
          <Grid item xs={12} style={{ paddingBottom: "10px" }}>
            На точке <strong>"{pntName}"</strong> имеется незавершённая сверка
          </Grid>
          <Grid item xs={12}>
            <ReconciliationTable reconciliations={reconciliations} />
          </Grid>
          <Grid item xs={12} style={{ paddingTop: "15px" }}>
            <div className="form-group files download-files">
              <input
                style={{ color: "#2ea591" }}
                type="file"
                className="form-control"
                name="file"
                onChange={loadFile}
              />
            </div>
            {isLoading && loaded !== 0 &&
              <div className="form-group">
                <Progress max="100" color="success" value={loaded}>
                  {Math.round(loaded, 2)}%
                </Progress>
              </div>
            }
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <CompareButton
                onClick={fetchFile}
              >
                <PublishIcon size="small" /> &nbsp;
                Выгрузить данные из ТСД
              </CompareButton>
            </Grid>
          </Grid>
          {summData.length !== 0 &&
            <Grid item xs={12} style={{ paddingTop: "15px" }}>
              <CompareTable products={summData} />
            </Grid>
          }
        </Fragment>
      }
    </Fragment >
  );
}
