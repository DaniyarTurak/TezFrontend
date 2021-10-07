
import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import WorkorderOptions from "./WorkorderOptions";
import WorkorderAddProducts from "./WorkorderAddProducts";
import WorkorderTable from "./WorkorderTable";
import WorkorderList from "./WorkorderList";

export default function WorkorderPage() {

  const [point, setPoint] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [onlyView, setOnlyView] = useState(false);
  const [workorderId, setWorkorderId] = useState("");
  const [workorderNumber, setWorkorderNumber] = useState("");
  const [workorderProducts, setWorkorderProducts] = useState([]);

  const getWorkorderProducts = (workorder_id) => {
    Axios.get("/api/workorder/details", { params: { workorder_id: workorderId || workorder_id } })
      .then((res) => res.data)
      .then((products) => {
        let temp = [];
        products.forEach(prod => {
          temp.push({ ...prod, temp_units: prod.units });
        });
        setWorkorderProducts(temp);
      })
      .catch((err) => console.log(err));
  };

  const clearOptions = () => {
    setPoint("");
    setCounterparty("");
    setWorkorderId("");
  }

  return (
    <Fragment>
      {workorderId === "" ?
        <Fragment>
          <WorkorderOptions
            point={point}
            setPoint={setPoint}
            counterparty={counterparty}
            setCounterparty={setCounterparty}
            workorderId={workorderId}
            setWorkorderId={setWorkorderId}
            workorderNumber={workorderNumber}
            setWorkorderNumber={setWorkorderNumber}
            setWorkorderProducts={setWorkorderProducts}
            getWorkorderProducts={getWorkorderProducts}
          />
          <hr />
          <WorkorderList
            setOnlyView={setOnlyView}
            setPoint={setPoint}
            setCounterparty={setCounterparty}
            setWorkorderId={setWorkorderId}
            getWorkorderProducts={getWorkorderProducts}
            setWorkorderNumber={setWorkorderNumber}
          />
        </Fragment>
        :
        <Fragment>
          <WorkorderAddProducts
            workorderId={workorderId}
            setWorkorderId={setWorkorderId}
            workorderNumber={workorderNumber}
            point={point}
            setPoint={setPoint}
            counterparty={counterparty}
            setCounterparty={setCounterparty}
            workorderProducts={workorderProducts}
            setWorkorderProducts={setWorkorderProducts}
            getWorkorderProducts={getWorkorderProducts}
            onlyView={onlyView}
            setOnlyView={setOnlyView}
          />
          <WorkorderTable
            workorderProducts={workorderProducts}
            workorderId={workorderId}
            setWorkorderId={setWorkorderId}
            setWorkorderProducts={setWorkorderProducts}
            getWorkorderProducts={getWorkorderProducts}
            clearOptions={clearOptions}
            onlyView={onlyView}

          />
        </Fragment>}
    </Fragment>
  )
}
