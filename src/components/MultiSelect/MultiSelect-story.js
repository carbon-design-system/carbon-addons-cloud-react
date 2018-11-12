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
    category: 'Category 1',
    options: [
      {
        id: 'opt-1',
        text: 'Option 1',
      },
      {
        id: 'opt-2',
        text: 'Option 2',
      },
    ],
  },
  {
    id: 'item-2',
    text: 'Item 2',
    category: 'Category 2',
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
    category: 'Category 3',
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
