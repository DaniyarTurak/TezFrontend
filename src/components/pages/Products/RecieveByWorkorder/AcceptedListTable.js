
import React, { Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Moment from "moment";
import VisibilityIcon from '@material-ui/icons/Visibility';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import LinearProgress from '@material-ui/core/LinearProgress';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 5,
        borderRadius: 2,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 2,
        backgroundColor: '#17a2b8',
    },
}))(LinearProgress);

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

export default function AcceptedListTable({
    workorderList,
    setWorkorderId,
    setOnlyView,
    setActivePage,
    isLoading
}) {

    // const workOrderToExcel = () => {
    //     setLoading(true);
    //     Axios({
    //         method: "POST",
    //         url: "/api/workorder/createdtoexcel",
    //         data: { workorderList },
    //         responseType: "blob",
    //     })
    //         .then((res) => res.data)
    //         .then((res) => {
    //             const url = window.URL.createObjectURL(new Blob([res]));
    //             const link = document.createElement("a");
    //             link.href = url;
    //             link.setAttribute("download", `Заказ-наряд.xlsx`);
    //             document.body.appendChild(link);
    //             link.click();
    //             setLoading(false);
    //             clearOptions();
    //         })
    //         .catch((err) => {
    //             ErrorAlert(err);
    //             setLoading(false);
    //         });
    // }
    // const startRecieving = () => {

    // }
    return (
        <Fragment>
            <Grid
                container
                spacing={2}
            >
                {isLoading &&
                    <Grid item xs={12}>
                        <BorderLinearProgress />
                    </Grid>
                }
                {workorderList.length === 0 && !isLoading &&
                    <Grid item xs={12}>
                        У Вас пока нет принятых заказ-нарядов
                    </Grid>
                }
                {!isLoading && workorderList.length > 0 && <Grid item xs={12}>
                    <TableContainer
                        component={Paper}
                        style={{ boxShadow: "0px -1px 1px 1px white" }}
                    >
                        <Table id="table-to-xls">
                            <TableHead>
                                <TableRow style={{ fontWeight: "bold" }} >
                                    <StyledTableCell align="center">
                                        № заказ-наряда
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Торговая точка
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Пользователь
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Дата создания
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Дата обработки
                                    </StyledTableCell>
                                    <StyledTableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {workorderList
                                    .map((wo, idx) => (
                                        <TableRow key={idx}>
                                            <StyledTableCell align="center">
                                                {wo.workorder_number}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {wo.point_name}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {wo.username}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {Moment(wo.date).format("DD.MM.YYYY HH:mm:ss")}
                                            </StyledTableCell >
                                            <StyledTableCell align="center">
                                                {wo.accept_date ? Moment(wo.accept_date).format("DD.MM.YYYY HH:mm:ss") : "-"}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <IconButton onClick={() => { setWorkorderId(wo.id); setOnlyView(true); setActivePage(2) }}>
                                                    <VisibilityIcon size="small" />
                                                </IconButton>
                                                <IconButton onClick={() => { setWorkorderId(wo.id); setActivePage(2); console.log(wo.id); }}>
                                                    <PlaylistAddCheckIcon size="small" />
                                                </IconButton>
                                            </StyledTableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>}
            </Grid>
        </Fragment >
    )
}
