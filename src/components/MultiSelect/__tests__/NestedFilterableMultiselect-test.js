import React from 'react';
import { mount } from 'enzyme';
import NestedFilterableMultiselect from '../NestedFilterableMultiselect';
import {
  assertMenuClosed,
  assertMenuOpen,
  findMenuIconNode,
  openMenu,
  generateItems,
  generateGenericItem,
} from '../../ListBox/test-helpers';

const listItemName = 'ListBoxMenuItem';

describe('NestedFilterableMultiselect', () => {
  let mockProps;

  describe('Simple multiselect', () => {
    beforeEach(() => {
      mockProps = {
        disabled: false,
        items: generateItems(5, index => ({
          id: `id-${index}`,
          label: `Item ${index}`,
          value: index,
        })),
        initialSelectedItems: [],
        onChange: jest.fn(),
        placeholder: 'Placeholder...',
      };
    });

    it('should render', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('should display all items when the menu is open initially', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      openMenu(wrapper);
      expect(wrapper.find(listItemName).length).toBe(mockProps.items.length);
    });

    it('should let the user toggle the menu by the menu icon', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      findMenuIconNode(wrapper).simulate('click');
      assertMenuOpen(wrapper, mockProps);
      findMenuIconNode(wrapper).simulate('click');
      assertMenuClosed(wrapper);
    });

    it('should not close the menu after a user makes a selection', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      openMenu(wrapper);
      wrapper
        .find(listItemName)
        .at(0)
        .simulate('click');
      assertMenuOpen(wrapper, mockProps);
    });

    it('should filter a list of items by the input value', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      openMenu(wrapper);
      expect(wrapper.find(listItemName).length).toBe(mockProps.items.length);
      wrapper.setState({ inputValue: '3' });
      expect(wrapper.find(listItemName).length).toBe(1);
    });

    it('should call `onChange` with each update to selected items', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      openMenu(wrapper);

      // Select the first two items
      wrapper
        .find(listItemName)
        .at(0)
        .simulate('click');

      expect(mockProps.onChange).toHaveBeenCalledTimes(1);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [mockProps.items[0]],
      });

      wrapper
        .find(listItemName)
        .at(1)
        .simulate('click');

      expect(mockProps.onChange).toHaveBeenCalledTimes(2);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [mockProps.items[0], mockProps.items[1]],
      });

      // Un-select the next two items
      wrapper
        .find(listItemName)
        .at(0)
        .simulate('click');
      expect(mockProps.onChange).toHaveBeenCalledTimes(3);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [mockProps.items[1]],
      });

      wrapper
        .find(listItemName)
        .at(0)
        .simulate('click');
      expect(mockProps.onChange).toHaveBeenCalledTimes(4);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [],
      });
    });
  });

  describe('multiselect with categories', () => {
    beforeEach(() => {
      mockProps = {
        disabled: false,
        items: generateItems(5, index => ({
          id: `id-${index}`,
          label: `Item ${index}`,
          value: index,
          category: `category-${index % 2 === 0 ? 1 : 2}`,
        })),
        initialSelectedItems: [],
        onChange: jest.fn(),
        placeholder: 'Placeholder...',
      };
    });

    it('should render', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      expect(wrapper).toMatchSnapshot();
      openMenu(wrapper);
      expect(
        wrapper.containsAllMatchingElements([
          <label className="bx--group-label">CATEGORY-1</label>,
          <label className="bx--group-label">CATEGORY-2</label>,
        ])
      ).toBe(true);
      expect(wrapper.find(listItemName).length).toBe(mockProps.items.length);
    });

    it('should clear all selections', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      openMenu(wrapper);

      // Select the first two items
      wrapper
        .find('.bx--checkbox-label')
        .at(0)
        .simulate('click');
      wrapper
        .find('.bx--checkbox-label')
        .at(1)
        .simulate('click');

      expect(mockProps.onChange).toHaveBeenCalledTimes(2);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [mockProps.items[0], mockProps.items[2]],
      });
      expect(wrapper.state().checkedSuboptions).toEqual([]);
      expect(wrapper.find('ListBoxSelection').prop('selectionCount')).toBe(2);

      // Clear all selection
      wrapper.find('.bx--list-box__selection--multi').simulate('click');
      expect(mockProps.onChange).toHaveBeenCalledTimes(3);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [],
      });
      expect(wrapper.state().checkedSuboptions).toEqual([]);
      expect(wrapper.find('ListBoxSelection').exists()).toBe(false);
    });
  });

  describe('multiselect with suboptions', () => {
    beforeEach(() => {
      mockProps = {
        disabled: false,
        items: generateItems(3, index => ({
          id: `id-${index}`,
          label: `Nested item ${index}`,
          value: index,
          category: `category-${index % 2 === 0 ? 1 : 2}`,
          options: [
            {
              id: 'option-id-1',
              label: 'Sub item 1',
            },
            {
              id: 'option-id-2',
              label: 'Sub item 2',
            },
          ],
        })),
        onChange: jest.fn(),
        placeholder: 'Placeholder...',
      };
    });

    it('should render', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      expect(wrapper).toMatchSnapshot();
      openMenu(wrapper);
      expect(
        wrapper.containsAllMatchingElements([
          <label className="bx--group-label">CATEGORY-1</label>,
          <label className="bx--group-label">CATEGORY-2</label>,
        ])
      ).toBe(true);
      // Expand the child items
      wrapper
        .find('.bx--checkbox-label')
        .at(0)
        .find('span')
        .simulate('click');
      expect(wrapper.find(listItemName).length).toBe(5);
      // Collapse the child items
      wrapper
        .find('.bx--checkbox-label')
        .at(0)
        .find('span')
        .simulate('click');
      expect(wrapper.find(listItemName).length).toBe(3);
    });

    it('should filter a list of items by the input value', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      openMenu(wrapper);
      expect(wrapper.find(listItemName).length).toBe(mockProps.items.length);
      wrapper.setState({ inputValue: 'Nested item 2' });
      expect(wrapper.find(listItemName).length).toBe(1);

      // Expand the child items
      wrapper
        .find('.bx--checkbox-label')
        .at(0)
        .find('span')
        .simulate('click');
      expect(wrapper.find(listItemName).length).toBe(3);
    });

    it('should filter a list of sub items by the input value', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      openMenu(wrapper);
      expect(wrapper.find(listItemName).length).toBe(mockProps.items.length);
      wrapper.setState({ inputValue: 'Sub item 2' });
      expect(wrapper.find(listItemName).length).toBe(3);

      // Expand the child items
      wrapper
        .find('.bx--checkbox-label')
        .at(0)
        .find('span')
        .simulate('click');
      expect(wrapper.find(listItemName).length).toBe(4);
    });

    it('should filter all items by the input value', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      openMenu(wrapper);
      expect(wrapper.find(listItemName).length).toBe(mockProps.items.length);
      wrapper.setState({ inputValue: 'xxx' });
      expect(wrapper.find(listItemName).length).toBe(0);

      // No group should exist
      expect(
        wrapper.containsAllMatchingElements([
          <label className="bx--group-label">CATEGORY-1</label>,
          <label className="bx--group-label">CATEGORY-2</label>,
        ])
      ).toBe(false);
    });

    it('should clear the input value', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      openMenu(wrapper);
      wrapper.setState({ inputValue: 'xxx' });

      wrapper.find('ListBoxSelection').prop('clearSelection')({
        stopPropagation: jest.fn(),
      });
      expect(wrapper.state().inputValue).toEqual('');
    });

    it('should call `onChange` with each update to selected items', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      openMenu(wrapper);

      // Select the first two items
      wrapper
        .find('.bx--checkbox-label')
        .at(0)
        .simulate('click');

      expect(mockProps.onChange).toHaveBeenCalledTimes(1);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [mockProps.items[0]],
      });
      expect(wrapper.state().checkedSuboptions).toEqual(
        mockProps.items[0].options.map(option => ({
          ...option,
          checked: true,
        }))
      );
      expect(
        wrapper
          .find('Checkbox')
          .at(0)
          .prop('indeterminate')
      ).toBe(false);
      expect(wrapper.find('ListBoxSelection').prop('selectionCount')).toBe(2);

      wrapper
        .find('.bx--checkbox-label')
        .at(1)
        .simulate('click');

      expect(mockProps.onChange).toHaveBeenCalledTimes(2);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [mockProps.items[0], mockProps.items[2]],
      });
      expect(wrapper.state().checkedSuboptions).toEqual([
        ...mockProps.items[0].options.map(option => ({
          ...option,
          checked: true,
        })),
        ...mockProps.items[2].options.map(option => ({
          ...option,
          checked: true,
        })),
      ]);
      expect(
        wrapper
          .find('Checkbox')
          .at(1)
          .prop('indeterminate')
      ).toBe(false);
      expect(wrapper.find('ListBoxSelection').prop('selectionCount')).toBe(4);

      // Un-select the next two items
      wrapper
        .find('.bx--checkbox-label')
        .at(0)
        .simulate('click');
      expect(mockProps.onChange).toHaveBeenCalledTimes(3);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [mockProps.items[2]],
      });
      expect(wrapper.state().checkedSuboptions).toEqual([
        ...mockProps.items[2].options.map(option => ({
          ...option,
          checked: true,
        })),
      ]);
      expect(wrapper.find('ListBoxSelection').prop('selectionCount')).toBe(2);

      wrapper
        .find('.bx--checkbox-label')
        .at(0)
        .simulate('click');
      expect(mockProps.onChange).toHaveBeenCalledTimes(4);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [],
      });
      expect(wrapper.state().checkedSuboptions).toEqual([]);
      expect(wrapper.find('ListBoxSelection').exists()).toBe(false);
    });

    it('should call `onChange` with each update to selected sub items', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      openMenu(wrapper);

      // Expand the child items
      wrapper
        .find('.bx--checkbox-label')
        .at(0)
        .find('span')
        .simulate('click');
      wrapper
        .find('.bx--checkbox-label')
        .at(1)
        .simulate('click');

      expect(mockProps.onChange).toHaveBeenCalledTimes(1);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [mockProps.items[0]],
      });
      expect(wrapper.state().checkedSuboptions).toEqual([
        {
          ...mockProps.items[0].options[0],
          checked: true,
        },
      ]);
      expect(
        wrapper
          .find('Checkbox')
          .at(0)
          .prop('indeterminate')
      ).toBe(true);
      expect(wrapper.find('ListBoxSelection').prop('selectionCount')).toBe(1);

      wrapper
        .find('.bx--checkbox-label')
        .at(2)
        .simulate('click');

      expect(mockProps.onChange).toHaveBeenCalledTimes(2);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [mockProps.items[0]],
      });
      expect(wrapper.state().checkedSuboptions).toEqual(
        mockProps.items[0].options.map(option => ({
          ...option,
          checked: true,
        }))
      );
      expect(
        wrapper
          .find('Checkbox')
          .at(1)
          .prop('indeterminate')
      ).toBe(false);
      expect(wrapper.find('ListBoxSelection').prop('selectionCount')).toBe(2);

      // Un-select the child items
      wrapper
        .find('.bx--checkbox-label')
        .at(1)
        .simulate('click');
      expect(mockProps.onChange).toHaveBeenCalledTimes(3);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [mockProps.items[0]],
      });
      expect(wrapper.state().checkedSuboptions).toEqual([
        {
          ...mockProps.items[0].options[1],
          checked: true,
        },
      ]);
      expect(
        wrapper
          .find('Checkbox')
          .at(0)
          .prop('indeterminate')
      ).toBe(true);
      expect(wrapper.find('ListBoxSelection').prop('selectionCount')).toBe(1);

      wrapper
        .find('.bx--checkbox-label')
        .at(1)
        .simulate('click');
      expect(mockProps.onChange).toHaveBeenCalledTimes(4);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [],
      });
      expect(wrapper.state().checkedSuboptions).toEqual([]);
      expect(
        wrapper
          .find('Checkbox')
          .at(0)
          .prop('indeterminate')
      ).toBe(false);
      expect(wrapper.find('ListBoxSelection').exists()).toBe(false);
    });

    it('should clear all selections', () => {
      const wrapper = mount(<NestedFilterableMultiselect {...mockProps} />);
      openMenu(wrapper);

      // Select the first two items
      wrapper
        .find('.bx--checkbox-label')
        .at(0)
        .simulate('click');
      wrapper
        .find('.bx--checkbox-label')
        .at(1)
        .simulate('click');

      expect(mockProps.onChange).toHaveBeenCalledTimes(2);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [mockProps.items[0], mockProps.items[2]],
      });
      expect(wrapper.state().checkedSuboptions).toEqual([
        ...mockProps.items[0].options.map(option => ({
          ...option,
          checked: true,
        })),
        ...mockProps.items[2].options.map(option => ({
          ...option,
          checked: true,
        })),
      ]);
      expect(
        wrapper
          .find('Checkbox')
          .at(1)
          .prop('indeterminate')
      ).toBe(false);
      expect(wrapper.find('ListBoxSelection').prop('selectionCount')).toBe(4);

      // Clear all selection
      wrapper.find('.bx--list-box__selection--multi').simulate('click');
      expect(mockProps.onChange).toHaveBeenCalledTimes(3);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItems: [],
      });
      expect(wrapper.state().checkedSuboptions).toEqual([]);
      expect(wrapper.find('ListBoxSelection').exists()).toBe(false);
    });
  });
});
