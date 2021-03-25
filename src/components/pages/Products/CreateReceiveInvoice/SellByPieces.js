import React, { Fragment } from "react";
import { Field } from "redux-form";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { InputGroup } from "../../../fields";
import {
  RequiredField,
  LessThanZero,
  NotEqualZero,
  LessThanTwo,
} from "../../../../validation";

export default function SellByPieces({
  sellByPieces,
  onSellByPiecesChange,
  onPieceAmountChange,
  onPiecePriceChange,
}) {
  return (
    <div className="row justify-content-center">
      <div className="col-md-2">
        <FormControlLabel
          control={
            <Checkbox
              checked={sellByPieces}
              onChange={onSellByPiecesChange}
              name="checkedB"
              color="primary"
            />
          }
          label="Продажа поштучно"
        />
      </div>
      <Fragment>
        <div className="col-md-3">
          <label>Количество в упаковке/пачке(мин. 2)</label>
          <Field
            name="pieceinpack"
            component={InputGroup}
            disabled={!sellByPieces}
            placeholder="Внесите количество"
            type="number"
            className="form-control"
            onWheel={(event) => event.currentTarget.blur()}
            onChange={onPieceAmountChange}
            //parse={(val) => parseInt(val, 0)}
            validate={
              sellByPieces ? [RequiredField, LessThanTwo, NotEqualZero] : []
            }
          />
        </div>

        <div className="col-md-3">
          <label>Цена за одну шт.</label>
          <Field
            name="pieceprice"
            component={InputGroup}
            disabled={!sellByPieces}
            type="number"
            appendItem={<span className="input-group-text">&#8376;</span>}
            className="form-control"
            onWheel={(event) => event.currentTarget.blur()}
            onChange={onPiecePriceChange}
            autocomplete="off"
            validate={
              sellByPieces ? [RequiredField, LessThanZero, NotEqualZero] : []
            }
          />
        </div>
      </Fragment>
    </div>
  );
}
