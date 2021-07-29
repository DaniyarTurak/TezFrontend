import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import RevisionSettings from "./RevisionSettings";
import RevisionProducts from "./RevisionProducts";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';

export default function Revison() {

    const [revNumber, setRevNumber] = useState(null);
    const [point, setPoint] = useState("");
    const [hardware, setHardware] = useState("scanner");
    const [barcode, setBarcode] = useState("");

    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();

    function getSteps() {
        return ['Параметры ревизии', 'Добавление товаров', 'Завершение ревизии'];
    }

    useEffect(() => {
    }, []);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    return (
        <Fragment>
            <Grid container>
                <Grid item xs={12}>
                    <Stepper alternativeLabel activeStep={activeStep} style={{padding:"20px 0px 40px 0px"}}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
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
                        />
                    }
                </Grid>
            </Grid>
        </Fragment>
    );
};