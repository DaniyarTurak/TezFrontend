import React, { useState, useEffect, useRef } from "react";
import PickProduct from "./PickProduct";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import Alert from "react-s-alert";
import Moment from "moment";
import Typography from "@material-ui/core/Typography";
import ProductsFromInvoice from "./ProductsFromInvoice";
import TableSkeleton from "../../../Skeletons/TableSkeleton";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import SuccessAdd from "../Alerts/SuccessAdd";
import Loading from "../../../Loading";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "1rem",
  },
  buttons: {
    "& > *": {
      marginLeft: theme.spacing(1),
    },
  },
  buttonSubmit: {
    marginBottom: "1rem",
  },
}));

export default function AddProduct({
  scale,
  point,
  maxHotKey,
  invoiceId,
  goBack,
  createDate,
  deleteInvoice,
}) {
  const classes = useStyles();
  const scrollRef = useRef();
  const [barcodeCounter, setBarcodeCounter] = useState(1);
  const [editingProduct, setEditingProduct] = useState("");
  const [invoiceList, setInvoiceList] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isDeleted, setDeleted] = useState(false);
  const [tempProduct, setTempProduct] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    getUnusedBarcode();
    getInvoiceList();
  }, []);

  //после нажатия на кнопку "редактировать товар" сначала срабатывает его удаление из предыдущего списка,
  //и вызывается этот эффект на добавление отредактированного.
  useEffect(() => {
    if (isDeleted && tempProduct) {
      addProduct(tempProduct, true);
    }
    return () => {
      setDeleted(false);
      setTempProduct("");
    };
  }, [isDeleted]);

  const getUnusedBarcode = () => {
    Axios.get("/api/productsweight/barcode_unused")
      .then((res) => res.data)
      .then((res) => {
        if (res !== null && Array.isArray(res)) {
          setBarcodeCounter(res[0].code);
        }
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getInvoiceList = () => {
    setLoading(true);
    Axios.get("/api/invoice/product", { params: { invoicenumber: invoiceId } })
      .then((res) => res.data)
      .then((res) => {
        setInvoiceList(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const addProduct = (newProductList) => {
    const reqdata = {
      invoice: invoiceId,
      type: "2",
      scale: parseInt(scale.value, 0),
      stockcurrentfrom: [newProductList],
    };
    setSubmitting(true);
    //данный сервис сохраняет товары, в временную таблицу-инвойс
    Axios.post("/api/invoice/add/product", reqdata)
      .then((data) => {
        return data.data;
      })
      .then((resp) => {
        setSubmitting(false);
        if (resp.code === "success") {
          getUnusedBarcode();
          getInvoiceList();
          Alert.success("Товары успешно сохранены.", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        } else
          return Alert.warning(resp.text, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
      })
      .catch((err) => {
        setSubmitting(false);
        ErrorAlert(err);
      });
  };

  //удаляет товар из временной таблицы-инвойс
  const handleDelete = (row) => {
    Axios.post("/api/invoice/delete/product", {
      attributes: "0",
      invoice: row.invoice,
      stock: row.stock,
    })
      .then((data) => {
        return data.data;
      })
      .then((resp) => {
        if (resp.code === "success") {
          setDeleted(true);
          getUnusedBarcode();
          getInvoiceList();

          !tempProduct &&
            Alert.success("Товар удален успешно.", {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            });
        } else
          return Alert.warning(resp.text, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const editProduct = (oldProductList) => {
    setTempProduct(oldProductList);
    handleDelete(oldProductList);
  };

  const handleEdit = (p) => {
    Axios.get("/api/invoice/product/details", {
      params: {
        invoiceNumber: invoiceId,
        productId: p.stock,
      },
    })
      .then((res) => res.data)
      .then((det) => {
        setEditingProduct({
          ...det,
          ...p,
        });
        setEditing(true);
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const stopEditing = () => {
    setEditing(false);
  };

  const saveInvoice = () => {
    const req = { invoice: invoiceId };
    setSubmitting(true);
    Axios.post("/api/invoice/submit/add", req)
      .then((res) => res.data)
      .then((res) => {
        setAddModalOpen(true);
        setSubmitting(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setSubmitting(false);
      });
  };

  return (
    <div>
      <SuccessAdd open={isAddModalOpen} handleClose={goBack} />
      <div className={classes.root}>
        <div>
          <Typography gutterBottom>
            Накладная №: {invoiceId} от{" "}
            {Moment(createDate).format("DD.MM.YYYY HH:mm:ss")}
          </Typography>
          <Typography gutterBottom>Торговая точка: {point.label}</Typography>
          <Typography gutterBottom>Весы: {scale.label}</Typography>
        </div>
        <div className={classes.buttons}>
          <Button variant="contained" onClick={goBack}>
            Назад
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteInvoice(invoiceId)}
          >
            Удалить накладную
          </Button>
        </div>
      </div>
      {isSubmitting && <Loading />}
      <Divider variant="middle" />
      {isLoading ? (
        <TableSkeleton />
      ) : invoiceList.length === 0 && !isLoading ? (
        <div className="pw-adding-products-alert">
          Товары в данной накладной не найдены
        </div>
      ) : (
        <ProductsFromInvoice
          invoiceId={invoiceId}
          invoiceList={invoiceList}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          goBack={goBack}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Button
          className={classes.buttonSubmit}
          variant="contained"
          color="primary"
          disabled={isEditing || invoiceList.length === 0 || isSubmitting}
          onClick={saveInvoice}
        >
          Отправить на кассы
        </Button>
      </div>
      <Divider variant="middle" />
      <PickProduct
        addProduct={addProduct}
        barcodeCounter={barcodeCounter}
        editProduct={editProduct}
        editingProduct={editingProduct}
        isEditing={isEditing}
        invoiceId={invoiceId}
        invoiceListLength={invoiceList.length}
        invoiceList={invoiceList}
        point={point.value}
        scale={scale.value}
        stopEditing={stopEditing}
        maxHotKey={maxHotKey}
        isSubmitting={isSubmitting}
      />
      <div ref={scrollRef}></div>
    </div>
  );
}
