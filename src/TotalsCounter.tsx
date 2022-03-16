import type { Component } from "solid-js";
import { createSignal, createEffect } from "solid-js";
import { request } from "@solid-primitives/graphql";
import { DEFAULT_URI } from "./settings.js";

const TotalsCounter: Component = (props: { total: Number; bTotal: Number }) => {
  return (
    <>
      <div>Total {props.total}</div>
      <div>BTotal {props.bTotal}</div>
    </>
  );
};
export default TotalsCounter;
