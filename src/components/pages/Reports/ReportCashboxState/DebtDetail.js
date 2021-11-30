import React, {useState, Fragment} from 'react';
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import { makeStyles } from "@material-ui/core/styles";

  const useStyles = makeStyles(() => ({
    modal: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      background: "white",
      border: "1px solid #000",
      padding: 20,
      borderRadius: 4,
      pt: 2,
      px: 4,
      pb: 3,
    },
  }));
function DebtDetail({rep}) {
    const [openModal, setOpenModal] = useState(false)
    const classes = useStyles();
    const debtModalHandler = () => {
        setOpenModal(true)
    }
    const closeModalHandler = () => {
        setOpenModal(false)
    }

    return (
      <Fragment>
        <p
          onClick={() => {
            debtModalHandler();
            console.log("hello");
            console.log(openModal);
          }}
        >
          {rep.toLocaleString("ru", {
            minimumFractionDigits: 2,
          })}
        </p>
        <Modal
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
          open={openModal}
          onClose={closeModalHandler}
        >
          <Box className={classes.modal}>
            <h2 id="child-modal-title">hello</h2>
            <p id="child-modal-description">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </p>
          </Box>
        </Modal>
      </Fragment>
    );
}

export default DebtDetail
