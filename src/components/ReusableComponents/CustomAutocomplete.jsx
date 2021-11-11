import React from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";



export default function CustomAutocomplete({
  placeholder,
  params,
}) {

  const useStyles = makeStyles(theme =>
    createStyles({
      root: {
          '& label.Mui-focused': {
              color: '#17a2b8',
          },
          '& .MuiInput-underline:after': {
              borderBottomColor: '#17a2b8',
          },
          '& .MuiOutlinedInput-root': {
              '& fieldset': {
                  borderColor: '#ced4da',
              },
              '&:hover fieldset': {
                  border: '2px solid #17a2b8',
              },
              '&.Mui-focused fieldset': {
                  border: '2px solid #17a2b8',
              },
          },
      },
  })
);
  const classes = useStyles();

  return (
    <TextField
      classes={{
        root: classes.root,
      }}
      {...params}
      placeholder={placeholder}
      variant="outlined"
      size="small"
    />
  );
}
