import React, { forwardRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Axios from "axios";
import Alert from "react-s-alert";
import Moment from "moment";
import Loading from "../../../Loading";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  buttons: {
    display: "flex",
    justifyContent: "space-around",
  },
}));

// const ThisWillWork = forwardRef((props, ref) => {
//   return <button ref={ref}>Reference</button>;
// });

const WarningBox = forwardRef(
  ({ closeWarning, scale, point, invoiceId, createDate }, ref) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const deleteInvoice = () => {
      Axios.post("/api/productsweight/deleteinvoice", {
        scale,
        point,
      })
        .then((res) => res.data)
        .then((res) => {
          Alert.warning(res.text, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          closeWarning(true, res.id, res.createdate);
        })
        .catch((err) => {
          ErrorAlert(err);
        });
    };

    const handleContinue = () => {
      setOpen(false);
      closeWarning(false, invoiceId, createDate);
    };

    return (
      <Modal
        ref={ref}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
        disableEscapeKeyDown
        disableBackdropClick
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        {invoiceId ? (
          <Fade in={open}>
            <div className={classes.paper}>
              <h4 id="transition-modal-title">
                У вас есть существующая накладная - №: {invoiceId} от{" "}
                {Moment(createDate).format("DD.MM.YYYY HH:mm:ss")}
              </h4>
              <div className={classes.buttons}>
                <button className="btn btn-danger" onClick={deleteInvoice}>
                  Удалить
                </button>
                <button className="btn btn-success" onClick={handleContinue}>
                  Продолжить
                </button>
              </div>
            </div>
          </Fade>
        ) : (
          <Loading />
        )}
      </Modal>
    );
  }
);

export default WarningBox;
