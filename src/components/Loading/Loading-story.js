import React from 'react';
import { storiesOf } from '@storybook/react';
import Loading from '../Loading';

storiesOf('Loading', module).addWithInfo('Default Loading', ``, () => (
  <div>
    <Loading style={{ margin: '200px auto' }} />
  </div>
));
