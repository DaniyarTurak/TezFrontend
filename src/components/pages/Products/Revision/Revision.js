import React, { Fragment, useState, useEffect } from "react";
import RevisionSettings from "./RevisionSettings";
import RevisionProducts from "./RevisionProducts";
import RevisonFinish from "./RevisionFinish";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import StepConnector from '@material-ui/core/StepConnector';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Check from '@material-ui/icons/Check';
import SettingsIcon from '@material-ui/icons/Settings';
import ListAltIcon from '@material-ui/icons/ListAlt';
import DoneIcon from '@material-ui/icons/Done';

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#784af4',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 18,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(40,167,69) 0%,rgb(189,189,189) 50%,rgb(23,162,184) 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(40,167,69) 0%,rgb(27,134,87) 50%,rgb(40,167,69) 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 40,
    height: 40,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(23,162,184) 0%, rgb(68,141,149) 50%, rgb(23,162,184) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(40,167,69) 0%, rgb(27,134,87) 50%, rgb(40,167,69) 100%)',
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <ListAltIcon />,
    3: <DoneIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default function Revison() {

  const [revNumber, setRevNumber] = useState(null);
  const [point, setPoint] = useState("");
  const [hardware, setHardware] = useState("scanner");
  const [barcode, setBarcode] = useState("");
  const [revisionProducts, setRevisionProducts] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [admin, setAdmin] = useState("");

  const steps = getSteps();
  const classes = useStyles();
  function getSteps() {
    return ['Параметры ревизии', 'Добавление товаров', 'Завершение ревизии'];
  };

  useEffect(() => {
    setPoint("");
    setRevisionProducts([]);
    setRevNumber(null);
  }, []);

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12}>
          <div className={classes.root}>
            <Stepper alternativeLabel activeStep={activeStep} style={{ padding: "20px 0px 40px 0px" }} connector={<ColorlibConnector />}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
        </Grid>
        <Grid item xs={12}>
          {activeStep === 0 &&
            <RevisionSettings
              setRevNumber={setRevNumber}
              point={point}
              setPoint={setPoint}
              hardware={hardware}
              setHardware={setHardware}
              setActiveStep={setActiveStep}
              setAdmin={setAdmin}
            />
          }
        </Grid>
        <Grid item xs={12}>
          {activeStep === 1 &&
            <RevisionProducts
              revNumber={revNumber}
              barcode={barcode}
              setBarcode={setBarcode}
              hardware={hardware}
              setHardware={setHardware}
              point={point}
              setActiveStep={setActiveStep}
              revisionProducts={revisionProducts}
              setRevisionProducts={setRevisionProducts}
            />
          }
        </Grid>
        <Grid item xs={12}>
          {activeStep === 2 &&
            <RevisonFinish
              revNumber={revNumber}
              point={point}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              revisionProducts={revisionProducts}
              admin={admin}
            />
          }
        </Grid>
      </Grid>
    </Fragment>
  );
};