import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Box from '@mui/material/Box';

export default function SingleMonthDate({
    date,
    onDateChange
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box m={2}>
        <DatePicker
          inputFormat="yyyy-MM"
          views={['year', 'month']}
          label="Год и Мес."
          minDate={new Date('2020-01-01')}
          maxDate={new Date('2022-05-20')}
          value={date}
          onChange={onDateChange}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        />
      </Box>
    </LocalizationProvider>
  );
}

