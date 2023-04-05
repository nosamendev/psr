import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node'
import  {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Commissions from "./Commissions";

const server = setupServer(
    rest.get('http://localhost:3000/commissions', (req, res, ctx) => {
      return res(ctx.json(
        [
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
             {
                "date":"2016-01-06",
                "user_id":2,
                "user_type":"juridical",
                "type":"cash_out",
                "operation":{
                   "amount":300.00,
                   "currency":"EUR"
                }
             }
        ]
      ))
    }),
    rest.get("https://developers.paysera.com/tasks/api/cash-in", (req, res, ctx) => {
          return res(
            ctx.json([
                {
                    "percents":"0.03",
                    "max":{
                       "amount":"5",
                       "currency":"EUR"
                    }
                 }
            ]))
        }),
        rest.get("https://developers.paysera.com/tasks/api/cash-out-natural", (req, res, ctx) => {
          return res(
            ctx.json([
                {
                    "percents":"0.3",
                    "week_limit":{
                       "amount":"1000",
                       "currency":"EUR"
                    }
                 }
            ]))
        }),
        rest.get("https://developers.paysera.com/tasks/api/cash-out-juridical", (req, res, ctx) => {
          return res(
            ctx.json([
                {
                    "percents":"0.3",
                    "min":{
                       "amount":"0.5",
                       "currency":"EUR"
                    }
                 }
            ]))
        }),
  )

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());


test('loads and displays loading', async () => {
    render(<Commissions />);

    const loading = await screen.findAllByText(/Loading.../i);  
    expect(loading).toBeInTheDocument();

})

test("handles server error", async () => {
    server.resetHandlers(
      rest.get("http://localhost:3000/commissions", (req, res, ctx) =>
        res(ctx.status(500))
      ),
      rest.get("https://developers.paysera.com/tasks/api/cash-in", (req, res, ctx) =>
        res(ctx.status(500))
      ),
      rest.get("https://developers.paysera.com/tasks/api/cash-out-natural", (req, res, ctx) =>
        res(ctx.status(500))
      ),
      rest.get("https://developers.paysera.com/tasks/api/cash-out-juridical", (req, res, ctx) =>
        res(ctx.status(500))
      )
    );
  
    render(<Commissions />);

    const loading = await screen.findAllByText(/Error/i);  
    expect(loading).toBeInTheDocument();
    
  });