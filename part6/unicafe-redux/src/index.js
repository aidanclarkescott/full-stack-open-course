import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import reducer from "./reducer";

const store = createStore(reducer);

const App = () => {
  const counterAction = (actionString) => {
    store.dispatch({
      type: actionString,
    });
  };

  return (
    <div>
      <button onClick={() => counterAction("GOOD")}>good</button>
      <button onClick={() => counterAction("OK")}>neutral</button>
      <button onClick={() => counterAction("BAD")}>bad</button>
      <button onClick={() => counterAction("ZERO")}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>neutral {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  );
};

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

renderApp();
store.subscribe(renderApp);
