import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { request } from "@solid-primitives/graphql";
import { DEFAULT_URI } from "./settings.js";
import { Select, createOptions } from "@thisbeyond/solid-select";
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
    <form class="new-transaction-form">
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
        <input type="number" min="0.01" value="0.01" step="0.01" ref={amount} />
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

          const stuff = [
            {
              amount: 50.42,
              category: ["Food and Drink", "Restaurants"],
              date: "2029-01-01",
              merchant_name: "Crepevine",
              id: 0,
            },
            {
              amount: 19.43,
              category: ["Shops", "Supermarkets and Groceries"],
              date: "2029-01-03",
              merchant_name: "Whole Foods",
              id: 1,
            },
            {
              amount: 0.35,
              category: ["Shops", "Digital Purchase"],
              date: "2029-01-05",
              merchant_name: "Amazon",
              id: 2,
            },
            {
              amount: 3.17,
              category: ["Travel", "Car Service", "Ride Share"],
              date: "2029-01-05",
              merchant_name: "Lyft",
              id: 3,
            },
            {
              amount: 2.26,
              category: ["Food and Drink", "Restaurants"],
              date: "2029-01-06",
              merchant_name: "Space Bar",
              id: 4,
            },
            {
              amount: 2742.93,
              category: ["Payments", "Rent"],
              date: "2029-01-06",
              merchant_name: "Avalon Mountain View",
              id: 5,
            },
            {
              amount: 174.48,
              category: ["Shops", "Digital Purchase"],
              date: "2029-01-06",
              merchant_name: "Amazon",
              id: 6,
            },
            {
              amount: 11.29,
              category: ["Travel", "Car Service", "Ride Share"],
              date: "2029-01-06",
              merchant_name: "Lyft",
              id: 7,
            },
            {
              amount: 5.77,
              category: ["Travel", "Car Service", "Ride Share"],
              date: "2029-01-06",
              merchant_name: "Lyft",
              id: 8,
            },
            {
              amount: 53.92,
              category: ["Shops", "Clothing and Accessories"],
              date: "2029-01-07",
              merchant_name: "Target",
              id: 9,
            },
            {
              amount: 3.64,
              category: ["Service", "News Reporting"],
              date: "2029-01-09",
              merchant_name: "Washington Post",
              id: 10,
            },
            {
              amount: 62.73,
              category: ["Shops", "Digital Purchase"],
              date: "2029-01-10",
              merchant_name: "Amazon",
              id: 11,
            },
            {
              amount: 0.26,
              category: ["Travel", "Car Service", "Ride Share"],
              date: "2029-01-10",
              merchant_name: "Lyft",
              id: 12,
            },
            {
              amount: 3.62,
              category: ["Travel", "Car Service", "Ride Share"],
              date: "2029-01-11",
              merchant_name: "Lyft",
              id: 13,
            },
            {
              amount: 0.79,
              category: ["Travel", "Car Service", "Ride Share"],
              date: "2029-01-11",
              merchant_name: "Lyft",
              id: 14,
            },
            {
              amount: 47.71,
              category: ["Food and Drink", "Restaurants"],
              date: "2029-01-12",
              merchant_name: "Cascal",
              id: 15,
            },
            {
              amount: 9.82,
              category: ["Travel", "Car Service", "Ride Share"],
              date: "2029-01-12",
              merchant_name: "Lyft",
              id: 16,
            },
            {
              amount: 10.88,
              category: ["Food and Drink", "Restaurants"],
              date: "2029-01-13",
              merchant_name: "Space Bar",
              id: 17,
            },
            {
              amount: 1.99,
              category: ["Travel", "Car Service", "Ride Share"],
              date: "2029-01-14",
              merchant_name: "Lyft",
              id: 18,
            },
            {
              amount: 17.37,
              category: ["Food and Drink", "Restaurants"],
              date: "2029-01-16",
              merchant_name: "Space Bar",
              id: 19,
            },
            {
              amount: 8.36,
              category: ["Travel", "Car Service", "Ride Share"],
              date: "2029-01-16",
              merchant_name: "Lyft",
              id: 20,
            },
            {
              amount: 249.33,
              category: ["Travel", "Airlines and Aviation Services"],
              date: "2029-01-19",
              merchant_name: "Blue Origin",
              id: 21,
            },
            {
              amount: 15.33,
              category: ["Food and Drink", "Restaurants"],
              date: "2029-01-20",
              merchant_name: "Cascal",
              id: 22,
            },
            {
              amount: 62.28,
              category: ["Shops", "Supermarkets and Groceries"],
              date: "2029-01-20",
              merchant_name: "Whole Foods",
              id: 23,
            },
            {
              amount: 7.03,
              category: ["Travel", "Car Service", "Ride Share"],
              date: "2029-01-20",
              merchant_name: "Lyft",
              id: 24,
            },
            {
              amount: 8.14,
              category: ["Travel", "Car Service", "Ride Share"],
              date: "2029-01-20",
              merchant_name: "Lyft",
              id: 25,
            },
            {
              amount: 55.34,
              category: ["Food and Drink", "Restaurants"],
              date: "2029-01-21",
              merchant_name: "Cascal",
              id: 26,
            },
            {
              amount: 1.04,
              category: ["Food and Drink", "Restaurants"],
              date: "2029-01-21",
              merchant_name: "Space Bar",
              id: 27,
            },
            {
              amount: 7.51,
              category: ["Travel", "Car Service", "Ride Share"],
              date: "2029-01-22",
              merchant_name: "Lyft",
              id: 28,
            },
            {
              amount: 2.36,
              category: ["Travel", "Car Service", "Ride Share"],
              date: "2029-01-23",
              merchant_name: "Lyft",
              id: 29,
            },
            {
              amount: 2.11,
              category: ["Travel", "Car Service", "Ride Share"],
              date: "2029-01-23",
              merchant_name: "Lyft",
              id: 30,
            },
            {
              amount: 216.73,
              category: ["Travel", "Airlines and Aviation Services"],
              date: "2029-01-24",
              merchant_name: "Blue Origin",
              id: 31,
            },
            {
              amount: 56.6,
              category: ["Food and Drink", "Restaurants"],
              date: "2029-01-25",
              merchant_name: "Crepevine",
              id: 32,
            },
            {
              amount: 43.1,
              category: ["Shops", "Digital Purchase"],
              date: "2029-01-25",
              merchant_name: "Amazon",
              id: 33,
            },
            {
              amount: 68.92,
              category: ["Recreation", "Gyms and Fitness Centers"],
              date: "2029-01-28",
              merchant_name: "24 Hour Fitness",
              id: 34,
            },
            {
              amount: 1.06,
              category: ["Shops", "Digital Purchase"],
              date: "2029-01-28",
              merchant_name: "Amazon",
              id: 35,
            },
            {
              amount: 50.49,
              category: ["Food and Drink", "Restaurants"],
              date: "2029-01-31",
              merchant_name: "Cascal",
              id: 36,
            },
            {
              amount: 10.72,
              category: ["Travel", "Car Service", "Ride Share"],
              date: "2029-01-31",
              merchant_name: "Lyft",
              id: 37,
            },
          ];
          alert(1);
          for (const { amount, category, date, merchant_name } of stuff) {
            const qq = `mutation {
  addTransaction(amount: ${amount}, category: [${category
              .map((x) => `"${x}"`)
              .join(
                ","
              )}], date: "${date}", merchant_name: "${merchant_name}") {
    _id
  }
}`;
            await request(DEFAULT_URI, qq);
          }
          alert(2);
          // await request(DEFAULT_URI, query);
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
