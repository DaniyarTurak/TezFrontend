import React from "react";

import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import ReplayIcon from "@material-ui/icons/Replay";

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

export default function SuccessAdd({ open, handleClose }) {
  const classes = useStyles();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      disableBackdropClick
      closeAfterTransition
      disableEscapeKeyDown
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h4 className="text-center" id="transition-modal-title">
            Вы успешно выгрузили товар(ы) на кассы!
          </h4>
          <h6 className="text-center" id="transition-modal-title">
            Товары в таблице появятся приблизительно через 30 сек. после
            выгрузки. Для того чтобы обновить статус товаров нажмите на иконку{" "}
            {<ReplayIcon color="primary" />}
          </h6>
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
                Вернуться
              </button>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
