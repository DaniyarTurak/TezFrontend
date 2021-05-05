import React, { useState, Fragment } from "react";
import Axios from "axios";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import Grid from "@material-ui/core/Grid";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Moment from "moment";
import ReconciliationTable from './ReconciliationTable';
import DetailsTable from './DetailsTable';

export default function ReconciliationPage() {

  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [isLoading, setLoading] = useState(false);
  const [reconciliations, setReconciliations] = useState([]);
  const [isShowDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState({});
  const [selectedID, setSelectedID] = useState(null);

  const changeDate = (dateStr) => {
    let dF, dT;
    if (dateStr === "today") {
      dF = Moment().format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    } else if (dateStr === "month") {
      dF = Moment().startOf("month").format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    }
    setDateFrom(dF);
    setDateTo(dT);
  };

  const dateFromChange = (e) => {
    setDateFrom(e);
  };

  const dateToChange = (e) => {
    setDateTo(e);
  };

  const getReconciliations = () => {
    setLoading(true);
    setSelectedID(null);
    setShowDetails(false);
    setDetails({});
    Axios.get("/api/report/reconciliation/list", { params: { dateFrom: Moment(dateFrom).format("YYYY-MM-DD"), dateTo: Moment(dateTo).format("YYYY-MM-DD") } })
      .then((res) => res.data)
      .then((recons) => {
        setReconciliations(recons);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const getDetails = (data) => {
    setSelectedID(data.id);
    if (parseInt(data.status) !== 2) {
      setDetails(data);
      setShowDetails(true);
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setDetails([]);
  }

  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MaterialDateDefault
            changeDate={changeDate}
            dateFrom={dateFrom}
            dateTo={dateTo}
            dateFromChange={dateFromChange}
            dateToChange={dateToChange}
            searchInvoices={getReconciliations}
          />
        </Grid>
        {isLoading &&
          <Grid item xs={12}>
            <SkeletonTable />
          </Grid>
        }
        {!isLoading && reconciliations.length > 0 && !isShowDetails &&
          <ReconciliationTable reconciliations={reconciliations} getDetails={getDetails} selectedID={selectedID} />
        }
        {
          !isLoading && isShowDetails && details.result.result.length > 0 &&
          <DetailsTable details={details} closeDetails={closeDetails} />
        }
      </Grid>
    </Fragment>
  );
}
