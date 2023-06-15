import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
import reducer, { initialState } from "./reducer";
import { StateProvider } from "./StateProvider";
import { Provider } from "react-redux";
import store from "./store/store";
import { BrowserRouter } from "react-router-dom";

// ReactDOM.render(
//   <React.StrictMode>
//     <StateProvider initialState={initialState} reducer={reducer}>
//       <App />
//     </StateProvider>
//   </React.StrictMode>,
//   document.getElementById("root")
// );
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <StateProvider initialState={initialState} reducer={reducer}> */}
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
    {/* </StateProvider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
