import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

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

export default function SwitchStyle(props) {
  const [state, setState] = React.useState({
    BIN: props.BIN,
    NDS: props.NDS,
    ZNM: props.ZNM,
    RNM: props.RNM,
  });

  const handleSwitchChange = (name) => (event) => {
    props.handleSwitch(name, event.target.checked);
    setState({ ...state, [name]: event.target.checked });
  };

  return (
    <FormGroup>
      <FormControlLabel
        style={{ marginRight: "0px", cursor: "default" }}
        control={
          <IOSSwitch
            checked={props.BIN}
            onChange={handleSwitchChange("BIN")}
            value="BIN"
          />
        }
      />

      <FormControlLabel
        style={{ marginRight: "0px", cursor: "default" }}
        control={
          <IOSSwitch
            checked={props.NDS}
            onChange={handleSwitchChange("NDS")}
            value="NDS"
          />
        }
      />
      <FormControlLabel
        style={{ marginRight: "0px", cursor: "default" }}
        control={
          <IOSSwitch
            checked={props.ZNM}
            onChange={handleSwitchChange("ZNM")}
            value="ZNM"
          />
        }
      />
      <FormControlLabel
        style={{ marginRight: "0px", cursor: "default" }}
        control={
          <IOSSwitch
            checked={props.RNM}
            onChange={handleSwitchChange("RNM")}
            value="RNM"
          />
        }
      />
    </FormGroup>
  );
}
