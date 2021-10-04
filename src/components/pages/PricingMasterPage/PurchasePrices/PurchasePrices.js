
import React, { useState, useEffect, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import Select from "react-select";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import PurchasePricesOptions from "./PurchasePricesOptions";
import PurchasePriceAdd from "./PurchasePriceAdd";

export default function PurchasePrices() {

  const [point, setPoint] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [workorderId, setWorkorderId] = useState("");

  return (
    <Fragment>
      {workorderId === "" ? <PurchasePricesOptions
        point={point}
        setPoint={setPoint}
        counterparty={counterparty}
        setCounterparty={setCounterparty}
        workorderId={workorderId}
        setWorkorderId={setWorkorderId}
      /> :
        <PurchasePriceAdd
          workorderId={workorderId}
        />}
    </Fragment>
  )
}
