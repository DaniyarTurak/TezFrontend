import React, {useState, Fragment} from 'react';
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

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
  const StyledCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#17a2b8",
      color: theme.palette.common.white,
      fontSize: ".875rem",
    },
    body: {
      fontSize: ".875rem",
    },
    footer: {
      color: theme.palette.common.black,
      fontSize: ".875rem",
      fontWeight: "bold",
    },
  }))(TableCell);


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
            <h6 id="child-modal-title">hello</h6>
            <p id="child-modal-description">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </p>
          </Box>
        </Modal>
      </Fragment>
    );
}

export default DebtDetail
