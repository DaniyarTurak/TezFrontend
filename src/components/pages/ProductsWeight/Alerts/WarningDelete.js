import React from "react";

import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";

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
}));

export default function WarningDelete({ handleDelete, open, handleClose }) {
  const classes = useStyles();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h4 id="transition-modal-title">
            Внимание! Данный весовой товар удалится со всех касс!
          </h4>
          <div
            style={{ display: "flex", justifyContent: "space-around" }}
            className="row"
          >
            <div className="col-md-4 pw-adding-products-btn mt-4">
              <button
                style={{ flex: "auto" }}
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Назад
              </button>
            </div>
            <div className="col-md-4 pw-adding-products-btn mt-4">
              <button
                style={{ flex: "auto" }}
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Удалить товар
              </button>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
