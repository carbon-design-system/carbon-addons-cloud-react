import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, boolean, select, text } from '@storybook/addon-knobs';

import NestedFilterableMultiselect from './NestedFilterableMultiselect';

const items = [
  {
    id: 'item-1',
    text: 'Item 1',
    category: 'Europe',
  },
  {
    id: 'item-2',
    text: 'Item 2',
    category: 'Europe',
    options: [
      {
        id: 'opt-3',
        text: 'Option 3',
      },
      {
        id: 'opt-4',
        text: 'Option 4',
        options: [
          {
            id: 'subopt-25',
            text: 'SubOption 25',
          },
          {
            id: 'subopt-30',
            text: 'SubOption 30',
          },
        ],
      },
    ],
  },
  {
    id: 'item-3',
    text: 'Item 3',
    category: 'Asia',
    options: [
      {
        id: 'opt-5',
        text: 'Option 5',
      },
      {
        id: 'opt-6',
        text: 'Option 6',
      },
    ],
  },
  {
    id: 'item-4',
    text: 'Item 4',
    category: 'America',
    options: [
      {
        id: 'opt-7',
        text: 'Option 7',
        options: [
          {
            id: 'subopt-20',
            text: 'SubOption 20',
          },
          {
            id: 'subopt-15',
            text: 'SubOption 15',
          },
          {
            id: 'subopt-18',
            text: 'SubOption 18',
          },
        ],
      },
      {
        id: 'opt-8',
        text: 'Option 8',
        options: [
          {
            id: 'subopt-5',
            text: 'SubOption 5',
          },
          {
            id: 'subopt-10',
            text: 'SubOption 10',
          },
        ],
      },
    ],
  },
  {
    id: 'item-5',
    text: 'Item 5',
    category: 'America',
    options: [
      {
        id: 'opt-9',
        text: 'Option 9',
      },
      {
        id: 'opt-10',
        text: 'Option 10',
      },
    ],
  },
];
const selectedItems = [
  {
    id: 'item-2',
    text: 'Item 2',
    category: 'Europe',
    options: [
      {
        id: 'opt-3',
        text: 'Option 3',
        checked: true,
      },
      {
        id: 'opt-4',
        text: 'Option 4',
        options: [
          {
            id: 'subopt-25',
            text: 'SubOption 25',
          },
          {
            id: 'subopt-30',
            text: 'SubOption 30',
            checked: true,
          },
        ],
      },
    ],
  },
  {
    id: 'item-3',
    text: 'Item 3',
    category: 'Asia',
    options: [
      {
        id: 'opt-5',
        text: 'Option 5',
      },
      {
        id: 'opt-6',
        text: 'Option 6',
        checked: true,
      },
    ],
  },
  {
    id: 'item-4',
    text: 'Item 4',
    category: 'America',
    options: [
      {
        id: 'opt-7',
        text: 'Option 7',
        checked: true,
        options: [
          {
            id: 'subopt-20',
            text: 'SubOption 20',
          },
          {
            id: 'subopt-15',
            text: 'SubOption 15',
          },
          {
            id: 'subopt-18',
            text: 'SubOption 18',
          },
        ],
      },
      {
        id: 'opt-8',
        text: 'Option 8',
        options: [
          {
            id: 'subopt-5',
            text: 'SubOption 5',
          },
          {
            id: 'subopt-10',
            text: 'SubOption 10',
          },
        ],
      },
    ],
  },
];

const flattenItems = [
  {
    id: 'item-1',
    text: 'Item 1',
    category: 'Europe',
    level: 0,
  },
  {
    id: 'item-2',
    text: 'Item 2',
    category: 'Europe',
    level: 0,
    hasChildren: true,
  },
  {
    id: 'opt-3',
    text: 'Option 3',
    category: 'Europe',
    level: 1,
    parentId: 'item-2',
  },
  {
    id: 'opt-4',
    text: 'Option 4',
    category: 'Europe',
    level: 1,
    hasChildren: true,
    parentId: 'item-2',
  },
  {
    id: 'subopt-25',
    text: 'SubOption 25',
    category: 'Europe',
    level: 2,
    parentId: 'opt-4',
  },
  {
    id: 'subopt-30',
    text: 'SubOption 30',
    category: 'Europe',
    level: 2,
    parentId: 'opt-4',
  },
  {
    id: 'item-3',
    text: 'Item 3',
    category: 'Asia',
    level: 0,
    hasChildren: true,
  },
  {
    id: 'opt-5',
    text: 'Option 5',
    category: 'Asia',
    level: 1,
    parentId: 'item-3',
  },
  {
    id: 'item-4',
    text: 'Item 4',
    category: 'America',
    level: 0,
    hasChildren: true,
  },
  {
    id: 'opt-7',
    text: 'Option 7',
    category: 'America',
    level: 1,
    hasChildren: true,
    parentId: 'item-4',
  },
  {
    id: 'subopt-20',
    text: 'SubOption 20',
    category: 'America',
    level: 2,
    parentId: 'opt-7',
  },
  {
    id: 'subopt-15',
    text: 'SubOption 15',
    category: 'America',
    level: 2,
    parentId: 'opt-7',
  },
  {
    id: 'opt-8',
    text: 'Option 8',
    category: 'America',
    level: 1,
    parentId: 'item-4',
  },
];
const flattenSelectedItems = [
  {
    id: 'item-2',
    text: 'Item 2',
    category: 'Europe',
    level: 0,
    hasChildren: true,
  },
  {
    id: 'opt-3',
    text: 'Option 3',
    category: 'Europe',
    level: 1,
    parentId: 'item-2',
  },
  {
    id: 'subopt-30',
    text: 'SubOption 30',
    category: 'Europe',
    level: 2,
    parentId: 'opt-4',
  },
  {
    id: 'item-3',
    text: 'Item 3',
    category: 'Asia',
    level: 0,
    hasChildren: true,
  },
  {
    id: 'opt-5',
    text: 'Option 5',
    category: 'Asia',
    level: 1,
    parentId: 'item-3',
  },
  {
    id: 'item-4',
    text: 'Item 4',
    category: 'America',
    level: 0,
    hasChildren: true,
  },
  {
    id: 'opt-7',
    text: 'Option 7',
    category: 'America',
    level: 1,
    hasChildren: true,
    parentId: 'item-4',
  },
];

const defaultPlaceholder = 'Filter';

const types = {
  default: 'Default (default)',
  inline: 'Inline (inline)',
};

const props = () => ({
  flatList: boolean('Flat list', false),
  disabled: boolean('Disabled (disabled)', false),
  light: boolean('Light variant (light)', false),
  onChange: action('onChange'),
});

storiesOf('NestedFilterableMultiselect', module)
  .addDecorator(withKnobs)
  .add(
    'default',
    withInfo({
      text: `
        Nested Filterable Multiselect
      `,
    })(() => {
      const { flatList, ...multiSelectProps } = props();
      return (
        <div style={{ width: 300 }}>
          <NestedFilterableMultiselect
            {...multiSelectProps}
            items={flatList ? flattenItems : items}
            itemToString={item => (item ? item.text : '')}
            initialSelectedItems={
              flatList ? flattenSelectedItems : selectedItems
            }
            placeholder={defaultPlaceholder}
          />
        </div>
      );
    })
  );
