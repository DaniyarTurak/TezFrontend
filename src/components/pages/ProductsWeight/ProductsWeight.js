import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Select from "react-select";
import ProductsList from "./ProductsList";
import Alert from "react-s-alert";
import ReactModal from "react-modal";
import SaveProducts from "./SaveProducts";
import "./products-weight.sass";
import SweetAlert from "react-bootstrap-sweetalert";
import EditingProductComponent from "./Alerts/EditingProductComponent";
import WarningDelete from "./Alerts/WarningDelete";
import SuccessAdd from "./Alerts/SuccessAdd";
import ErrorAlert from "../../ReusableComponents/ErrorAlert";
import IconButton from "@material-ui/core/IconButton";
import ReplayIcon from "@material-ui/icons/Replay";
import TableSkeleton from "../../Skeletons/TableSkeleton";
import AddProduct from "./AddProduct";
import Moment from "moment";

export default function ProductsWeight({ history }) {
  const [activeInvoice, setActiveInvoice] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingProduct, setEditingProduct] = useState("");
  const [isAddingAmount, setAddingAmount] = useState(false);
  const [isAddProduct, setAddProduct] = useState(false);
  const [isChanging, setChanging] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [scale, setScale] = useState("");
  const [scales, setScales] = useState([]);
  const [stock, setStock] = useState("");
  const [stocks, setStocks] = useState([]);
  const [sweetalert, setSweetAlert] = useState("");

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-40%, -50%)",
      width: isEditing || isAddingAmount ? "60%" : "60rem",
      zIndex: 11,
      height: "40vh",
    },
    overlay: { zIndex: 10 },
  };

  useEffect(() => {
    getStocks();
  }, []);

  useEffect(() => {
    if (stock) {
      setScale("");
      getScales();
    }
  }, [stock]);

  useEffect(() => {
    if (stock && scale) {
      getProductsWeight();
    }
  }, [stock, scale]);

  const getStocks = () => {
    Axios.get("/api/stock")
      .then((res) => res.data)
      .then((res) => {
        const filteredRes = res.filter((f) => f.name !== "Центральный склад");
        const stocks = filteredRes.map((s) => {
          return {
            label: s.name,
            value: s.id,
          };
        });
        setStocks(stocks);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const createInvoice = () => {
    Axios.post("/api/invoice/create", {
      altinvoice: "",
      counterparty: 0,
      invoicedate: Moment().format("DD.MM.YYYY"),
      scale: scale.value,
      stockfrom: stock.value,
      stockto: stock.value,
      type: "2",
      isweight: true,
    })
      .then((res) => res.data)
      .then((res) => {
        console.log("res: ", res);
        setActiveInvoice(res.text);
        setAddProduct(true);
        setCreateDate(res.createdate);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getScales = () => {
    Axios.get("/api/productsweight/scales/search", {
      params: { point: stock.value },
    })
      .then((res) => res.data)
      .then((res) => {
        const scales = res.map((s) => {
          return {
            label: s.name,
            value: s.id,
          };
        });
        setScales(scales);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getProductsWeight = () => {
    if (!scale || !stock) {
      return nonSelectedAlerts();
    }

    setLoading(true);
    Axios.get("/api/productsweight", {
      params: { point: stock.value, scale: scale.value },
    })
      .then((res) => res.data)
      .then((res) => {
        res.map((e) => {
          if (e.isedited || e.id === null) {
            return setChanging(true);
          } else return "";
        });

        setProductsList(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const handleDeleteOpen = (id) => {
    setDeleteModalOpen(true);
    setEditingId(id);
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
    cleanAlerts();
  };

  const handleAddOpen = () => {
    setAddModalOpen(true);
  };

  const handleAddClose = () => {
    setAddModalOpen(false);
    cleanAlerts();
    clear();
  };

  const closeModal = () => {
    cleanAlerts();
  };

  const clear = () => {
    setStock("");
    setScale("");
    setProductsList([]);
    setSubmitting(false);
    setLoading(false);
    setEditingId("");
    setEditingProduct("");
    setAddProduct(false);
  };

  const cleanAlerts = () => {
    setAddingAmount(false);
    setEditing(false);
    setModalOpen(false);
    setDeleteModalOpen(false);
    setAddModalOpen(false);
    setAddProduct(false);
  };

  const onStockChange = (p) => {
    setStock(p);
  };

  const onScaleChange = (s) => {
    setScale(s);
  };

  const nonSelectedAlerts = () => {
    if (!stock) {
      return Alert.warning("Выберите торговую точку", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else if (!scale) {
      return Alert.warning("Выберите весы", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
  };

  const openAddProduct = () => {
    if (!scale || !stock) {
      return nonSelectedAlerts();
    }
    getFormationInvoice();
  };

  const getFormationInvoice = () => {
    Axios.get("/api/invoice", {
      params: { status: "FORMATION", type: "2", isweight: true },
    })
      .then((res) => res.data)
      .then((res) => {
        if (Object.keys(res).length === 0) {
          createInvoice();
        } else {
          setSweetAlert(
            <SweetAlert
              warning
              showCancel
              confirmBtnText="Продолжить"
              cancelBtnText="Нет, удалить накладную"
              confirmBtnBsStyle="success"
              cancelBtnBsStyle="danger"
              title="Внимание"
              allowEscape={false}
              closeOnClickOutside={false}
              onConfirm={() => openAlert(res)}
              onCancel={() => deleteInvoice(res.invoicenumber)}
            >
              У Вас имеется незавершенная накладная, хотите продолжить
              заполнение?
            </SweetAlert>
          );
        }
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };
  const openAlert = (invoiceInformation) => {
    scales.forEach((e) => {
      if (e.value === invoiceInformation.scale) {
        setScale(e);
      }
    });
    setCreateDate(invoiceInformation.createdate);
    setActiveInvoice(invoiceInformation.invoicenumber);
    setAddProduct(true);
    setSweetAlert(false);
  };

  const handleDelete = () => {
    const changedProductList = JSON.parse(JSON.stringify(productsList));

    let productID, idToDelete;
    changedProductList.forEach((el, idx) => {
      if (idx === editingId) {
        return (el.isdeleted = true);
      }
    });
    changedProductList.forEach((el, idx) => {
      if (idx === editingId) {
        productID = el.productsweight_id;
        idToDelete = el.id;
      }
    });
    setProductsList(changedProductList);
    handleDeleteClose();
    const delete_temp = "/api/productsweight/delete_temp";
    const delete_temp_values = {
      productsweight_id: productID,
    };

    const delete_main = "/api/productsweight/del";
    const delete_main_values = {
      product: idToDelete,
    };
    setSubmitting(true);
    Axios.post(
      !idToDelete ? delete_temp : delete_main,
      !idToDelete ? delete_temp_values : delete_main_values
    )
      .then((data) => {
        return data.data;
      })
      .then((resp) => {
        setSubmitting(false);
        if (resp.code === "success" && idToDelete) {
          Axios.post(
            idToDelete ? delete_temp : delete_main,
            idToDelete ? delete_temp_values : delete_main_values
          )
            .then((data) => {
              return data.data;
            })
            .then((resp) => {
              if (resp.code === "success") {
                getProductsWeight();
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
        } else if (resp.code === "success" && !idToDelete) {
          getProductsWeight();
          Alert.success("Временный товар удален успешно.", {
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

  const handleEdit = (id, oldProduct) => {
    setEditingId(id);
    setEditingProduct(oldProduct);
    setEditing(true);
    setModalOpen(true);
  };

  //удаление инвойса
  const deleteInvoice = (inv) => {
    Axios.post("/api/invoice/delete", {
      invoice: inv,
    })
      .then((data) => {
        return data.data;
      })
      .then((resp) => {
        if (resp.code === "success") {
          Alert.success("Накладная удалена успешно", {
            position: "bottom-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          //https://github.com/Microsoft/TypeScript/issues/28898   - deprecated
          window.location.reload(false);
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
  const goBack = () => {
    setAddProduct(false);
  };

  const updateHotkey = (req) => {
    const info = {
      ...req,
      point: stock.value,
      scale: scale.value,
    };
    Axios.post("/api/productsweight/updatehotkey", info)
      .then((data) => {
        return data.data;
      })
      .then((resp) => {
        if (resp.code === "success") {
          Alert.success("Вы успешно изменили номер на весах", {
            position: "bottom-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          setModalOpen(false);
          getProductsWeight();
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

  return isAddProduct ? (
    <AddProduct
      goBack={goBack}
      productsList={productsList}
      scale={scale}
      point={stock}
      invoiceId={activeInvoice}
      createDate={createDate}
      deleteInvoice={deleteInvoice}
      handleAddOpen={handleAddOpen}
      history={history}
      maxHotKey={
        productsList.length > 0
          ? parseInt(productsList[productsList.length - 1].hotkey, 0) + 1
          : 1
      }
    />
  ) : (
    <div className="container">
      {sweetalert}
      <ReactModal isOpen={isModalOpen} style={customStyles}>
        {isEditing && !isAddingAmount && (
          <EditingProductComponent
            productsList={productsList}
            updateHotkey={updateHotkey}
            editingProduct={editingProduct}
            closeModal={closeModal}
          />
        )}
      </ReactModal>
      <WarningDelete
        handleDelete={handleDelete}
        open={isDeleteModalOpen}
        handleClose={handleDeleteClose}
      />
      <SuccessAdd open={isAddModalOpen} handleClose={handleAddClose} />

      <div className="row">
        <div className="col-md-4 mt-1">
          <label htmlFor="">Склад</label>
          <Select
            value={stock}
            name="stock"
            onChange={onStockChange}
            noOptionsMessage={() => "Склад не найден"}
            options={stocks}
            placeholder="Выберите склад"
          />
        </div>
        <div className="col-md-4 mt-1">
          <label htmlFor="">Весы</label>
          <Select
            value={scale}
            name="scale"
            onChange={onScaleChange}
            noOptionsMessage={() => "Весы не найдены"}
            options={scales}
            placeholder="Выберите весы"
          />
        </div>
        <div className="col-md-3 pw-adding-products-btn">
          <button
            style={{ flex: "auto" }}
            className="btn btn-success"
            disabled={isSubmitting || !scale || !stock}
            onClick={openAddProduct}
          >
            Добавить товар
          </button>
        </div>
        <div style={{ marginTop: "2rem" }} className="col-md-1">
          <IconButton
            aria-label="reload"
            size="small"
            onClick={getProductsWeight}
          >
            <ReplayIcon color="primary" />
          </IconButton>
        </div>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : productsList.length > 0 && !isLoading ? (
        <Fragment>
          <ProductsList
            isSubmitting={isSubmitting}
            productsList={productsList}
            handleDelete={(id) => handleDeleteOpen(id)}
            handleEdit={(id, old) => handleEdit(id, old)}
          />
          <SaveProducts
            handleAddOpen={handleAddOpen}
            isChanging={isChanging}
            isSubmitting={isSubmitting}
            productsList={productsList}
            stock={stock}
            scale={scale}
          />
        </Fragment>
      ) : stock && !scale && !isLoading ? (
        <div className="pw-adding-products-alert">Выберите весы</div>
      ) : (
        <div className="pw-adding-products-alert">Добавьте товары</div>
      )}
    </div>
  );
}
