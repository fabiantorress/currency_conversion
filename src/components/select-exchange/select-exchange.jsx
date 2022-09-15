import * as React from "react";
import './select-exchange.styles.css'

function SelectExchange({setCurrency, currency, currenciesToMap, labelText}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor="currency" className="labelText">
        {labelText}
      </label>
      <select
        id="currency"
        className="box"
        onChange={(event) => {
            setCurrency(event.target.value);
        }}
        value={currency}
      >
        {currenciesToMap
          ? Object.entries(currenciesToMap).map(([k, v]) => {
              return (
                <option className="currency-options">
                  {k} - {v.name}
                </option>
              );
            })
          : null}
      </select>
    </div>
  );
}

export default SelectExchange;
