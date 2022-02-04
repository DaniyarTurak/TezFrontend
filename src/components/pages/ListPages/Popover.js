import React, { Fragment } from 'react';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    hover: {
      fontSize: "14px",
      cursor: "pointer",
      color: "#162ece",
      "&:hover": {
        color: "#09135b",
      },
    },
    padding: {
        padding: "5px"
    }
  }));
  


function CustomPopover({ erpuser }) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <a onClick={handleClick} className={classes.hover}>
                Посмотреть все
            </a>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography className={classes.padding}>
                    {erpuser.accesses.map((access) => (
                        <Fragment
                            key={erpuser.id + access.id}
                        >
                            {access.name}
                            <br />
                        </Fragment>
                    ))}
                </Typography>

            </Popover>
        </div>
    );
}

export default CustomPopover;
