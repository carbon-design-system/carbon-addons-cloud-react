/* eslint-disable no-console */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button, Dropdown } from 'carbon-components-react';
import {
  OrderSummary,
  OrderSummaryHeader,
  OrderSummaryCategory,
  OrderSummaryList,
  OrderSummaryListItem,
  OrderSummaryTotal,
  OrderSummaryFooter,
} from '../OrderSummary';

storiesOf('OrderSummary', module)
  .addWithInfo(
    'Simple',
    `
      This component is used to display the items a user will be purchasing. This version does not include OrderSummaryCategory.
    `,
    () => (
      <OrderSummary>
        <OrderSummaryHeader title="Order Summary">
          <Dropdown
            onChange={selectedItemInfo => console.log(selectedItemInfo)}
            initialSelectedItem={{ id: 'usd', label: 'USD' }}
            items={[
              {
                id: 'usd',
                label: 'USD',
              },
              {
                id: 'gbp',
                label: 'GBP',
              },
              {
                id: 'nok',
                label: 'NOK',
              },
              {
                id: 'eur',
                label: 'EUR',
              },
            ]}
          />
        </OrderSummaryHeader>
        <OrderSummaryList>
          <OrderSummaryListItem />
          <OrderSummaryListItem text="Detail 2" price="$20.00" />
          <OrderSummaryListItem text="Detail 3" price="$40.00" />
        </OrderSummaryList>
        <OrderSummaryTotal
          summaryText="Total due now:"
          summaryPrice="$0.00"
          summaryDetails="estimated">
          <Button>Primary Button</Button>
          <Button kind="secondary">Primary Button</Button>
        </OrderSummaryTotal>
        <OrderSummaryFooter
          footerText="Need Help?"
          linkText="Contact Bluemix Sales"
          href="www.google.com"
        />
      </OrderSummary>
    )
  )
  .addWithInfo(
    'Category',
    `
      This component is used to display the items a user will be purchasing. The category version of OrderSummary can break the items being purchased into categories.
    `,
    () => (
      <OrderSummary>
        <OrderSummaryHeader title="Order Summary">
          <Dropdown
            onChange={selectedItemInfo => console.log(selectedItemInfo)}
            initialSelectedItem={{ id: 'usd', label: 'USD' }}
            items={[
              {
                id: 'usd',
                label: 'USD',
              },
              {
                id: 'gbp',
                label: 'GBP',
              },
              {
                id: 'nok',
                label: 'NOK',
              },
              {
                id: 'eur',
                label: 'EUR',
              },
            ]}
          />
        </OrderSummaryHeader>

        <OrderSummaryList>
          <OrderSummaryCategory>
            <OrderSummaryListItem />
            <OrderSummaryListItem text="Detail 2" price="$20.00" />
            <OrderSummaryListItem text="Detail 3" price="$40.00" />
          </OrderSummaryCategory>
          <OrderSummaryCategory>
            <OrderSummaryListItem />
            <OrderSummaryListItem text="Detail 2" price="$20.00" />
            <OrderSummaryListItem text="Detail 3" price="$40.00" />
          </OrderSummaryCategory>
          <OrderSummaryCategory>
            <OrderSummaryListItem />
            <OrderSummaryListItem text="Detail 2" price="$20.00" />
            <OrderSummaryListItem text="Detail 3" price="$40.00" />
          </OrderSummaryCategory>
        </OrderSummaryList>
        <OrderSummaryTotal
          summaryText="Total due now:"
          summaryPrice="$0.00"
          summaryDetails="estimated">
          <Button>Primary Button</Button>
          <Button kind="secondary">Primary Button</Button>
        </OrderSummaryTotal>
        <OrderSummaryFooter
          footerText="Need Help?"
          linkText="Contact Bluemix Sales"
          href="www.google.com"
        />
      </OrderSummary>
    )
  );
