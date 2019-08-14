/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import {
  findMenuNode,
  findMenuItemNode,
  openMenu,
  assertMenuOpen,
  generateItems,
  generateGenericItem,
} from '../ListBox/test-helpers';
import ComboBox from '../ComboBox';

const findInputNode = wrapper => wrapper.find('.bx--text-input');
const downshiftActions = {
  setHighlightedIndex: jest.fn(),
};
const clearInput = wrapper =>
  wrapper.instance().handleOnInputValueChange('', downshiftActions);

describe('ComboBox', () => {
  let mockProps;

  beforeEach(() => {
    mockProps = {
      items: generateItems(5, generateGenericItem),
      onChange: jest.fn(),
      placeholder: 'Filter...',
      type: 'default',
    };
  });

  it('should display the placeholder text when no items are selected and the control is not focused', () => {
    const wrapper = mount(<ComboBox {...mockProps} />);
    expect(findInputNode(wrapper).prop('value')).toBe('');
    expect(findInputNode(wrapper).prop('placeholder')).toBe(
      mockProps.placeholder
    );
  });

  it('should display the menu of items when a user clicks on the input', () => {
    const wrapper = mount(<ComboBox {...mockProps} />);
    findInputNode(wrapper).simulate('click');

    assertMenuOpen(wrapper, mockProps);
  });

  it('should display custom div of an item', () => {
    const itemToElement = item => {
      return <div className="custom-div">{item.label}</div>;
    };
    const wrapper = mount(
      <ComboBox {...mockProps} itemToElement={itemToElement} />
    );
    findInputNode(wrapper).simulate('click');

    assertMenuOpen(wrapper, mockProps);

    expect(
      wrapper.containsAllMatchingElements([
        <div className="custom-div">Item 0</div>,
        <div className="custom-div">Item 1</div>,
        <div className="custom-div">Item 2</div>,
        <div className="custom-div">Item 3</div>,
        <div className="custom-div">Item 4</div>,
      ])
    ).toBe(true);
  });

  it('should call `onChange` each time an item is selected', () => {
    const wrapper = mount(<ComboBox {...mockProps} />);
    expect(mockProps.onChange).not.toHaveBeenCalled();

    for (let i = 0; i < mockProps.items.length; i++) {
      clearInput(wrapper);
      openMenu(wrapper);
      findMenuItemNode(wrapper, i).simulate('click');
      expect(mockProps.onChange).toHaveBeenCalledTimes(i + 1);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItem: mockProps.items[i],
      });
    }
  });

  it('capture filter text events', () => {
    const onInputChange = jest.fn();
    const wrapper = mount(
      <ComboBox {...mockProps} onInputChange={onInputChange} />
    );

    findInputNode(wrapper).simulate('change', {
      target: { value: 'something' },
    });

    expect(onInputChange).toHaveBeenCalledWith('something');
  });

  describe('should display initially selected item found in `initialSelectedItem`', () => {
    it('using an object type for the `initialSelectedItem` prop', () => {
      const wrapper = mount(
        <ComboBox {...mockProps} initialSelectedItem={mockProps.items[0]} />
      );
      expect(findInputNode(wrapper).prop('value')).toEqual(
        mockProps.items[0].label
      );
    });

    it('using a string type for the `initialSelectedItem` prop', () => {
      // Replace the 'items' property in mockProps with a list of strings
      mockProps = {
        ...mockProps,
        items: ['1', '2', '3'],
      };

      const wrapper = mount(
        <ComboBox {...mockProps} initialSelectedItem={mockProps.items[1]} />
      );

      expect(findInputNode(wrapper).prop('value')).toEqual(mockProps.items[1]);
    });
  });

  describe('when disabled', () => {
    it('should not let the user edit the input node', () => {
      const wrapper = mount(<ComboBox {...mockProps} disabled={true} />);
      expect(findInputNode(wrapper).prop('disabled')).toBe(true);
      expect(findInputNode(wrapper).prop('value')).toBe('');

      findInputNode(wrapper).simulate('change', {
        target: {
          value: 'a',
        },
      });

      expect(findInputNode(wrapper).prop('value')).toBe('');
    });

    it('should not let the user expand the menu', () => {
      const wrapper = mount(<ComboBox {...mockProps} disabled={true} />);
      openMenu(wrapper);
      expect(findMenuNode(wrapper).length).toBe(0);
    });
  });

  describe('downshift quirks', () => {
    it('should not trigger the menu when typing a space in input', () => {
      const wrapper = mount(<ComboBox {...mockProps} />);

      openMenu(wrapper);
      findInputNode(wrapper).simulate('change', {
        target: {
          value: ' ',
        },
      });

      expect(findMenuNode(wrapper).length).toBe(1);
    });

    it('should set `inputValue` to an empty string if a falsey-y value is given', () => {
      const wrapper = mount(<ComboBox {...mockProps} />);

      wrapper.instance().handleOnInputValueChange('foo', downshiftActions);
      expect(wrapper.state('inputValue')).toBe('foo');

      wrapper.instance().handleOnInputValueChange(null, downshiftActions);
      expect(wrapper.state('inputValue')).toBe('');
    });
  });
});
