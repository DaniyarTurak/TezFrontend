import React, { Fragment, useState, useEffect } from "react";
import Moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import DeleteIcon from '@material-ui/icons/DeleteForever';
import DescriptionIcon from '@material-ui/icons/Description';
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Alert from "react-s-alert";
import "moment/locale/ru";
Moment.locale("ru");

export default function ReconciliationTable({ reconciliations }) {

    const [isLoading, setLoading] = useState(false);

    const StyledTableCell = withStyles((theme) => ({
        head: {
            background: "#17a2b8",
            color: theme.palette.common.white,
            fontSize: ".875rem",
        },
        body: {
            fontSize: ".875rem",
        },
        footer: {
            fontSize: ".875rem",
            fontWeight: "bold",
        },
    }))(TableCell);

    const deleteReconciliation = (id) => {
        setLoading(true);
        const reqdata = {
            id: id
        }
        Axios.post("/api/reconciliation/delete", reqdata)
            .then((result) => {
                setLoading(false);
            })
            .catch((err) => {
                Alert.error(
                    err.response.data.code === "internal_error"
                        ? this.state.alert.raiseError
                        : err.response.data.text,
                    {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    }
                );
                setLoading(false);
            });
    };

    const downloadFile = (begin_date, out_data) => {
        setLoading(true);
        let arr = [];
        const date = `recon_${Moment(begin_date).format("L").split(".").join("")}.txt`;
        out_data.map((product, idx) =>
            arr.push(
                Object.values({
                    a: product.code,
                    b: product.name,
                })
            )
        )
        Axios({
            method: "POST",
            url: "/api/reconciliation/to-text",
            data: {
                arr,
                date,
            },
            responseType: "blob",
        })
            .then((data) => {
                return data.data;
            })
            .then((resp) => {
                return Axios.get("/api/reconciliation/download", {
                    responseType: "blob",
                    params: { date },
                })
                    .then((res) => res.data)
                    .then((response) => {
                        const url = window.URL.createObjectURL(
                            new Blob(
                                [
                                    "",
                                    response,
                                ],
                            )
                        );
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", date);
                        document.body.appendChild(link);
                        link.click();
                        setLoading(false);
                    });
            })
            .catch((err) => {
                ErrorAlert(err);
                setLoading(false);
            });
    };

    return (
        <Fragment>
            <Grid item xs={12}>
                <TableContainer component={Paper} style={{ boxShadow: "0px -1px 1px 1px white" }}>
                    <Table id="table-to-xls">
                        <TableHead >
                            <TableRow style={{ fontWeight: "bold" }} >
                                <StyledTableCell rowSpan="2" align="center">
                                    Номер сверки
                                </StyledTableCell>
                                <StyledTableCell rowSpan="2" align="center">
                                    Дата начала
                                </StyledTableCell>
                                <StyledTableCell rowSpan="2" align="center">
                                    Статус
                                </StyledTableCell>
                                <StyledTableCell rowSpan="2" align="center">
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reconciliations
                                .map((recon, idx) => (
                                    <TableRow key={idx} >
                                        <StyledTableCell align="center">{recon.id}</StyledTableCell>
                                        <StyledTableCell align="center">{Moment(recon.begin_date).format('LLL')}</StyledTableCell>
                                        <StyledTableCell align="center" style={{ color: "#28a745" }}>Не завершена</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <IconButton
                                                onClick={() => downloadFile(recon.begin_date, recon.out_data.out_data)}
                                                disabled={isLoading}
                                                title="Выгрузить файл для ТСД"
                                            >
                                                <DescriptionIcon
                                                    size="small"
                                                />
                                            </IconButton>
                                            <IconButton
                                                disabled={isLoading}
                                                title="Удалить сверку"
                                                onClick={() => deleteReconciliation(recon.id)}
                                            >
                                                <DeleteIcon
                                                    size="small"
                                                />
                                            </IconButton>
                                        </StyledTableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Fragment>
    );
}
