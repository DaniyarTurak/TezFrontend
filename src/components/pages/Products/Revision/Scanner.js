import React, { Fragment, useState, useEffect } from "react";
import Grid from '@material-ui/core/Grid';
import Quagga from 'quagga';
import "../../../../sass/revision.sass";
export default function Scanner({
    setBarcode,
    debouncedRestartScanner,
    hardware
}) {

    const [activated, setActivated] = useState(false);

    useEffect(() => {
        if (hardware !== "camera" && activated) {
            Quagga.stop();
            setActivated(false);
        }
    }, [hardware]);

    useEffect(() => {
        if (hardware === "camera") {
            initQuagga();
        }
    }, [debouncedRestartScanner]);

    useEffect(() => {
        if (hardware === "camera") {
            initQuagga();
            Quagga.onDetected((data) => {
                Quagga.pause();
                setBarcode(data.codeResult.code);
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
        };
    }, [hardware]);

    const initQuagga = () => {
        Quagga.init(
            {
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector("#scanner"),
                    constraints: {
                        width: 460,
                        height: 300,
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
                setActivated(true);
            }
        );
    }

    return (
        <Fragment>
            {hardware === "camera" &&
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
            }
        </Fragment>
    );
};