import React, {useState, Fragment, useEffect} from 'react';
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import Axios from "axios";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

  const useStyles = makeStyles(() => ({
    modal: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 800,
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


function DebtDetail({rep, shiftNumber}) {
    const [openModal, setOpenModal] = useState(false)
    const [debtDetails, setDebtDetails] = useState([])
    const classes = useStyles();
    const debtModalHandler = () => {
        setOpenModal(true)
    }
    const closeModalHandler = () => {
        setOpenModal(false)
    }

    useEffect(() => {
      getDebtDetail(shiftNumber)
    }, [rep])

    const getDebtDetail = (shiftnumber) => {
      Axios.get("/api/cashbox/debt_details", {params: {shiftnumber: shiftnumber}})
        .then((res) => res.data)
        .then((result) => {
          setDebtDetails(result)
        })
        .catch((err) => {
          ErrorAlert(err);
        });
    }
    return (
      <Fragment>
        <p
          onClick={() => {
            debtModalHandler();
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
            <h6>Список клиентов за текущую смену</h6>
            <TableContainer
              component={Paper}
              style={{ marginTop: "1rem", marginBottom: "1rem" }}
            >
              <Table id="table-to-xls">
                <TableHead>
                  <TableRow>
                    <StyledCell>Имя</StyledCell>
                    <StyledCell>Оплачена в долг</StyledCell>
                    <StyledCell>Общий долг</StyledCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {debtDetails.map((data) => {
                    return (
                    <TableRow key={data.name}>
                      <StyledCell>
                        {data.name}
                      </StyledCell>
                      <StyledCell>
                        {data.currdebt}
                      </StyledCell>
                      <StyledCell>
                        {data.totaldebt}
                      </StyledCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Modal>
      </Fragment>
    );
}

export default DebtDetail
