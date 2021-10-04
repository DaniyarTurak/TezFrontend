
import React, { useState, useEffect, Fragment } from "react";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";

export default function SellingPrices() {

    return (
        <Fragment>
        <AutocompleteSelect
        //   value={selectedPoint}
        //   onChange={onPointChange}
        //   options={points}
          noOptions="Торговая точка не найдена"
          label="Торговая точка"
        />
        </Fragment>
    )
}
