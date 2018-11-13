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
      },
      {
        id: 'opt-7',
        text: 'Option 7',
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
      },
      {
        id: 'opt-4',
        text: 'Option 4',
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
      },
      {
        id: 'opt-7',
        text: 'Option 7',
      },
    ],
  },
];
const defaultLabel = 'MultiSelect Label';
const defaultPlaceholder = 'Filter';

const types = {
  default: 'Default (default)',
  inline: 'Inline (inline)',
};

const props = () => ({
  filterable: boolean(
    'Filterable (`<MultiSelect.Filterable>` instead of `<MultiSelect>`)',
    false
  ),
  disabled: boolean('Disabled (disabled)', false),
  light: boolean('Light variant (light)', false),
  useTitleInItem: boolean('Show tooltip on hover', false),
  type: select('UI type (Only for `<MultiSelect>`) (type)', types, 'default'),
  label: text('Label (label)', defaultLabel),
  invalid: boolean('Show form validation UI (invalid)', false),
  invalidText: text(
    'Form validation UI content (invalidText)',
    'Invalid Selection'
  ),
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
      const { filterable, ...multiSelectProps } = props();
      const placeholder = !filterable ? undefined : defaultPlaceholder;
      return (
        <div style={{ width: 300 }}>
          <NestedFilterableMultiselect
            {...multiSelectProps}
            items={items}
            itemToString={item => (item ? item.text : '')}
            placeholder={defaultPlaceholder}
          />
        </div>
      );
    })
  );
