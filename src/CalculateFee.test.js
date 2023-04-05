import { render, screen } from "@testing-library/react";
import CalculateFee from "./CalculateFee";

const props1 = {
    index: 0,
    users: [
        {
            "date":"2016-01-05",
            "user_id":1,
            "user_type":"natural",
            "type":"cash_in",
            "operation":{
               "amount":200.00,
               "currency":"EUR"
            }
         },
    ],
    userId: 1,
    type: "cash_in",
    user_type: "natural",
    amount: 200.00,
    date: "2016-01-05",
    feeCashInPercents: 0.03,
    feeCashInMax: 5,
    feeCashOutNaturalPercents: 0.3,
    feeCashOutNaturalWeekLimit: 1000,
    feeCashOutLegalPercents: 0.3,
    feeCashOutLegalMin: 0.5
};

test("displays fee for cash_in natural", async () => {
    render(<CalculateFee {...props1} />);
  
    const fee = await screen.findByText("0.06");
    expect(fee).toBeInTheDocument();
});

const props2 = {
    index: 0,
    users: [
        {
            "date":"2016-01-06",
            "user_id":2,
            "user_type":"juridical",
            "type":"cash_out",
            "operation":{
               "amount":300.00,
               "currency":"EUR"
            }
         },
    ],
    userId: 2,
    type: "cash_out",
    user_type: "juridical",
    amount: 300.00,
    date: "2016-01-06",
    feeCashInPercents: 0.03,
    feeCashInMax: 5,
    feeCashOutNaturalPercents: 0.3,
    feeCashOutNaturalWeekLimit: 1000,
    feeCashOutLegalPercents: 0.3,
    feeCashOutLegalMin: 0.5
};

test("displays fee for cash_out juridical", async () => {
    render(<CalculateFee {...props2} />);
  
    const fee = await screen.findByText("0.90");
    expect(fee).toBeInTheDocument();
});

const props3 = {
    index: 0,
    users: [
        {
            "date":"2016-01-06",
            "user_id":1,
            "user_type":"natural",
            "type":"cash_out",
            "operation":{
               "amount":3000.00,
               "currency":"EUR"
            }
         },
    ],
    userId: 1,
    type: "cash_out",
    user_type: "natural",
    amount: 3000.00,
    date: "2016-01-06",
    feeCashInPercents: 0.03,
    feeCashInMax: 5,
    feeCashOutNaturalPercents: 0.3,
    feeCashOutNaturalWeekLimit: 1000,
    feeCashOutLegalPercents: 0.3,
    feeCashOutLegalMin: 0.5
};

test("displays fee for cash_out natural", async () => {
    render(<CalculateFee {...props3} />);
  
    const fee = await screen.findByText("6.00");
    expect(fee).toBeInTheDocument();
});

const props4 = {
    index: 0,
    users: [
        {
            "date":"2016-01-10",
            "user_id":1,
            "user_type":"juridical",
            "type":"cash_in",
            "operation":{
               "amount":1000000.00,
               "currency":"EUR"
            }
         },
    ],
    userId: 1,
    type: "cash_in",
    user_type: "juridical",
    amount: 1000000.00,
    date: "2016-01-10",
    feeCashInPercents: 0.03,
    feeCashInMax: 5,
    feeCashOutNaturalPercents: 0.3,
    feeCashOutNaturalWeekLimit: 1000,
    feeCashOutLegalPercents: 0.3,
    feeCashOutLegalMin: 0.5
};

test("displays fee for cash_in juridical", async () => {
    render(<CalculateFee {...props4} />);
  
    const fee = await screen.findByText("5.00");
    expect(fee).toBeInTheDocument();
});

const props5 = {
    index: 3,
    users: [
        {
            "date":"2016-01-06",
            "user_id":1,
            "user_type":"natural",
            "type":"cash_out",
            "operation":{
               "amount":30000.00,
               "currency":"EUR"
            }
         },
         {
            "date":"2016-01-07",
            "user_id":1,
            "user_type":"natural",
            "type":"cash_out",
            "operation":{
               "amount":1000.00,
               "currency":"EUR"
            }
         },
         {
            "date":"2016-01-07",
            "user_id":1,
            "user_type":"natural",
            "type":"cash_out",
            "operation":{
               "amount":100.00,
               "currency":"EUR"
            }
         },
         {
            "date":"2016-01-10",
            "user_id":1,
            "user_type":"natural",
            "type":"cash_out",
            "operation":{
               "amount":100.00,
               "currency":"EUR"
            }
         },
    ],
    userId: 1,
    type: "cash_out",
    user_type: "natural",
    amount: 100.00,
    date: "2016-01-10",
    feeCashInPercents: 0.03,
    feeCashInMax: 5,
    feeCashOutNaturalPercents: 0.3,
    feeCashOutNaturalWeekLimit: 1000,
    feeCashOutLegalPercents: 0.3,
    feeCashOutLegalMin: 0.5
};

test("displays fee for cash_out natural, 4 operations in the same week", async () => {
    render(<CalculateFee {...props5} />);
  
    const fee = await screen.findByText("0.30");
    expect(fee).toBeInTheDocument();
});