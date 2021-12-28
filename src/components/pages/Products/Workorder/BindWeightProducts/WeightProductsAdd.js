import React, { Fragment } from 'react'
import { Field } from "redux-form";
import { InputField, InputGroup, SelectField } from "../../../../fields";


function WeightProductsAdd() {
    return (
        <Fragment >
            <div className="add-product-form">
                <div className="row justify-content-center">
                    <div style={{ marginLeft: "2.2rem" }} className="col-md-8 zi-7">
                        <label>Наименование</label>
                        
                            <Field
                                name="name"
                                // disabled={isEditing}
                                component={SelectField}
                                // value={productSelectValue}
                                noOptionsMessage={() => "Товар не найден"}
                                // onChange={productListChange}
                                placeholder="Введите название товара"
                                // onInputChange={onProductListInput.bind(this)}
                                // options={productOptions || []}
                            />
                        
                    </div>
                    
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <label>Штрих код</label>
                        <Field
                            // disabled={isEditing}
                            name="code"
                            component={InputGroup}
                            // placeholder="Внесите вручную, или с помощью сканера"
                            type="text"
                            // className={`form-control ${isLoading ? "loading-btn" : ""}`}
                            // onChange={onBarcodeChange}
                            // onKeyDown={onBarcodeKeyDown}
                            appendItem={
                                <Fragment>
                                    <button
                                        // disabled={isEditing}
                                        className="btn btn-outline-info"
                                        type="button"
                                        // onClick={() => handleSearch()}
                                    >
                                        Поиск
                                    </button>
                                    <button
                                        // disabled={isEditing}
                                        className="btn btn-outline-info"
                                        type="button"
                                        // onClick={generateBarcode}
                                    >
                                        Сгенерировать
                                    </button>
                                </Fragment>
                            }
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default WeightProductsAdd
