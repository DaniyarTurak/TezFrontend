import React, { Fragment } from "react";
import SingleMonthDate from "../../../ReusableComponents/SingleMonthDate";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
  
export default function ProductOptions({
    attribute,
    attributes,
    date,
    sprvalue,
    sprvalues,
    selectedStock,
    stockList,
    handleSearch,
    onAttributeChange,
    onDateChange,
    onSprChange,
    onStockChange,
}) {
    
    const arrSpr = filterValues(sprvalues, attribute);

    return (
        <Fragment>
            <Grid item xs={12}>
                <SingleMonthDate
                date={date}
                onDateChange={onDateChange}
                />
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

            <Grid item xs={3}>
                <AutocompleteSelect
                value={sprvalue}
                onChange={onSprChange}
                options={arrSpr}
                noOptions="Значение аттрибутов"
                label="Значение"
                />  
            </Grid>

            
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
    if (attr.label === 'Все') {
        return array;
    }
    return array.map((point) => {
        return (point.value === attr.value || point.label === 'Все') ? point : null
    }).filter((point) => point !== null);   
    
}