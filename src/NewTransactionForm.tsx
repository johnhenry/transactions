import type { Component } from "solid-js";
import { createSignal, Show } from "solid-js";
import { request } from "@solid-primitives/graphql";
import { DEFAULT_URI } from "./settings.js";
import { Select, createOptions } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";
const CreateNewTransactionQuery = ({
  amount,
  categories,
  date,
  merchant_name,
}) => {
  const query = `mutation {
  addTransaction(amount: ${amount}, category: [${categories}], date: ${date}, merchant_name: ${merchant_name}) {
    _id
  }
}`;
  return query;
};

const NewTransactionForm: Component<{ refetch: Function }> = (props: {
  refetch: Function;
}) => {
  let merchant_name: HTMLInputElement,
    date: HTMLInputElement,
    amount: HTMLInputElement;
  let categoriesElement;
  const [categories, setCategories] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const changeCategories = (selected) => {
    setCategories(selected);
  };

  return (
    <form class="new-transaction-form">
      <Show
        when={!loading()}
        fallback={<label>Loading Transaction...</label>}
        children={null}
      >
        <h2>Add a new transaction</h2>
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
          Amount ($){" "}
          <input
            type="number"
            min="0.01"
            value="0.01"
            step="0.01"
            ref={amount}
          />
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
          class="add-transaction"
          onClick={async () => {
            if (!loading()) {
              try {
                setLoading(true);
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
                const merchant_name_intermediate = merchant_name.value.trim();
                if (!merchant_name_intermediate) {
                  return alert("merchant name must be provided");
                }
                const merchant_name_final = `"${merchant_name_intermediate}"`;
                const query = CreateNewTransactionQuery({
                  amount: amount_final,
                  categories: categories_final,
                  date: date_final,
                  merchant_name: merchant_name_final,
                });
                await request(DEFAULT_URI, query);
              } finally {
                setLoading(false);
                props.refetch();
                merchant_name.value = "";
                categoriesElement.value = "";
                date.value = "";
                amount.value = "0";
              }
            }
          }}
        >
          Add Transaction
        </button>
      </Show>
    </form>
  );
};
export default NewTransactionForm;
