import React from 'react';
import { shallow } from 'enzyme';
import GroupLabel from '../GroupLabel';

describe('GroupLabel', () => {
  it('should render', () => {
    const wrapper = shallow(<GroupLabel />);
    expect(wrapper).toMatchSnapshot();
  });
});
