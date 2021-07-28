import React, { Fragment, useState, useEffect } from "react";
import Grid from '@material-ui/core/Grid';
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Quagga from 'quagga';

export default function Scanner({
    barcode,
    setBarcode
}) {

    useEffect(() => {
        initQuagga();
        Quagga.onDetected((data) => {
            Quagga.pause();
            setBarcode(data.codeResult.code);
            restartScan();
        });

        Quagga.onProcessed(function (result) {
            let drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.codeResult && result.codeResult.code) {
                    drawingCtx.clearRect(
                        0,
                        0,
                        parseInt(drawingCanvas.getAttribute("width"), 10),
                        parseInt(drawingCanvas.getAttribute("height"), 10)
                    );
                    Quagga.ImageDebug.drawPath(
                        result.line,
                        { x: "x", y: "y" },
                        drawingCtx,
                        { color: "red", lineWidth: 3 }
                    );
                }
                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
                        color: "#00F",
                        lineWidth: 2,
                    });
                }
            }
        });
    }, []);

    const restartScan = () => {
        Quagga.start();
        let drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;
        drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute("width"), 10),
            parseInt(drawingCanvas.getAttribute("height"), 10)
        );
    };

    const initQuagga = () => {
        Quagga.init(
            {
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector("#scanner"),
                    constraints: {
                        width: 480,
                        height: 320,
                        facingMode: "environment",
                    },
                },
                locator: {
                    patchSize: "medium",
                    halfSample: true,
                },
                numOfWorkers: 4,
                locate: true,
                decoder: {
                    readers: [
                        "code_128_reader",
                        "ean_reader",
                        "ean_8_reader",
                        "code_39_reader",
                        "code_39_vin_reader",
                        "codabar_reader",
                        "upc_reader",
                        "upc_e_reader",
                        "i2of5_reader",
                    ],
                    debug: {
                        showCanvas: true,
                        showPatches: true,
                        showFoundPatches: true,
                        showSkeleton: true,
                        showLabels: true,
                        showPatchLabels: true,
                        showRemainingPatchLabels: true,
                        boxFromPatches: {
                            showTransformed: true,
                            showTransformedBox: true,
                            showBB: true,
                        },
                    },
                },
            },
            function (err) {
                if (err) {
                    console.log(err);
                    return
                }
                Quagga.start();
            }
        );
    }

    return (
        <Fragment>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={12}>
                    <div className="revision-block">
                        <div
                            className="flex video-width video-height"
                            style={{
                                display: "flex",
                                paddingTop: "0px",
                            }}
                        >
                            <div
                                id="scanner"
                                className={`flex center barcode-visible`}
                            ></div>

                        </div>
                    </div>
                </Grid>
            </Grid>
            {barcode}
        </Fragment>
    );
};