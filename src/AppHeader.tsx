import type { Component } from "solid-js";

const AppHeader: Component<{
  colorSchemePreference: Function;
  updateColorSchemePreference: Function;
}> = (props: any) => (
  <header>
    <div class="logo"> </div> John's Transactions
    <div style={{ "margin-left": "auto" }}>
      <button
        class="color-scheme-button"
        title={`Click to change color scheme. Currently: ${
          props.colorSchemePreference() || "(system preference)"
        }`}
        onClick={() => {
          switch (props.colorSchemePreference()) {
            case "dark":
              props.updateColorSchemePreference("light");
              break;
            case "light":
              props.updateColorSchemePreference("");
              break;
            default:
              props.updateColorSchemePreference("dark");
              break;
          }
          localStorage.setItem(
            "color-scheme-preference",
            props.colorSchemePreference()
          );
        }}
      ></button>
    </div>
  </header>
);

export default AppHeader;
