import React from 'react';
import { shallow } from 'enzyme';

import Header from '.';

const defaultProps = {
  pageTitle: 'FOOBAR',
  children: null,
};

describe('<Header />', () => {
  it('renders as expected', () => {
    const wrapper = shallow(<Header {...defaultProps} />);

    expect(wrapper.find('h1')).toHaveLength(1);
  });
});
