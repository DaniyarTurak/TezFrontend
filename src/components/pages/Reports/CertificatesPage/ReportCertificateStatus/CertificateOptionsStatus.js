import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import AutocompleteSelect from "../../../../ReusableComponents/AutocompleteSelect";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function CertificateOptionsStatus({
  onStatusChange,
  onPointChange,
  point,
  points,
  searchCertificates,
  onCodeChange,
  status,
  statuses,
  code,
  isSearchable
}) {
  return (
    <Fragment>
      <Grid item xs={3}>
        <TextField
          fullWidth
          value={code}
          variant="outlined"
          onChange={onCodeChange}
          label="Номер сертификата"
        />
      </Grid>
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
      <Grid item xs={3}>
        <Button
          disabled={!isSearchable}
          size="large"
          variant="outlined"
          color="primary"
          style={{ width: "12rem", minHeight: "3.4rem", fontSize: ".875rem", textTransform: "none" }}
          onClick={searchCertificates}
        >
          Поиск
        </Button>
      </Grid>
    </Fragment>
  );
}
