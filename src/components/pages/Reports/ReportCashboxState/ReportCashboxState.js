import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Moment from "moment";
import _ from "lodash";
import CashboxDetails from "./CashboxDetails";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

const ColorButton = withStyles(() => ({
  root: {
    borderColor: "#17a2b8",
    color: "#17a2b8",
    fontSize: ".875rem",
    textTransform: "none",
  },
}))(Button);

const StyledCell = withStyles((theme) => ({
  head: {
    color: theme.palette.common.black,
    fontSize: ".875rem",
    fontWeight: "bold",
  },
  body: {
    fontSize: ".875rem",
  },
}))(TableCell);

export default function ReportCashboxState({ company, holding }) {
  const [cashboxstate, setCashboxstate] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [cashbox, setCashbox] = useState([]);
  const [modalIsOpen, setModalOpen] = useState(false);

  useEffect(
    () => {
      getCashboxState();
    },
    company ? [company.value] : []
  );

  const getCashboxState = () => {
    const comp = company ? company.value : "";
    if (!holding) {
      holding = false;
    }
    Axios.get("/api/report/cashbox/state", {
      params: { company: comp, holding },
    })
      .then((res) => res.data)
      .then((state) => {
        const temp = _.mapValues(_.groupBy(state, "point"), (list) =>
          list.map((cashbox) => _.omit(cashbox, "point"))
        );
        const cashboxstate = Object.keys(temp).map((key) => {
          return {
            point: key,
            cashboxes: temp[key],
          };
        });
        setCashboxstate(cashboxstate);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        ErrorAlert(err);
      });
  };

  const handleCashbox = (cashbox) => {
    setCashbox(cashbox);
    setModalOpen(true);
  };

  const closeDetail = () => {
    setCashbox(null);
    setModalOpen(false);
  };

  return (
    <div>
      {modalIsOpen && (
        <CashboxDetails
          modalIsOpen={modalIsOpen}
          setModalOpen={setModalOpen}
          holding={holding}
          cashbox={cashbox}
          closeDetail={closeDetail}
          company={company ? company : ""}
        />
      )}
      {isLoading && <SkeletonTable />}

      {!isLoading && isError && (
        <div className="row text-center">
          <div className="col-md-12 not-found-text">
            Произошла ошибка. Попробуйте позже.
          </div>
        </div>
      )}

      {!isLoading && !isError && cashboxstate.length === 0 && (
        <div className="row text-center">
          <div className="col-md-12 not-found-text">Кассы не найдены</div>
        </div>
      )}

      {!isLoading && !isError && cashboxstate.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledCell>Наименование</StyledCell>
                <StyledCell />
                <StyledCell>Пользователь</StyledCell>
                <StyledCell>Статус</StyledCell>
                <StyledCell align="center">
                  Время (открытия / закрытия)
                </StyledCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cashboxstate.map((state, idx) => {
                return (
                  <Fragment key={idx}>
                    <TableRow>
                      <StyledCell className="bg-info text-white" colSpan={5}>
                        {state.point}
                      </StyledCell>
                    </TableRow>

                    {state.cashboxes.map((cashbox, idx) => {
                      return (
                        <TableRow key={idx}>
                          <StyledCell>{cashbox.name}</StyledCell>
                          <StyledCell>
                            <ColorButton
                              variant="outlined"
                              onClick={() => handleCashbox(cashbox)}
                            >
                              Кассовые Ордера
                            </ColorButton>
                          </StyledCell>
                          <StyledCell>{cashbox.person}</StyledCell>
                          <StyledCell>
                            {(cashbox.state === "CLOSE" && (
                              <span className="text-danger">Закрыта</span>
                            )) ||
                              (cashbox.state === "OPEN" && (
                                <span className="text-success">Открыта</span>
                              )) ||
                              (cashbox.state === "NOACTIVITY" && (
                                <span className="text-secondary">
                                  Не было активности
                                </span>
                              )) ||
                              (cashbox.state === "NOTCLOSED" && (
                                <span className="text-danger">Не закрыта</span>
                              ))}
                          </StyledCell>
                          <StyledCell className="text-center">
                            {cashbox.operdate &&
                              Moment(cashbox.operdate).format(
                                "DD.MM.YYYY HH:mm:ss"
                              )}
                          </StyledCell>
                        </TableRow>
                      );
                    })}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
