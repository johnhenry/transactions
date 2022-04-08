export interface Success {
  success: Boolean;
}

export type Transaction = {
  amount: Number;
  category: [String];
  date: String;
  merchant_name: String;
  hidden: Boolean;
  _id: String;
};
