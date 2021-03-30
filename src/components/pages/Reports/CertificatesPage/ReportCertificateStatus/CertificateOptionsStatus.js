import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import AutocompleteSelect from "../../../../ReusableComponents/AutocompleteSelect";

export default function CertificateOptionsStatus({
  onStatusChange,
  onPointChange,
  point,
  points,
  status,
  statuses,
}) {
  return (
    <Fragment>
      <Grid item xs={3}>
        <AutocompleteSelect
          value={status}
          onChange={onStatusChange}
          options={statuses}
          noOptions="Статусы не найдены"
          label="Статус"
        />
      </Grid>

      <Grid item xs={3}>
        <AutocompleteSelect
          value={point}
          onChange={onPointChange}
          options={points}
          noOptions="Торговые точки не найдены"
          label="Торговая точка"
        />
      </Grid>
    </Fragment>
  );
}
