import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Moment from "moment";
import _ from "lodash";
import CashboxDetails from "./CashboxDetails";
import RestOfCash from "./RestOfCash";
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
import Zreports from "./Zreports";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

const ColorButton = withStyles(() => ({
  root: {
    borderColor: "#17a2b8",
    color: "#17a2b8",
    fontSize: ".875rem",
    textTransform: "none",
    minWidth: "11rem",
    margin: ".1rem",
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

const StyledMenu = withStyles()((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
));

export default function ReportCashboxState({ company, holding }) {
  const [cashboxstate, setCashboxstate] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [cashbox, setCashbox] = useState([]);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [reportsModalIsOpen, setReportsModalIsOpen] = useState(false);

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

  const handleZreport = (cashbox) => {
    setCashbox(cashbox);
    setReportsModalIsOpen(true);
  };

  const closeDetail = () => {
    setCashbox(null);
    setModalOpen(false);
  };
  const closeReports = () => {
    setCashbox(null);
    setReportsModalIsOpen(false);
  };

  const closeMenu = () => {
    setMenuOpened(null);
  };
  const [menuOpened, setMenuOpened] = useState(null);

  const openMenu = (event) => {
    setMenuOpened(event.currentTarget);
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
      {reportsModalIsOpen && (
        <Zreports
          reportsModalIsOpen={reportsModalIsOpen}
          setReportsModalIsOpen={setReportsModalIsOpen}
          holding={holding}
          cashbox={cashbox}
          closeReports={closeReports}
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
                <StyledCell>Пользователь</StyledCell>
                <StyledCell>Статус</StyledCell>
                <StyledCell align="center">
                  Время (открытия / закрытия)
                </StyledCell>
                <StyledCell align="center">
                  <Tooltip
                    title={
                      <p style={{ padding: "0px", fontSize: ".875rem" }}>
                        Остаток наличности в кассе
                      </p>
                    }
                  >
                    <span style={{ cursor: "pointer" }}>Остаток в кассе*</span>
                  </Tooltip>
                </StyledCell>
                <StyledCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {cashboxstate.map((state, idx) => {
                return (
                  <Fragment key={idx}>
                    <TableRow>
                      <StyledCell className="bg-info text-white" colSpan={6}>
                        {state.point}
                      </StyledCell>
                    </TableRow>

                    {state.cashboxes.map((cashbox, idx) => {
                      return (
                        <TableRow key={idx}>
                          <StyledCell>{cashbox.name}</StyledCell>
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
                          <StyledCell align="center">
                            <RestOfCash
                              key={idx}
                              cashbox={cashbox.id}
                              shiftnumber={cashbox.shiftnumber}
                            />
                          </StyledCell>
                          <StyledCell>
                            <IconButton onClick={openMenu}>
                              <MoreVertIcon />
                            </IconButton>
                            <StyledMenu
                              anchorEl={menuOpened}
                              keepMounted
                              open={Boolean(menuOpened)}
                              onClose={closeMenu}
                            >
                              <MenuItem>
                                <ColorButton
                                  variant="outlined"
                                  onClick={() => handleZreport(cashbox)}
                                >
                                  Отчёт по сменам
                                </ColorButton>
                              </MenuItem>
                              <MenuItem>
                                <ColorButton
                                  variant="outlined"
                                  onClick={() => handleCashbox(cashbox)}
                                >
                                  Кассовые Ордера
                                </ColorButton>
                              </MenuItem>
                            </StyledMenu>
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
