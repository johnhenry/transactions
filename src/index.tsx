/* @refresh reload */
import { render } from "solid-js/web";

// import "./index.css";
import Application from "./Application";

render(
  () => <Application />,
  document.getElementById("application-root") as HTMLElement
);
