import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { request } from "@solid-primitives/graphql";
import { DEFAULT_URI } from "./settings.js";
import { Select, createOptions } from "@thisbeyond/solid-select";

// Import default styles. (All examples use this via a global import)
import "@thisbeyond/solid-select/style.css";

const NewTransactionForm: Component = (props: { refetch: Function }) => {
  let merchant_name: HTMLInputElement,
    date: HTMLInputElement,
    amount: HTMLInputElement;
  let categoriesElement;
  const [categories, setCategories] = createSignal([]);
  const changeCategories = (selected) => {
    setCategories(selected);
  };

  return (
    <form>
      <label>
        {" "}
        Merchant Name <input type="text" ref={merchant_name} />
      </label>

      <label>
        {" "}
        Date <input type="date" ref={date} />
      </label>
      <label>
        {" "}
        Amount <input type="number" value="0" ref={amount} />
      </label>
      <label>
        {" "}
        Categories
        <Select
          multiple
          onChange={changeCategories}
          {...createOptions([], {
            createable: true,
          })}
        />
      </label>
      <button
        type="button"
        onClick={async () => {
          const amount_final = Number(amount.value);
          if (!(amount_final > 0)) {
            return alert("amount must be a positive number");
          }
          const date_ = new Date(date.value);
          if (!date_.valueOf()) {
            return alert("date must be a valid date");
          }
          const date_final = `"${date_.getFullYear()}-${
            date_.getMonth() + 1
          }-${date_.getDate()}"`;
          const categories_final = categories()
            .map((x) => `"${x}"`)
            .join(",");
          const merchant_name_intermediate = merchant_name.value;
          if (!merchant_name_intermediate) {
            return alert("merchant name must be provided");
          }
          const merchant_name_final = `"${merchant_name_intermediate}"`;
          const query = `mutation {
  addTransaction(amount: ${amount_final}, category: [${categories_final}], date: ${date_final}, merchant_name: ${merchant_name_final}) {
    _id
  }
}`;
          await request(DEFAULT_URI, query);
          props.refetch();
          merchant_name.value = "";
          categoriesElement.value = "";
          date.value = "";
          amount.value = "0";
        }}
      >
        Add Transaction
      </button>
    </form>
  );
};
export default NewTransactionForm;
