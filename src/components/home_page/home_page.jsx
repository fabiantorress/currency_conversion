import * as React from "react";
import "./home_page.styles.css";
import * as axios from "axios";
import SelectExchange from "../select-exchange/select-exchange";
import { BsExclamationCircle } from "react-icons/bs";
import { MdOutlineChangeCircle } from "react-icons/md";
import TitleConverter from "../title/title";
import Spinner from "../spinner/spinner";
import { formatDate } from "../../utils/misc";

const defaultMoneytoChange = "USD - US Dollar";
const defaultMoneyChanged = "EUR - Euro";
const defaultInputMoney = 1.0;

function HomePage() {
  const [currencies, setCurrencies] = React.useState();
  const [currencyToChange, setCurrencyToChange] =
    React.useState(defaultMoneytoChange);
  const [currencyChanged, setCurrencyChanged] =
    React.useState(defaultMoneyChanged);

  const [dataRates, setDataRates] = React.useState();

  const [valueInput, setValueInput] = React.useState(
    defaultInputMoney.toFixed(2)
  );

  const [status, setStatus] = React.useState("loading");

  const isLoading = status === "loading";
  const isResolved = status === "resolved";
  const isRejected = status === "rejected";

  React.useEffect(() => {
    async function getCurrencies() {
      const response = await axios.get("https://api.vatcomply.com/currencies");
      setCurrencies(response.data);
      setStatus("resolved");
    }
    setTimeout(() => {
      getCurrencies();
    }, 1000);
  }, []);

  React.useEffect(() => {
    async function getRates() {
      if (currencyToChange) {
        const symbolCurrency = currencyToChange.split(" -")[0];
        const response = await axios.get("https://api.vatcomply.com/rates", {
          params: { base: symbolCurrency },
        });
        setDataRates(response.data);
      }
    }
    getRates();
  }, [currencyToChange]);

  const symbolCurrencyChanged = currencyChanged
    ? currencyChanged.split(" -")[0]
    : "EUR";

  function handlerInput(event) {
    if (event.target.validity.valid) {
      setValueInput(event.target.value);
    } else {
      return;
    }
  }

  function handlerSwitch() {
    setCurrencyChanged(currencyToChange);
    setCurrencyToChange(currencyChanged);
  }

  const rates = dataRates ? dataRates.rates : null;

  return (
    <div className="app-container">
      <div className="calculator-container">
        <TitleConverter />
        <div className="currency-container">
          <div className="rate-exchange-container">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="amount" className="labelText">
                Amount
              </label>
              <input
                id="amount"
                type="text"
                value={valueInput}
                pattern="^[+-]?([0-9]+\.?[0-9]{0,2}|\.[0-9]+)$"
                onChange={handlerInput}
                className="box"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <SelectExchange
                currency={currencyToChange}
                setCurrency={setCurrencyToChange}
                currenciesToMap={currencies}
                labelText="From:"
              />
              <MdOutlineChangeCircle className="switch-button" onClick={handlerSwitch} />
            </div>
            <SelectExchange
              currency={currencyChanged}
              setCurrency={setCurrencyChanged}
              currenciesToMap={currencies}
              labelText="To:"
            />
          </div>
          {isLoading ? (
            <Spinner />
          ) : isResolved ? (
            <div className="equality-exchange-container">
              {rates ? (
                <div>
                  <div className="big-equality-container">
                    <p
                      style={{
                        fontSize: "30px",
                        color: "gray",
                        fontWeight: "500",
                        fontFamily: "Arial",
                        marginBottom: "0px",
                      }}
                    >
                      {valueInput + currencyToChange.split("-")[1]} ={" "}
                    </p>
                    <p
                      style={{
                        fontSize: "40px",
                        color: "black",
                        fontWeight: "500",
                        fontFamily: "Arial",
                        marginTop: "16px",
                      }}
                    >
                      {(rates[symbolCurrencyChanged] * valueInput).toFixed(2) +
                        currencyChanged.split("-")[1]}
                    </p>
                  </div>
                  <div className="equalityCurrency-container">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        height: "30px",
                      }}
                    >
                      <p className="textExchange">
                        {defaultInputMoney.toFixed(2) +
                          " " +
                          currencyChanged.split("-")[0] +
                          "="}
                      </p>
                      <p className="textExchange">
                        {(1 / rates[symbolCurrencyChanged]).toFixed(2) +
                          " " +
                          currencyToChange.split("-")[0]}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        height: "30px",
                      }}
                    >
                      <p className="textExchange">
                        {defaultInputMoney.toFixed(2) +
                          " " +
                          currencyToChange.split("-")[0] +
                          "="}
                      </p>
                      <p className="textExchange">
                        {rates[symbolCurrencyChanged].toFixed(2) +
                          " " +
                          currencyChanged.split("-")[0]}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="information-container">
                <BsExclamationCircle
                  style={{
                    marginTop: "17px",
                    marginLeft: "10px",
                    color: "orange",
                    height: "20px",
                    width: "20px",
                  }}
                />
                <p
                  style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    color: "GrayText",
                    fontFamily: "Arial",
                  }}
                >
                  We use the market rate. This is for informational purpose only
                </p>
              </div>
            </div>
          ) : null}
        </div>
        {dataRates ? (
          <p className="date-information">
            Conversion from {currencyToChange.split("-")[1]} to{" "}
            {currencyChanged.split("-")[1]} - Last updated:{" "}
            {formatDate(new Date(dataRates.date))}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default HomePage;
