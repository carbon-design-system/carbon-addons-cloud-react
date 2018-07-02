import React from 'react';
import { storiesOf } from '@storybook/react';
import Loading from '../Loading';

storiesOf('Loading', module).addWithInfo(
  'Default Loading',
  `The loading component is meant to replace the teal spinner for static page loads in the IBM Cloud platform.
  This loading pattern should be used in context and not tied to an overlay. For dynamic data loading use carbon skeleton components.`,
  () => (
    <div>
      <Loading style={{ margin: '200px auto' }} />
    </div>
  )
);
