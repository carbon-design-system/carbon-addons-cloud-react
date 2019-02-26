import React from 'react';
import debounce from 'lodash/debounce';
import { iconInfoGlyph } from 'carbon-icons';
import { Icon } from 'carbon-components-react';
import MouseOverTooltip from '../Tooltip';
import { shallow, mount } from 'enzyme';

jest.mock('lodash/debounce');

const mockCancel = jest.fn();
debounce.mockImplementation(fn =>
  Object.assign(fn, {
    cancel: mockCancel,
  })
);

describe('Tooltip', () => {
  describe('Renders as expected with defaults', () => {
    const wrapper = mount(
      <MouseOverTooltip triggerText="Tooltip">
        <p className="bx--tooltip__label">Tooltip label</p>
        <p>Lorem ipsum dolor sit amet</p>
      </MouseOverTooltip>
    );

    const trigger = wrapper.find('.bx--tooltip__trigger');

    describe('tooltip trigger', () => {
      it('renders a tooltip container', () => {
        expect(trigger.length).toEqual(1);
      });

      it('renders the info icon', () => {
        const icon = trigger.find(Icon);
        expect(icon.length).toBe(1);
        expect(icon.props().icon).toBe(iconInfoGlyph);
      });
    });
  });

  describe('events', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('hover changes state with icon', () => {
      const wrapper = mount(<MouseOverTooltip triggerText="Tooltip" />);
      const icon = wrapper.find(Icon);
      icon.simulate('mouseover');
      expect(wrapper.state().open).toEqual(true);
      icon.simulate('mouseout');
      expect(wrapper.state().open).toEqual(false);
      expect(mockCancel.mock.calls.length).toBe(1);
    });

    it('focus changes state with icon', () => {
      const wrapper = mount(<MouseOverTooltip triggerText="Tooltip" />);
      const icon = wrapper.find(Icon);
      icon.simulate('mouseover');
      expect(wrapper.state().open).toEqual(true);
      icon.simulate('focus');
      expect(wrapper.state().open).toEqual(false);
    });

    it('blur changes state with icon', () => {
      const wrapper = mount(<MouseOverTooltip triggerText="Tooltip" />);
      const icon = wrapper.find(Icon);
      icon.simulate('mouseover');
      expect(wrapper.state().open).toEqual(true);
      icon.simulate('blur');
      expect(wrapper.state().open).toEqual(false);
    });

    it('hover changes state with no icon', () => {
      const wrapper = mount(
        <MouseOverTooltip showIcon={false} triggerText="Tooltip" />
      );
      const trigger = wrapper.find('.bx--tooltip__trigger');
      trigger.simulate('mouseover');
      expect(wrapper.state().open).toEqual(true);
      trigger.simulate('mouseout');
      expect(wrapper.state().open).toEqual(false);
    });

    it('focus changes state with no icon', () => {
      const wrapper = mount(
        <MouseOverTooltip showIcon={false} triggerText="Tooltip" />
      );
      const trigger = wrapper.find('.bx--tooltip__trigger');
      trigger.simulate('mouseover');
      expect(wrapper.state().open).toEqual(true);
      trigger.simulate('focus');
      expect(wrapper.state().open).toEqual(false);
    });

    it('blur changes state with no icon', () => {
      const wrapper = mount(
        <MouseOverTooltip showIcon={false} triggerText="Tooltip" />
      );
      const trigger = wrapper.find('.bx--tooltip__trigger');
      trigger.simulate('mouseover');
      expect(wrapper.state().open).toEqual(true);
      trigger.simulate('blur');
      expect(wrapper.state().open).toEqual(false);
    });

    it('mouseover tooltip changes state with no icon', () => {
      const wrapper = mount(
        <MouseOverTooltip showIcon={false} triggerText="Tooltip" />
      );
      const trigger = wrapper.find('.bx--tooltip__trigger');
      trigger.simulate('mouseover');
      expect(wrapper.state().open).toEqual(true);
      const tooltip = wrapper.find('FloatingMenu');
      tooltip.simulate('mouseover');
      expect(wrapper.state().open).toEqual(false);
    });

    it('click changes state when clickToOpen is set', () => {
      const wrapper = mount(
        <MouseOverTooltip clickToOpen triggerText="Tooltip" />
      );
      const icon = wrapper.find(Icon);
      icon.simulate('click');
      expect(wrapper.state().open).toEqual(true);
      icon.simulate('click');
      expect(wrapper.state().open).toEqual(false);
    });

    it('hover does not change state when clickToOpen is set', () => {
      const wrapper = mount(
        <MouseOverTooltip clickToOpen triggerText="Tooltip" />
      );
      const icon = wrapper.find(Icon);
      icon.simulate('mouseover');
      expect(wrapper.state().open).toEqual(false);
      icon.simulate('mouseout');
      expect(wrapper.state().open).toEqual(false);
    });

    it('Enter key press changes state when clickToOpen is set', () => {
      const wrapper = mount(
        <MouseOverTooltip clickToOpen triggerText="Tooltip" />
      );
      const icon = wrapper.find(Icon);
      icon.simulate('keyDown', { which: 'Enter' });
      expect(wrapper.state().open).toEqual(true);
      icon.simulate('keyDown', { key: 13 });
      expect(wrapper.state().open).toEqual(false);
    });

    it('Space key press changes state when clickToOpen is set', () => {
      const wrapper = mount(
        <MouseOverTooltip clickToOpen triggerText="Tooltip" />
      );
      const icon = wrapper.find(Icon);
      icon.simulate('keyDown', { which: ' ' });
      expect(wrapper.state().open).toEqual(true);
      icon.simulate('keyDown', { key: 32 });
      expect(wrapper.state().open).toEqual(false);
    });

    it('A different key press does not change state', () => {
      const wrapper = mount(
        <MouseOverTooltip clickToOpen triggerText="Tooltip" />
      );
      const icon = wrapper.find(Icon);
      icon.simulate('keyDown', { which: 'x' });
      expect(wrapper.state().open).toEqual(false);
    });
  });
});
