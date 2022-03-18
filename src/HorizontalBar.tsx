import type { Component } from "solid-js";
import { Show } from "solid-js";

const HorizontalBar: Component<{ percentage: string }> = (props: {
  percentage: string;
}) => {
  // const percentage = (props.value / props.max) * 100;
  return (
    <Show when={props.percentage !== "NaN%"} fallback={"(calculating...)"}>
      {props.percentage}{" "}
      <span class="horizontal-bar">
        <span class="bar" style={`height:100%;width:${props.percentage};%`} />
      </span>
    </Show>
  );
};
export default HorizontalBar;
