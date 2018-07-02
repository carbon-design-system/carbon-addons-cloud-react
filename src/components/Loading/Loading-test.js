import React from 'react';
import Loading from './Loading';
import { mount } from 'enzyme';

describe('Loading', () => {
  describe('Renders as expected', () => {
    const wrapper = mount(<Loading title="IBM Cloud is Loading" />);

    it('Renders a container', () => {
      expect(wrapper.find('.bx--cloud-loading').length).toEqual(1);
    });

    it('Renders 1 svg', () => {
      expect(wrapper.find('svg').length).toEqual(1);
    });

    it('Renders 3 linearGradients', () => {
      expect(wrapper.find('linearGradient').length).toEqual(3);
    });

    it('Renders 5 "think" lines', () => {
      expect(wrapper.find('.bx--cloud-loading__think').length).toEqual(5);
    });

    it('Renders with a custom title', () => {
      expect(wrapper.find('title').text()).toEqual('IBM Cloud is Loading');
    });
  });
});
