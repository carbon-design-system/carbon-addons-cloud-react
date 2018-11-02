import React from 'react';
import { mount } from 'enzyme';
import MultiSelect from '../../MultiSelect';
import {
  assertMenuClosed,
  assertMenuOpen,
  findMenuIconNode,
  openMenu,
  generateItems,
  generateGenericItem,
} from '../../ListBox/test-helpers';

const listItemName = 'ListBoxMenuItem';

describe('MultiSelect.Filterable', () => {
  let mockProps;

  beforeEach(() => {
    mockProps = {
      disabled: false,
      items: generateItems(5, generateGenericItem),
      initialSelectedItems: [],
      onChange: jest.fn(),
      placeholder: 'Placeholder...',
    };
  });
});
