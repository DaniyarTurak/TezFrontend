import React, { Fragment, useState, useEffect } from "react";
import RevisionSettings from "./RevisionSettings";
import RevisionProducts from "./RevisionProducts";
import RevisonFinish from "./RevisionFinish";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';

export default function Revison() {

    const [revNumber, setRevNumber] = useState(null);
    const [point, setPoint] = useState("");
    const [hardware, setHardware] = useState("scanner");
    const [barcode, setBarcode] = useState("");
    const [revisionProducts, setRevisionProducts] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();

    function getSteps() {
        return ['Параметры ревизии', 'Добавление товаров', 'Завершение ревизии'];
    }

    useEffect(() => {
    }, []);

    return (
        <Fragment>
            <Grid container>
                <Grid item xs={12}>
                    <Stepper alternativeLabel activeStep={activeStep} style={{ padding: "20px 0px 40px 0px" }}>
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

                        />
                    }
                </Grid>
            </Grid>
        </Fragment>
    );
};