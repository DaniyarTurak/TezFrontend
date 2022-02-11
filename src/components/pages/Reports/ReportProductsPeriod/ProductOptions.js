import React, { Fragment } from "react";
import SingleMonthDate from "../../../ReusableComponents/SingleMonthDate";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Moment from "moment";
import TextField from "@material-ui/core/TextField";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";

export default function ProductOptions({
  attribute,
  attributes,
  attributeTypes,
  attrval,
  date,
  dateAttrval,
  setDateAttrval,
  selectedStock,
  stockList,
  handleSearch,
  onAttributeChange,
  onAttributeTextFieldChange,
  onAttributeTypeChange,
  onDateChange,
  onStockChange,
}) {
  return (
    <Fragment>
      <Grid item xs={12}>
        <SingleMonthDate date={date} onDateChange={onDateChange} />
      </Grid>

      <Grid item xs={3}>
        <AutocompleteSelect
          value={selectedStock}
          onChange={onStockChange}
          options={stockList}
          noOptions="Склад не найден"
          label="Склад"
        />
      </Grid>

      <Grid item xs={3}>
        <AutocompleteSelect
          value={attribute}
          onChange={onAttributeChange}
          options={attributes}
          noOptions="Атрибут не найден"
          label="Атрибуты"
        />
      </Grid>

      {attribute.value === "@" && (
        <Grid item xs={3}>
          <AutocompleteSelect
            value={attribute}
            isDisabled={true}
            options={attributes}
            noOptions="Атрибут не найден"
            label="Значение Атрибута"
          />
        </Grid>
      )}

      {attribute.format === "TEXT" && (
        <Grid item xs={3}>
          <TextField
            value={attrval}
            onChange={onAttributeTextFieldChange}
            label="Значение Атрибута"
          />
        </Grid>
      )}

      {attribute.format === "SPR" && (
        <Grid item xs={3}>
          <AutocompleteSelect
            value={attrval}
            onChange={onAttributeTypeChange}
            options={attributeTypes}
            noOptions="Атрибут не найден"
            label="Значение Атрибута"
          />
        </Grid>
      )}

      {attribute.format === "DATE" && (
        <Grid item xs={3}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
            <KeyboardDatePicker
              label={"Выберите дату"}
              value={dateAttrval}
              renderInput={(params) => <TextField {...params} />}
              onChange={(newValue) => {
                setDateAttrval(Moment(newValue).format("YYYY-MM-DD"));
              }}
              disableToolbar
              autoOk
              variant="inline"
              format="dd.MM.yyyy"
              InputProps={
                dateAttrval && {
                  startAdornment: (
                    <IconButton
                      onClick={() => {
                        setDateAttrval(null);
                      }}
                      disabled={!dateAttrval}
                      style={{ order: 1 }}
                    >
                      <ClearIcon color="disabled" fontSize="small" />
                    </IconButton>
                  ),
                }
              }
            />
          </MuiPickersUtilsProvider>
        </Grid>
      )}

      <Grid item xs={3}>
        <Button
          style={{
            minHeight: "3.5rem",
            fontSize: ".875rem",
            textTransform: "none",
          }}
          variant="outlined"
          color="primary"
          fullWidth
          //disabled={isLoading}
          size="large"
          onClick={handleSearch}
        >
          Поиск
        </Button>
      </Grid>
    </Fragment>
  );
}

function filterValues(array, attr) {
  if (attr.label === "Все") {
    return array;
  }
  return array
    .map((point) => {
      return point.value === attr.value || point.label === "Все" ? point : null;
    })
    .filter((point) => point !== null);
}
