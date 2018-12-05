import React from 'react';
import { storiesOf } from '@storybook/react';

import { withKnobs, boolean, select, text } from '@storybook/addon-knobs';
import MouseOverTooltip from '../Tooltip';

const directions = {
  'Bottom (bottom)': 'bottom',
  'Left (left)': 'left',
  'Top (top)': 'top',
  'Right (right)': 'right',
};

const props = {
  withIcon: () => ({
    clickToOpen: boolean('Click to open (clickToOpen)', false),
    direction: select('Tooltip direction (direction)', directions, 'bottom'),
    triggerText: text('Trigger text (triggerText)', 'Tooltip label'),
  }),
  withoutIcon: () => ({
    showIcon: false,
    direction: select('Tooltip direction (direction)', directions, 'bottom'),
    triggerText: text('Trigger text (triggerText)', 'Tooltip label'),
  }),
};

storiesOf('MouseOverTooltip', module)
  .addDecorator(withKnobs)
  .addWithInfo(
    'default (bottom)',
    `
      Tooltips are used to supply additional information to an element when hovering over it. By default,
      the tooltip will render above the element and will go away when the mouse moves. The example below shows the default scenario.
    `,
    () => (
      <div style={{ marginTop: '2rem', marginLeft: '50%' }}>
        <MouseOverTooltip {...props.withIcon()}>
          <p className="bx--tooltip__label">Tooltip subtitle</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaeca cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </MouseOverTooltip>
      </div>
    )
  )
  .addWithInfo(
    'no icon',
    `
      Tooltips are used to supply additional information to an element when hovering over it. By default,
      the tooltip will render with an information Icon and will go away when the mouse moves. The example
      below shows the option to exclude the Icon.
    `,
    () => (
      <div style={{ marginTop: '2rem', marginLeft: '50%' }}>
        <MouseOverTooltip {...props.withoutIcon()}>
          <p className="bx--tooltip__label">Tooltip subtitle</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaeca cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </MouseOverTooltip>
      </div>
    )
  );
