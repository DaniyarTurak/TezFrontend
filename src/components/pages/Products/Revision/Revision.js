import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import RevisionSettings from "./RevisionSettings";
import RevisionProducts from "./RevisionProducts";
import Scanner from "./Scanner";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
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
            <Stepper alternativeLabel activeStep={activeStep}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
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
            {activeStep === 1 &&
                <RevisionProducts
                    revNumber={revNumber}
                    barcode={barcode}
                    setBarcode={setBarcode}
                    hardware={hardware}
                    point={point}
                />
            }
        </Fragment>
    );
};