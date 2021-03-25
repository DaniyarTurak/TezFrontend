import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import TextField from "@material-ui/core/TextField";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import { withStyles } from "@material-ui/core/styles";
import Axios from "axios";
import Alert from "react-s-alert";

import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const options = [
  { id: 0, name: "увеличилась", discount: 0, checked: false },
  { id: 1, name: "уменьшилась", discount: 0, checked: false },
];

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#52d869",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#52d869",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

export default function AdditionalOptions() {
  const classes = useStyles();
  const [discounts, setDiscounts] = useState(options);

  useEffect(() => {
    getOptions("top_limit");
    getOptions("bottom_limit");
  }, []);

  const getOptions = (name) => {
    Axios.get("/api/settings", { params: { name } })
      .then((res) => res.data)
      .then((res) => {
        let oldDiscount = discounts;
        oldDiscount[name === "top_limit" ? 0 : 1].discount = parseInt(
          res[0].value,
          0
        );
        oldDiscount[name === "top_limit" ? 0 : 1].checked =
          parseInt(res[0].value, 0) > 0 ? true : false;
        setDiscounts([...oldDiscount]);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const handleToggle = (value) => {
    options.forEach((disc) => {
      if (value.id === disc.id) {
        disc.checked = !disc.checked;
      }
      if (value.checked === false && value.id === disc.id) {
        disc.discount = 0;
      }
    });
    setDiscounts([...options]);

    Axios.post("/api/settings/add", {
      settings: [
        {
          name: !value.id ? "top_limit" : "bottom_limit",
          value: value.discount,
        },
      ],
    })
      .then((res) => {
        Alert.success("Вы успешно сохранили настройки уведомления.", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const handleDiscountChange = (option, e) => {
    const value = isNaN(e.target.value) ? 0 : e.target.value;
    if (value > 999) {
      return;
    }
    options.forEach((disc) => {
      if (option.id === disc.id) {
        disc.discount = value;
      }
    });
    setDiscounts([...options]);
  };

  return (
    <List className={classes.root}>
      {discounts.map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem key={value.id} role={undefined} dense>
            <ListItemIcon>
              <IOSSwitch
                checked={value.checked}
                onChange={() => handleToggle(value)}
                name="checkedB"
              />
            </ListItemIcon>
            <ListItemText id={labelId}>
              Показывать уведомление если цена продажи
              {!value.id ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              {value.name} более чем на
              <TextField
                disabled={value.checked}
                id="discount"
                inputProps={{
                  min: 0,
                  style: { textAlign: "center" },
                }}
                style={{
                  width: "3rem",
                  marginLeft: "0.3rem",
                  marginRight: "0.3rem",
                }}
                value={value.discount}
                onChange={(e) => handleDiscountChange(value, e)}
              />
              % от предыдущей цены.
            </ListItemText>
          </ListItem>
        );
      })}
    </List>
  );
}
